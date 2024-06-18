import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VerticalLayout from "../layout/VerticalLayout";
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

export default function RouterView() {
  return (
    <div>
      <Router>
        <VerticalLayout />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cars" element={<Cars />} />
            <Route path="/add-car/:id?" element={<Add />} />
            <Route path="/car-view/:id" element={<CarDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
          <Route path="/access-error" element={<NoAccess />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
