import React, { useContext } from "react";
import noteContext from "../context/notes/notesContext";

const Notesitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  return (
    <div className="col-md-3">
      <div className="card my-2">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <i
            className="mx-3 fa-solid fa-pen-to-square"
            onClick={() => {
              updateNote(note);
            }}
          ></i>
          {/* <i className="mx-3 fa-regular fa-eye"></i> */}
          <i
            className="mx-3 fa-solid fa-trash"
            onClick={() => {
              deleteNote(note._id);
              props.showAlert("Deleted Successfully", "success");
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Notesitem;
