const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
var cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cexwu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("holidayz");
    const blogsCollection = database.collection("blogs");
    // const ordersCollection = database.collection("orders");
    // const cartCollection = database.collection("cart");
    const reviewCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    // GET Blog API
    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const count = await cursor.count();
      let products;
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send({
        count,
        products,
      });
    });

    // POST API
    app.post("/blogs", async (req, res) => {
      const product = req.body;
      const result = await blogsCollection.insertOne(product);
      res.json(result);
    });

    // DELETE packages
    app.delete('/blogs/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await blogsCollection.deleteOne(query);
        res.json(result);
    })

    // POST Order
    // app.post('/orders', async (req, res) => {
    //     const order = req.body;
    //     const result = await ordersCollection.insertOne(order);
    //     console.log(`A document was inserted with the _id: ${result.insertedId}`);
    //     res.json(result)
    // });

    // GET orders
    // app.get('/orders', async (req, res) => {
    //     const cursor = ordersCollection.find({});
    //     const orders = await cursor.toArray();
    //     console.log(orders)
    //     res.send(orders);
    // })

    /* _______________________________________________________________________ */

    // GET users
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      console.log(users);
      res.send(users);
    });

    // POST user
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    /* ________________________________________________________________________ */

    // POST to cart
    // app.post('/cart', async (req, res) => {
    //   const cart = req.body;
    //   const result = await ordersCollection.insertOne(cart);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    //   res.json(result)
    // });

    // // DELETE orders
    // app.delete('/orders/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const result = await ordersCollection.deleteOne(query);
    //     res.json(result);
    //     // console.log(result)
    // })

    // POST reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      //console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    // GET reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
      //console.log(reviews)
    });

    // // Users POST
    // app.post('/users', async (req, res) => {
    //     const user = req.body;
    //     const result = await usersCollection.insertOne(user)
    //     res.json(result)
    //     console.log("console " ,result)
    // })

    // Make admin
    // app.put('/users/admin', async (req, res) => {
    //     const filter = { email: req.body.email }
    //     const updateDoc = { $set: { role: 'admin' } }
    //     const result = await usersCollection.updateOne(filter, updateDoc)
    //     res.json(result)
    //     console.log(result)
    // })

    app.put('/users/admin', async (req, res) => {
      const email = req.body.email 
      const filter = {email : email}
      console.log(email);
      const updateDoc = {
          $set : {
              role : 'admin'
          }
      }
      const user = await usersCollection.updateOne(filter, updateDoc);
      res.json(user)
  });

    // admin Check
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email }
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin })
    })

    // Update
    // app.put('/blogs/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const filter = { _id: ObjectId(id) }
    //     const updateDoc = { $set: { status: req.body.status } }
    //     const result = await blogsCollection.updateOne(filter, updateDoc)
    //     res.json(result);
    // })
    
    app.put('/blogs/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const data = req.body
      const query = {_id : ObjectId(id)}
      const option = {upsert : true}
      const updateDoc = {
          $set : {
            thumb : data.thumb, 
            title : data.title,
            totalHotel : data.totalHotel,
            avgPrice : data.avgPrice ,
            descAbout : data.descAbout,
            desc1 : data.desc1, 
            visitPlace : data.visitPlace, 
            image1 : data.image1, 
            image2 : data.image2, 
            image3 : data.image3,
            rating : data.rating,
            day : data.day,
            Latitude : data.Latitude,
            longitude : data.longitude,
            status : data.status
          }
      }
      const result = await blogsCollection.updateOne(query, updateDoc, option)
      res.json(result)
  })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
