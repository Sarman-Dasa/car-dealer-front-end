import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/auth.css";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PasswordField from "./PasswordField";
import { axiosPostResponse } from "../../services/axios";

export default function SignUp() {
  async function register() {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      gender,
      accountName,
      accountNumber,
    } = formik.values;

    const requestData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      password: password,
      password_confirmation: confirmPassword,
      gender: gender,
      account_name: accountName,
      account_number: accountNumber,
    };

    const response = await axiosPostResponse(
      "/registration",
      requestData,
      true
    );
    if (response && response.status) {
      formik.resetForm();
    }
  }

  // Form validation using formik & yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required().max(25),
    lastName: Yup.string().required().max(25),
    email: Yup.string().email("Invalid email address").required(),
    phone: Yup.number().required(),
    password: Yup.string().required(),
    accountName: Yup.string().required(),
    accountNumber: Yup.number().required(),
    gender: Yup.string().required(),
    confirmPassword: Yup.string()
      .required()
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      accountName: "",
      accountNumber: "",
      gender: "",
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
          <div className="signin-card" style={{ minWidth: "700px" }}>
            <h2 className="text-center">Sign Up</h2>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="firstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="Enter first name"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.firstName && !!formik.errors.firstName
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.lastName && !!formik.errors.lastName
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
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
                </Col>
                <Col>
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
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <PasswordField
                    formik={formik}
                    label={"password"}
                    name={"password"}
                  />
                </Col>
                <Col>
                  <PasswordField
                    formik={formik}
                    label={"Confirm Password"}
                    name={"confirmPassword"}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="firstName">
                    <Form.Label>Accound Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="accountName"
                      placeholder="Enter Accound Name"
                      value={formik.values.accountName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.accountName &&
                        !!formik.errors.accountName
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.accountName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="lastName">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control
                      type="number"
                      name="accountNumber"
                      placeholder="Enter Account Number"
                      value={formik.values.accountNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.accountNumber &&
                        !!formik.errors.accountNumber
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.accountNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Col>
                <Form.Group controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  <Row className="mb-3 row-cols-3">
                    <Col col={3}>
                      <Form.Check
                        type="radio"
                        name="gender"
                        label="Male"
                        value="Male"
                        id="male"
                        onChange={formik.handleChange}
                        isInvalid={
                          formik.touched.gender && !!formik.errors.gender
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type="radio"
                        name="gender"
                        label="Female"
                        value="Female"
                        id="female"
                        onChange={formik.handleChange}
                        isInvalid={
                          formik.touched.gender && !!formik.errors.gender
                        }
                      />
                    </Col>
                  </Row>
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {formik.errors.gender}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

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
    </Container>
  );
}
