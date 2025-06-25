import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addNewNote } from "../../Redux/notesSlice";
import { useLocation } from "react-router-dom";
import { setIsMobileNoteView } from "../../Redux/notesSlice";
import "../NotesPage/NotesPage.css";

const NotesPage = () => {
  const colors = {
    Heliotrope: "#b38bfa",
    Blush_Pink: "#ff79f2",
    Malibu1: "#43e6fc",
    Apricot: "#f19576",
    Blue_Ribbon: "#0047ff",
    Malibu2: "#6691ff",
  };
  const { noteID } = useParams();
  const notesData = useSelector((state) => state.notes.notesData);
  const isMobileNoteView = useSelector((state) => state.notes.isMobileNoteView);
  const dispatch = useDispatch();
  let currentNoteGroup = notesData.find((note) => note.noteID === noteID);
  const [UserTextInput, setUserTextInput] = useState("");
  const dateTime = new Date();
  function handleSendNote() {
    const newNoteData = {
      noteText: UserTextInput,
      noteDate: dateTime.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      noteTime: dateTime.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    dispatch(
      addNewNote({ newNote: newNoteData, noteID: currentNoteGroup.noteID })
    );

    try {
      const existingNotesData =
        JSON.parse(localStorage.getItem("notesData")) || [];

      const updatedNotesData = existingNotesData.map((group) => {
        if (group.noteID === currentNoteGroup.noteID) {
          return {
            ...group,
            notesList: [...(group.notesList || []), newNoteData],
          };
        }
        return group;
      });

      localStorage.setItem("notesData", JSON.stringify(updatedNotesData));
    } catch (error) {
      console.error("Failed to update localStorage:", error);
    }

    setUserTextInput("");
  }

  const location = useLocation();
  const isNoteRoute = location.pathname.startsWith("/notes/");
  return (
    <>
      <div
        className={`notePageContainer ${
          isMobileNoteView ? "showNotePage" : ""
        } ${!isNoteRoute ? "notePageHomeStyle" : ""}`}
      >
        {isNoteRoute ? (
          <>
            <div className="notePageHeader">
              <span>
                <img
                  className="backArrowImg"
                  src="/backArrowImg.png"
                  alt="backArrowImage"
                  onClick={() => dispatch(setIsMobileNoteView(false))}
                />
              </span>
              <span
                className="displayPic"
                style={{
                  backgroundColor: colors[currentNoteGroup?.noteGroupColour],
                }}
              >
                {currentNoteGroup?.noteGroupDisplayPic}
              </span>
              <span className="noteTitle">
                {currentNoteGroup?.noteGroupName}
              </span>
            </div>
            <div className="noteListContainer">
              {currentNoteGroup?.notesList?.map((item, index) => (
                <div className="noteBlock" key={index}>
                  <p>{item.noteText}</p>
                  <div className="dateTimeContainer">
                    <p className="dateContainer">{item.noteDate}</p>
                    <span className="seperator">•</span>
                    <p>{item.noteTime}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="inputTextContainer">
              <textarea
                value={UserTextInput}
                onChange={(e) => setUserTextInput(e.target.value)}
                placeholder="Enter your text here........."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && UserTextInput.trim().length > 0) {
                    e.preventDefault();
                    handleSendNote();
                  }
                }}
              ></textarea>

              <img
                src="/sendBtn.jpg"
                alt="sendButton"
                className={`sendBtn ${
                  UserTextInput.trim().length === 0 ? "disabled" : ""
                }`}
                onClick={() => {
                  if (UserTextInput.trim().length > 0) {
                    handleSendNote();
                  }
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="notesHomePageInfo">
              <img
                className="notesLogoImg"
                src="/notesLogo.jpg"
                alt="notesLogoImage"
              />
              <h2>Pocket Notes</h2>
              <p className="pocketNotesDescription">
                Send and receive messages without keeping your phone online. Use
                Pocket Notes on up to 4 linked devices and 1 mobile phone
              </p>
            </div>
            <div className="lockSecureContainer">
              <img
                className="lockSecureImg"
                src="/lockSecure.png"
                alt="lockSecure"
              />
              <p>end-to-end encrypted</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NotesPage;
