/* Routes
 * GET `/notes` - Should return the `notes.html` file.
 * GET `*` - Should return the `index.html` file */

//importing express modules
const express = require("express");
const path = require("path");
//importing fs modules from node
const fs = require("fs");

//initializing the app variable to create the routes and use express middleware
const app = express();
const port = process.PORT || 8080;

// Sets up the app with express middleware functionalities to handle data parsing of requests/responses to JSON format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Set up the root directory of the serving files
app.use(express.static(__dirname + '/public'));

//Define the user html routes

/* Starting route to send users to the index.html */
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});

/* Serving the route to the notes.html file */
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//Define the API's endpoint routes by
//adding functionalities of POST and GET

//Starts the server
app.listen(port, function() {
    console.log(`Note Taker Server listening on PORT: ${port} open the app here: http://localhost:${port}`);
});