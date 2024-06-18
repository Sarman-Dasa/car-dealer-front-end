import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/auth.css";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import PasswordField from "./PasswordField.js";
import notify from "../../services/notify";

export default function ChangePassword() {
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
      handleSubmit();
    },
  });

  const handleSubmit = async () => {
    const authUser = getAuth().currentUser;
    const credential = EmailAuthProvider.credential(
      authUser.email,
      formik.values.currentPassword
    );
    
    reauthenticateWithCredential(authUser, credential)
      .then(() => {
        updatePassword(authUser, formik.values.newPassword)
          .then(() => {
            notify.success("Password change successfully.");
            formik.resetForm();
          })
          .catch((error) => {
            notify.error(error);
          });
      })
      .catch((error) => {
        notify.error("Invalid current password, please try again !!");
        formik.setFieldError("currentPassword", "invalid password!");
      });
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
