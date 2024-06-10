import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/index";

export const store = configureStore({
  reducer: {
    app: appSlice,
  },
});

export default store;
