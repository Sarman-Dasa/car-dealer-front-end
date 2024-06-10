import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    user: null,
  },

  reducers: {
    setLoginUserData(state, action) {
      state.user = action.payload;
    },

    userLogOut(state) {
      state.user = null;
    },
  },
});

export const { setLoginUserData, userLogOut } = appSlice.actions;
export default appSlice.reducer;
