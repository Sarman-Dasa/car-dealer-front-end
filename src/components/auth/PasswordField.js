import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function PasswordField({ formik, label, name }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Form.Group controlId="password">
        <Form.Label>{label}</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched[name] && !!formik.errors[name]}
          />
          <InputGroup.Text
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            {formik.errors[name]}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </div>
  );
}
