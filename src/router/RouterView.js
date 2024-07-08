import React from "react";
import { RouterProvider } from "react-router-dom";
import VerticalLayout from "../layout/VerticalLayout";
import router from "./Index";
import ErrorBoundary from "../components/Error/ErrorBoundary";

export default function RouterView() {
  return (
    <div>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </div>
  );
}
