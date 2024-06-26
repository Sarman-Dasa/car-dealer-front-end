import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginUserData } from "../../store/app";
import { useFormik } from "formik";
import * as Yup from "yup";
import PasswordField from "./PasswordField.js";
import { axiosPostResponse } from "../../services/axios.js";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // form validation
  const validationSchema = Yup.object({
    email: Yup.string().required(),
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit();
    },
  });

  const handleSubmit = async () => {
    const response = await axiosPostResponse("/login", formik.values, true);
    if (response) {
      const userInfo = response.data.user;
      const token = response.data.token;
      dispatch(setLoginUserData(userInfo));
      const userStr = JSON.stringify(userInfo);
      localStorage.setItem("user", userStr);
      localStorage.setItem("token", token);
      navigate("/");
    }
  };

  return (
    <Container className="signin-container">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <div className="signin-card">
            <h2 className="text-center">Sign In</h2>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
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

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Sign In
              </Button>
              <Form.Label className="float-end mt-1">
                Forgot password<Link to="/forgot-password">click here</Link>
              </Form.Label>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
