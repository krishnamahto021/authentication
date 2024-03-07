import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const initialState = {
  loggedInUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authorizeUser: (state, action) => {
      return {
        ...state,
        loggedInUser: localStorage.getItem("loggedInUser")
          ? JSON.parse(localStorage.getItem("loggedInUser"))
          : null,
      };
    },
    logOutUser: (state, action) => {
      localStorage.removeItem("loggedInUser");
      toast.success("We will miss you");
      return {
        ...state,
        loggedInUser: "",
      };
    },
  },
});

export const userReducer = userSlice.reducer;
export const { authorizeUser, logOutUser } = userSlice.actions;
export const userSelector = (state) => state.userReducer;
