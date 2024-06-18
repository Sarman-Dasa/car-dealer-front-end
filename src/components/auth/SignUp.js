import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/auth.css";
import { toast, ToastContainer } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Firebase";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import PasswordField from "./PasswordField";

export default function SignUp() {
  const navigate = useNavigate();

  async function register() {
    const { email, password } = formik.values;
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setUserData();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        console.log(errorCode, errorMessage);
      });
  }

  async function setUserData() {
    const userData = {
      full_name: formik.values.userName,
      email: formik.values.email,
      city: formik.values.city,
      phone: formik.values.phone,
    };

    const userRef = collection(db, "users");
    await addDoc(userRef, userData)
      .then((res) => {
        setTimeout(() => {
          navigate("/sign-in");
        }, 500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  // Form validation using formik & yup
  const validationSchema = Yup.object({
    userName: Yup.string().required().max(25),
    email: Yup.string().email("Invalid email address").required(),
    phone: Yup.number().required(),
    city: Yup.string().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string()
      .required()
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      city: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      register();
    },
  });

  return (
    <Container className="signin-container">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <div className="signin-card">
            <h2 className="text-center">Sign Up</h2>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  placeholder="Enter name"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.userName && !!formik.errors.userName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.userName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.phone && !!formik.errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Enter City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.city && !!formik.errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.city}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <PasswordField
                formik={formik}
                label={"password"}
                name={"password"}
              />
              <PasswordField
                formik={formik}
                label={"Confirm Password"}
                name={"confirmPassword"}
              />

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Sign Up
              </Button>
              <Form.Label className="float-end mt-1">
                already have an account<Link to="/sign-in">Sign In here</Link>
              </Form.Label>
            </Form>
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}
