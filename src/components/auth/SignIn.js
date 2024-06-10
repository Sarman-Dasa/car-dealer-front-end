// src/SignIn.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/auth.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginUserData } from "../../store/app";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //  const user = userCredential.user.email;
        getLoginUserData();
        // navigate("/")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  async function getLoginUserData() {
    const userCollection = collection(db, "users");
    const q = query(userCollection, where("email", "==", email));
    const data = await getDocs(q);
    const userId = data.docs[0].id;
    const user = data.docs[0].data();

    const userInfo = {
      ...user,
      id: userId,
    };

    dispatch(setLoginUserData(userInfo));
    const userStr = JSON.stringify(userInfo);
    localStorage.setItem("user", userStr);
    navigate("/");
  }

  return (
    <Container className="signin-container">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <div className="signin-card">
            <h2 className="text-center">Sign In</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Sign In
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
