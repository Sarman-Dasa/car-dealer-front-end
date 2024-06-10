import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VerticalLayout from "../layout/VerticalLayout";
import Dashboard from "../components/Dashboard";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import Add from "../components/cars/Add";
import Profile from "../components/user/Profile";
import CarDetail from "../components/cars/CarDetail";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/Error/NotFound";
import NoAccess from "../components/Error/NoAccess";
export default function RouterView() {
  return (
    <div>
      <Router>
        <VerticalLayout />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/add-car" element={<Add />} />
            <Route path="/car-view/:id" element={<CarDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/access-error" element={<NoAccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
