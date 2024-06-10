import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const back = () => {
    navigate("/");
  };
  return (
    <div className="text-center">
      <p>Page Not Found</p>
      <Button onClick={back}>Back to home</Button>
    </div>
  );
}
