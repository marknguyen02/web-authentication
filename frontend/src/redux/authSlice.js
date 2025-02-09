import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  user: null,
  isLoading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    deleteState: (state) => {
      state.user = null;
    }
  }
});

export const { setUser, setIsLoading, deleteState } = authSlice.actions;

export default authSlice.reducer;
