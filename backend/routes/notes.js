const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// const { Schema } = mongoose;

//Route-1 Get all the notes of logged in user in using POST: in('/api/auth/fetchallnotes) login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});
//Route-2 Add the notes of logged in user in using POST: in('/api/auth/addnote) login required

router.post(
  "/addNote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),

    body("description", "description must be 5 character long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //const notes = await Notes.find({ user: req.user.id });
      //If there are error return bad error and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);
//Route-3 Update an existing notes of logged in user in using PUT: in('/api/notes/updateNote) login required
router.put(
  "/updateNote/:id",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),

    body("description", "description must be 5 character long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    try {
      //Create a net Note object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //Find the note to update and update it
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("not found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("NOt Allowed");
      }
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route-4 Delete an existing notes of logged in user in using DELETE: in('/api/notes/deleteNote) login required
router.delete(
  "/deleteNote/:id",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),

    body("description", "description must be 5 character long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //Create a net Note object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //Find the note to delete and delete it
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("not found");
      }

      //Allow only logged in user to delete
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("NOt Allowed");
      }
      note = await Note.findByIdAndDelete(req.params.id);
      res.json({ Success: "Note has been deleted", note: note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);
module.exports = router;
