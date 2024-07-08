import React from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { setLoginUserData } from "./store/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/Index";

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    dispatch(setLoginUserData(user));
  }


  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
