import React, { useState } from "react";
import { json } from "react-router-dom";
import notescontext from "./notesContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes);

  //Get all Notes
  const getNote = async () => {
    //API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('auth-token')
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };
  //Add a Note  
  const addNote = async (title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/addNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('auth-token')
      },
      body: JSON.stringify({ title, description, tag }),
    });

    // console.log("adding a new note");
    const note = await response.json();
    setNotes(notes.concat(note));
  };
  //Delete a Note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deleteNote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('auth-token')
      },
    });
    const json = response.json();
    console.log(json);
    // console.log("deleting the note with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };
  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //Api call

    const response = await fetch(`${host}/api/notes/updateNote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('auth-token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = response.json();
    console.log(json)
    let newNotes = JSON.parse(JSON.stringify(notes));
    //Logic to edit notes
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };
  return (
    <notescontext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNote }}
    >
      {props.children}
    </notescontext.Provider>
  );
};
export default NoteState;
