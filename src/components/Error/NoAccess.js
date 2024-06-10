import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NoAccess() {
  const navigate = useNavigate();
  const back = () => {
    navigate("/sign-in");
  };

  return (
    <div className="text-center">
      <p>You have no permiation to access</p>
      <Button onClick={back}>Go to login page</Button>
    </div>
  );
}
