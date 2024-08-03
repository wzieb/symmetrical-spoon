const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
// Helper method for generating unique ids
const uuid = require("./Develop/helpers/uuid");
const PORT = process.env.PORT || 3001;
//middlware?
app.use(express.json());//giving server ability to read json data
app.use(express.urlencoded({ extended: true }));//
app.use(express.static(path.join(__dirname, "Develop/public")));//setting up routes behind the scenes to send the rest of the files associated with html files we're sending back. 

//Static landing page:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});
//all notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});
//route for getNotes function line 31
//need to read the notes from db.json and send it back to the client as json\
//send paramater in this ex "data" is the contents of the path ("./Develop/db/db.json")
app.get("/api/notes", (req, res) => {
  fs.readFile("./Develop/db/db.json", "utf-8", (err, data) => {
    res.send(data);
  });
});

//route that receives the request for the note and saves it to the file
app.post("/api/notes", (req, res) => {
  //read file to get a copy of the db.json
  fs.readFile("./Develop/db/db.json", "utf-8", (err, data) => {
    console.log(`${req.method} request receivd to add a review`);
    //creating items for for req.body
    const { title, text } = req.body;
    //if they inputed both a title and text then...
    if (title && text) {
      //variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      //when we read db.json we're setting it to a readable format (from a string back to an array) and saving this array to notes variable
      const notes = JSON.parse(data);

      notes.push(newNote);
      //need to save db.json after new note is added, saving it back as json format
      fs.writeFile("./Develop/db/db.json", JSON.stringify(notes), (err) => {
        //what we're sending back to the client
        const response = {
          status: "Success!",
          body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
      });
    } else {
      res.status(500).json("Error in posting note");
    }
  });
});

//delete note
app.delete("/api/notes/:id", (req, res) => {
  //just trying to see what's going on
  console.log(req.params.id);
  //read file to get a copy of the db.json
  fs.readFile("./Develop/db/db.json", "utf-8", (err, data) => {
    console.log(`${req.method} request receivd to add a review`);
   
      //when we read db.json we're setting it to a readable format (from a string back to an array) and saving this array to notes variable
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note)=>{
        return note.id !== req.params.id;
        //if it it does match, pass it to updatedNotes. the one that doesn't match is the deleted item. 
      })

      //need to save db.json after new note is added, saving it back as json format
      fs.writeFile("./Develop/db/db.json", JSON.stringify(updatedNotes), (err) => {
        //what we're sending back to the client
        const response = {
          status: "Success!",
          body: updatedNotes,
        };
        console.log(response);
        res.status(201).json(response);
      });
  });
});


//initializing express:
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
