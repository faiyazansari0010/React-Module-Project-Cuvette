import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { addNoteGroup, setIsMobileNoteView } from "../../Redux/notesSlice";
import "./NotesSideBar.css";
import { useNavigate } from "react-router-dom";





const NotesSideBar = () => {
  const navigate = useNavigate();
  const notesData = useSelector((state) => state.notes.notesData);
  const isMobileNoteView = useSelector((state) => state.notes.isMobileNoteView);
  const dispatch = useDispatch();

  const colors = {
    Heliotrope: "#b38bfa",
    Blush_Pink: "#ff79f2",
    Malibu1: "#43e6fc",
    Apricot: "#f19576",
    Blue_Ribbon: "#0047ff",
    Malibu2: "#6691ff",
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteGroupDetails, setNoteGroupDetails] = useState({
    noteGroupName: "",
    noteGroupColour: "",
  });
  const [errors, setErrors] = useState({
    noteNameError: "",
    noteColourError: "",
    noteDuplicateError: "",
  });

  function getDisplayPic(title) {
    const words = title.trim().split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  }

  function isGroupNameExists(name) {
    return notesData.some(
      (note) => note.noteGroupName.toLowerCase() === name.toLowerCase()
    );
  }

  function handleCreateNoteGroup() {
    let hasError = false;
    const newErrors = {
      noteNameError: "",
      noteColourError: "",
      noteDuplicateError: "",
    };
    const trimmedName = noteGroupDetails.noteGroupName.trim();

    if (trimmedName.length < 3) {
      newErrors.noteNameError = "Group name must be at least 3 characters!";
      hasError = true;
    }

    if (!noteGroupDetails.noteGroupColour) {
      newErrors.noteColourError = "Please select a color!";
      hasError = true;
    }

    if (isGroupNameExists(trimmedName)) {
      newErrors.noteDuplicateError =
        "Group name already exists! Please choose a unique name!";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const displayPic = getDisplayPic(trimmedName);
    const newNoteGroup = {
      noteID: nanoid(),
      noteGroupName: trimmedName,
      noteGroupColour: noteGroupDetails.noteGroupColour,
      noteGroupDisplayPic: displayPic,
    };

    dispatch(addNoteGroup(newNoteGroup));

    try {
      const existing = JSON.parse(localStorage.getItem("notesData")) || [];
      localStorage.setItem(
        "notesData",
        JSON.stringify([...existing, newNoteGroup])
      );
    } catch (error) {
      console.error("Failed to update localStorage:", error);
    }
    setIsModalOpen(false);
    setNoteGroupDetails({
      noteGroupName: "",
      noteGroupColour: "",
      noteGroupDisplayPic: "",
    });
    setErrors({
      noteNameError: "",
      noteColourError: "",
      noteDuplicateError: "",
    });

    if (window.innerWidth <= 400) {
      dispatch(setIsMobileNoteView(true));
    }

    navigate(`/notes/${newNoteGroup.noteID}`);
  }
  //1536 703
  return (
    <>
      <div
        className={`sideBarContainer ${isMobileNoteView ? "hideSidebar" : ""}`}
      >
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
          className="sideBarTitle"
        >
          Pocket Notes
        </span>
        <div className="groupListContainer">
          {notesData.map((item) => (
            <NavLink
              to={`/notes/${item.noteID}`}
              className={({ isActive }) =>
                `groupItemContainer ${isActive ? "active-link" : ""}`
              }
              key={item.noteID}
              onClick={() => {
                if (window.innerWidth <= 400) {
                  dispatch(setIsMobileNoteView(true));
                }
              }}
            >
              <span
                className="displayPicSideBar"
                style={{ backgroundColor: colors[item.noteGroupColour] }}
              >
                {item.noteGroupDisplayPic}
              </span>
              <span className="noteTitleSideBar">{item.noteGroupName}</span>
            </NavLink>
          ))}
        </div>
        <button className="addGroupButton" onClick={() => setIsModalOpen(true)}>
          +
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setNoteGroupDetails({ noteGroupName: "", noteGroupColour: "" });
          setErrors({
            noteNameError: "",
            noteColourError: "",
            noteDuplicateError: "",
          });
        }}
        overlayClassName="modalOverlay"
        className="modalContent"
      >
        <h3 className="modalHeading">Create New Group</h3>
        <div className="grpNameContainer">
          <p>Group Name</p>
          <input
            type="text"
            placeholder="Enter group name"
            value={noteGroupDetails.noteGroupName}
            onChange={(e) => {
              const inputValue = e.target.value;

              setNoteGroupDetails({
                ...noteGroupDetails,
                noteGroupName: inputValue,
              });

              if (inputValue.trim().length >= 3) {
                setErrors((prev) => ({ ...prev, noteNameError: "" }));
              }

              if (!isGroupNameExists(inputValue.trim())) {
                setErrors((prev) => ({ ...prev, noteDuplicateError: "" }));
              }
            }}
          />

          {errors.noteNameError ? (
            <p className="errorText">{errors.noteNameError}</p>
          ) : (
            errors.noteDuplicateError && (
              <p className="errorText">{errors.noteDuplicateError}</p>
            )
          )}
        </div>

        <div className="chooseColorContainer">
          <p>Choose colour</p>
          <div className="coloursContainer">
            {Object.entries(colors).map(([colorName, hex]) => (
              <span
                key={colorName}
                id={colorName}
                onClick={() => {
                  setNoteGroupDetails({
                    ...noteGroupDetails,
                    noteGroupColour: colorName,
                  });
                  setErrors((prev) => ({ ...prev, noteColourError: "" }));
                }}
                style={{ backgroundColor: hex }}
                className={`${
                  noteGroupDetails.noteGroupColour === colorName
                    ? "selected"
                    : ""
                }`}
              ></span>
            ))}
          </div>
          {errors.noteColourError && (
            <p className="errorText">{errors.noteColourError}</p>
          )}
        </div>

        <button className="createBtn" onClick={handleCreateNoteGroup}>
          Create
        </button>
      </Modal>
    </>
  );
};

export default NotesSideBar;
