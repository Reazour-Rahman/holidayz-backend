# here's a step-by-step guide for deploying your Express app to Glitch:

#Before you deploy in your project

## In the project , create a new file called server.js.

## Copy the code from your app.js file (or any other file containing your Express app) into server.js.

## In server.js, replace any occurrences of app.listen with the following code:
```javascript
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
```
(This will tell Glitch to use the appropriate port when starting your app.)

In your package.json insert this code inside the script.

In package.json, add the following line to the scripts section:
```javascript
"start": "node server.js",
"watch": "nodemon server.js"
```
(This will tell Glitch how to start your app).


#Glitch part :

* Create an account on Glitch if you haven't already, and create a new project by clicking on the "New Project" button on the dashboard.
* Past your backend repo link to the comfirm prompt
* In glitch code editor's default env file ; insert your all env with value (If you have, Port is mandotory)
*In the Glitch editor, click on the "Tools" button on the left-hand side of the screen, then click on "Import and Export".

*Click on "Import from GitHub" and enter the URL of your GitHub repository (if you have one). Alternatively, you can click on "Import from Repo" to import your code directly from a Git repository.

*Wait for the import process to finish, which may take a few minutes depending on the size of your app.

Once the import is complete, you can check your link in share button.

That's it! Your Express app is now deployed to Glitch and can be accessed by anyone with the link. Glitch also provides a number of features for managing your app, such as logs, version control, and collaboration tools.
