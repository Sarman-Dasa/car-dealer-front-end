import React, { useState } from "react";
import VerticalLayout from "./VerticalLayout";
import SidebarLayout from "./SidebarLayout";
import { axiosPostResponse } from "../services/axios";
import { useDispatch } from "react-redux";
import { userLogOut } from "../store/app";
import { useNavigate } from "react-router-dom";

export default function Layout() {
  const [type, setType] = useState("sidebar");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = async () => {
    const response = await axiosPostResponse("user/logout");
    if (response) {
      navigate("/sign-in", { replace: true });
      setTimeout(() => {
        dispatch(userLogOut());
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }, 200);
    }
  };

  if (type === "vertical") {
    return <VerticalLayout handleUserLogout={logOut} setLayoutType={setType} />;
  } else {
    return <SidebarLayout handleUserLogout={logOut} setLayoutType={setType} />;
  }
}
