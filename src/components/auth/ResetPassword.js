import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import "../../css/auth.css";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PasswordField from "./PasswordField.js";
import notify from "../../services/notify";

export default function ChangePassword() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("oobCode");
  const [isValidToken, setIsValidToken] = useState(true);
  const [loader, setLoader] = useState(false);
  const [loginButtonShow, setLoginButtonShow] = useState(false);
  const navigate = useNavigate();
  // form validation
  const validationSchema = Yup.object({
    newPassword: Yup.string().required(),
    confirmPassword: Yup.string()
      .required()
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit();
    },
  });

  const handleSubmit = async () => {
    const password = formik.values.newPassword;
    await confirmPasswordReset(auth, code, password)
      .then((result) => {
        setLoginButtonShow(true);
        notify.success("password reset successfully.");
        formik.resetForm();
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  useEffect(() => {
    if (!code) {
      navigate("/not-found");
    }

    // Password reset token is valid or not
    async function checkEmailVerifyToken() {
      setLoader(true);
      await verifyPasswordResetCode(auth, code)
        .then((result) => {
          setIsValidToken(true);
        })
        .catch((err) => {
          setIsValidToken(false);
        });
      setLoader(false);
    }
    checkEmailVerifyToken();
  }, [code]);

  if (!isValidToken) {
    return (
      <Modal
        show={!isValidToken}
        onHide={() => navigate("/sign-in")}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Try resetting your password again</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your request to reset your password has expired or the link has
            already been used
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button as={Link} variant="primary" to="/sign-in">
            Back to Login
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Container className="signin-container">
      {!loader && (
        <Row className="justify-content-md-center">
          <Col md={12}>
            <div className="signin-card">
              <h2 className="text-center">Set new password</h2>
              <Form noValidate onSubmit={formik.handleSubmit}>
                <PasswordField
                  formik={formik}
                  label={"New password"}
                  name={"newPassword"}
                />

                <PasswordField
                  formik={formik}
                  label={"Confirm password"}
                  name={"confirmPassword"}
                />
                {!loginButtonShow ? (
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-4"
                  >
                    Set new password
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    type="button"
                    className="w-100 mt-4"
                    as={Link}
                    to="/sign-in"
                  >
                    Back to SignIn
                  </Button>
                )}
              </Form>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
