import {configureStore} from "@reduxjs/toolkit"
import notesReducer from "../Redux/notesSlice"

export const store = configureStore({
  reducer:{
    notes: notesReducer
  }
})