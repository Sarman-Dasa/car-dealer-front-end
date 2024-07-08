import React, { useEffect } from "react";
import { createBrowserRouter, useBeforeUnload } from "react-router-dom";
import Cars from "../components/Cars";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import Add from "../components/cars/Add";
import Profile from "../components/user/Profile";
import CarDetail from "../components/cars/CarDetail";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/Error/NotFound";
import NoAccess from "../components/Error/NoAccess";
import Home from "../components/Home";
import ChangePassword from "../components/auth/ChangePassword";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import Second from "../test/Second";
import Layout from "../layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "cars",
            element: <Cars />,
          },
          {
            path: "add-car/:id?",
            element: <Add />,
          },
          {
            path: "car-view/:id",
            element: <CarDetail />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
        ],
      },
      {
        path: "/access-error",
        element: <NoAccess />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);


export default router;
