//importing express modules
const express = require("express");
const path = require("path");
//importing fs modules from node
const fs = require("fs");
//importing package to handle unique id's
const uuid = require('uuid');

//initializing the app variable to create the routes and use express middleware
const app = express();
const PORT = process.env.PORT || 8080;


//Set up the root directory of the serving files
app.use(express.static("public"));
// Sets up the app with express middleware functionalities to handle data parsing of requests/responses to JSON format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Define the user html routes
/* Routes
 * GET `/notes` - Should return the `notes.html` file.
 * GET `*` - Should return the `index.html` file */

/* Starting route to send users to the index.html */
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* Serving the route to the notes.html file */
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//Define the API's endpoints
/* * API routes * */

//GET `/api/v1/notes` - reads the `db.json` file and return all saved notes as JSON.
app.get("/api/v1/notes", function(req, res) {
    //Reads the json file async
    const dbFile = fs.readFileSync(path.join(__dirname, "db", "db.json"), "utf8");
    //PArsing the file is necesary to displayed it like a JSON object array
    const dbFileJSON = JSON.parse(dbFile);
    //Return the json db file to the user
    return res.json(dbFileJSON);
});

//POST `/api/v1/notes` - receives a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/v1/notes", function(req, res) {
    //create the new note object from the request body
    let newNote = req.body;

    //Reads the JSON file asynchronous
    let dbFile = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");

    //Turn object into JSON format to work it out 
    let dbFileJSON = JSON.parse(dbFile);

    //Call function to generate new ID
    //newNote.id = generatesId(dbFileJSON);
    newNote.id = uuid.v4();

    //pushs the new note to the notes array
    dbFileJSON.push(newNote);

    //Overrides the jsondb file with the new note pushed
    //Stringify the JSON array is necesary to write the file with the JSON like object string representation, otherwise we might write a bunch of [Object][Object]
    fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(dbFileJSON), "utf8");

    //returns the new note added to the user
    return res.json(newNote);
});

//* DELETE `/api/notes/:id` - receives a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file. */
app.delete("/api/v1/notes/:id", function(req, res) {
    //grab the selected id from the request body parameters
    let noteId = req.params.id;
    console.log(noteId);
    //Get the db file in JSON array format
    let dbFile = fs.readFileSync(path.join(__dirname, "db", "db.json"), "utf8");
    let dbFileJSON = JSON.parse(dbFile);

    //delete element that matches the requested id
    let newDBFile = dbFileJSON.filter((note) => note.id != noteId);
    console.log(JSON.stringify(newDBFile));
    //write the new dbFile
    fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(newDBFile), "utf8");
    console.log(`Note id: ${noteId} removed from DB File`);
    return res.status(200).end();
});

//generates the new unique id for the next note to add
/* function generatesId(argDBFileArray) {
    let nextId = argDBFileArray.length + 1;
    if (argDBFileArray.filter((note) => { note.id === nextId })) {
        nextId = nextId + 1;
    }
    return nextId;
} */

//Starts the server
app.listen(PORT, function() {
    console.log(`Note Taker Server listening on PORT: ${PORT} open the app here: http://localhost:${PORT}`);
});