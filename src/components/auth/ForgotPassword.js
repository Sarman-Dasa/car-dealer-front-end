import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/auth.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import notify from "../../services/notify.js";

export default function SignIn() {
  // form validation
  const validationSchema = Yup.object({
    email: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      sendResetPasswordEmail();
    },
  });

  const sendResetPasswordEmail = async () => {
    const email = formik.values.email;
    await sendPasswordResetEmail(auth, email)
      .then((res) => {
        console.log("res: ", res);
        notify.success("Password reset mail send succussfully.");
        formik.resetForm();
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  return (
    <Container className="signin-container">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <div className="signin-card">
            <h2 className="text-center">Forgot your password ?</h2>
            <p>Please enter the email you use sign in to car detaler</p>
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

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Request password reset
              </Button>
              <Form.Label as={Link} to="/sign-in" className="float-end mt-1">
                Back to sign in
              </Form.Label>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
