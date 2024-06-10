// src/SignIn.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/auth.css";
import { toast, ToastContainer } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth,db } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, collection} from "firebase/firestore";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.log("call not match");
      toast.error("Password does not match!");
    } else {
      register();
    }
  };

  async function register() {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setUserData()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        console.log(errorCode, errorMessage);
        // ..
      });
  }

  async function setUserData() {
    const userData =  {
      full_name:name,
      email:email,
      city:city,
      phone:phone
    }

    const userRef = collection(db, "users");
    await addDoc(userRef,userData).then((res) => {
      setTimeout(() => {
        navigate("/sign-in");
      }, 500);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

  
  }

  return (
    <Container className="signin-container">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <div className="signin-card">
            <h2 className="text-center">Sign Up</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Sign Up
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}
