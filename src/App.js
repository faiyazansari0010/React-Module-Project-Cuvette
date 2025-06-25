import Modal from "react-modal";
import NotesPage from "./Components/NotesPage/NotesPage";
import NotesSideBar from "./Components/NotesSideBar/NotesSideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  Modal.setAppElement("#root");
  return (
    <>
      <BrowserRouter>
        <div className="appContainer">
          <NotesSideBar />
          <Routes>
            <Route path="/" element={<NotesPage />} />
            <Route path="/notes/:noteID" element={<NotesPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
