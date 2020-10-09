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

//Files root path directory
/* const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html"); */

//Set up the root directory of the serving files
app.use(express.static("public"));
// Sets up the app with express middleware functionalities to handle data parsing of requests/responses to JSON format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Define the user html routes

/* Starting route to send users to the index.html */
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* Serving the route to the notes.html file */
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//Define the API's endpoint routes by
//adding functionalities of POST and GET

/* * The following API routes should be created:
 * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
 * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
 * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file. */

app.get("/api/v1/notes", function(req, res) {

    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(err, data) {
        if (err) {
            throw err;
        }
        const dbfile = JSON.parse(data);
        console.log(dbfile);
        res.json(dbfile);
    });

});

app.post("/api/v1/notes", function(req, res) {
    let newNote = req.body;
    let dbFile = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    let dbFileJSON = JSON.parse(dbFile);
    dbFileJSON.push(newNote);

    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(dbFileJSON), "utf8");

    return res.json(newNote);
});

//Starts the server
app.listen(port, function() {
    console.log(`Note Taker Server listening on PORT: ${port} open the app here: http://localhost:${port}`);
});