import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notesData: (JSON.parse(localStorage.getItem("notesData")) || []),
  isMobileNoteView:false,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNoteGroup: (state, action) => {
      state.notesData.push(action.payload);
    },

    addNewNote: (state, action) => {
      const { noteID, newNote } = action.payload;

      state.notesData = state.notesData.map((group) => {
        if (group.noteID === noteID) {
          return {
            ...group,
            notesList: [...(group.notesList || []), newNote],
          };
        }
        return group;
      });
    },

    setIsMobileNoteView:(state, action) => {
      state.isMobileNoteView = action.payload;
    }
  },
});

export default notesSlice.reducer;
export const { addNoteGroup, addNewNote, setIsMobileNoteView } = notesSlice.actions;
