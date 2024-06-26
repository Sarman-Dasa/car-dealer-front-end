import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/auth.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import PasswordField from "./PasswordField.js";
import { axiosPostResponse } from "../../services/axios.js";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {

    const navigate = useNavigate();


  // form validation
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required(),
    newPassword: Yup.string().required(),
    confirmPassword: Yup.string()
      .required()
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    const requestData = {
      current_password: values.currentPassword,
      password: values.newPassword,
      password_confirmation: values.confirmPassword,
    };
    const response = await axiosPostResponse("/user/changepassword",requestData,true);
    if(response) {
      formik.resetForm();
      navigate('/profile');
    }
  };

  return (
    <Container className="signin-container">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <div className="signin-card">
            <h2 className="text-center">Change password</h2>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <PasswordField
                formik={formik}
                label={"Current password"}
                name={"currentPassword"}
              />

              <PasswordField
                formik={formik}
                label={"new password"}
                name={"newPassword"}
              />

              <PasswordField
                formik={formik}
                label={"confirm password"}
                name={"confirmPassword"}
              />

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Update
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
