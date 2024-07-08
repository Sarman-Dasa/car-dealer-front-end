// Importing necessary libraries
import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/car.css";
import FileUpload from "../fileUpload";
import { useSelector } from "react-redux";
import Emitter from "../../services/emitter";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaSpinner } from "react-icons/fa6";
import { axiosGetResponse, axiosPostResponse } from "../../services/axios";
import useOnlineStatus from "../../hook/useOnlineStatus";

export default function CarForm() {
  const carTransmissions = [
    { label: "Select transmission type", value: "" },
    { label: "Manual Transmission (MT)", value: "manual" },
    { label: "Automatic Transmission (AT)", value: "automatic" },
    { label: "Continuously Variable Transmission (CVT)", value: "cvt" },
    { label: "Dual-Clutch Transmission (DCT)", value: "dct" },
    { label: "Automated Manual Transmission (AMT)", value: "amt" },
    { label: "Sequential Manual Transmission (SMT)", value: "smt" },
    { label: "Semi-Automatic Transmission", value: "semi-automatic" },
    { label: "Tiptronic Transmission", value: "tiptronic" },
    { label: "Direct-Shift Gearbox (DSG)", value: "dsg" },
    {
      label: "Electronic Continuously Variable Transmission (e-CVT)",
      value: "e-cvt",
    },
    { label: "Hybrid Transmission", value: "hybrid" },
    { label: "Plug-In Hybrid Transmission", value: "plug-in-hybrid" },
  ];

  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [attachmentLoader, setAttachmentLoader] = useState(false);
  const navigate = useNavigate();
  const [carImage, setCarImage] = useState([]);
  const [removeAttachments, setRemoveAttachments] = useState({ ids: [] });
  const [manualAddFile, setManualAddFile] = useState(null);
  const isOnline = useOnlineStatus();

  const user = useSelector((state) => state.app.user);
  const validationSchema = Yup.object({
    company_name: Yup.string()
      .required("company name is a required field")
      .max(25),
    model: Yup.string().required(),
    mileage: Yup.number().required().positive(),
    color: Yup.string().required(),
    condition: Yup.string().required(),
    number: Yup.string().required(),
    engine_type: Yup.string().required("engine type is a required field"),
    price: Yup.number().required().positive(),
    register_date: Yup.date().required("register date is a required field"),
    status: Yup.string().required(),
    transmission: Yup.string().required(),
    fuel_type: Yup.string().required("fuel type is a required field"),
  });

  const formik = useFormik({
    initialValues: {
      company_name: "",
      model: "",
      mileage: "",
      color: "",
      condition: "",
      number: "",
      engine_type: "",
      price: "",
      register_date: "",
      status: "",
      transmission: "",
      fuel_type: "",
      image_url: "",
      owner_id: "",
    },
    validationSchema: validationSchema,
    validate: async (values) => {
      const errors = {};
      if (
        carImage &&
        carImage.length === 0 &&
        manualAddFile &&
        manualAddFile.length === 0
      ) {
        errors.image_url = "Car image is required";
      }
      values.owner_id = user.id;
      return errors;
    },
    onSubmit: async (values) => {
      setLoader(true);

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key !== "car_attachments") formData.append(key, values[key]);
      });

      if (carImage && carImage.length) {
        carImage.forEach((element, index) => {
          formData.append(`files[${index}][dataURL]`, element.base64URL);
          formData.append(`files[${index}][name]`, element.name);
        });
      }

      if (removeAttachments?.ids?.length) {
        formData.append("remove_image_ids[]", removeAttachments.ids);
      }

      if (id) {
        // Update Detail
        formData.append("_method", "PUT");
        const response = await axiosPostResponse(
          `/cars/update/${id}`,
          formData
        );
        if (response) {
          clearData();
          navigate("/profile");
        }
  
      } else {
        // Add Detail
        const response = await axiosPostResponse("/cars/create", formData);
        if (response) {
          clearData();
        }
      }
      setLoader(false);
    },
  });


  const handelFileUploadSucces = (files) => {
    setCarImage(files);
  };

  //Clear form data
  function clearData() {
    formik.resetForm();
    // Call EventEmitter to clear file data
    Emitter.emit("CLEAR_FILE_DATA");
  }

  // get Car Detail

  async function getCarDetail() {
    setAttachmentLoader(true);

    const response = await axiosGetResponse(`cars/view/${id}`);
    if (response) {
      const data = response.data;
      formik.setValues(data);
      const attachments = data.car_attachments.map((item) => {
        return {
          ...item,
          url: process.env.REACT_APP_API_IMAGE_PATH + "/" + item.url,
        };
      });
      setManualAddFile(attachments);
    }
    setAttachmentLoader(false);
  }

  const removeFile = (id) => {
    console.log("Removing file with id:", removeAttachments);
    setRemoveAttachments((prevState) => ({
      ...prevState,
      ids: [...prevState.ids, id],
    }));

    let manualFile = manualAddFile.filter((item) => item.id !== id);
    setManualAddFile(manualFile);
  };

  useEffect(() => {
    if (id) {
      getCarDetail();
    }

    return () => {
      clearData();
    };
  }, [id]);

  return (
    <Container className="car-container">
      <h2 className="my-4">Car Details Form</h2>
      <Form onSubmit={formik.handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="comapanyName">
              <Form.Label>Company name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Company name"
                name="company_name"
                value={formik.values.company_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.company_name && !!formik.errors.company_name
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.company_name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="modal">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter car model"
                name="model"
                value={formik.values.model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.model && !!formik.errors.model}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.model}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="mileage">
              <Form.Label>Mileage</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter mileage"
                name="mileage"
                value={formik.values.mileage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.mileage && !!formik.errors.mileage}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.mileage}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="color">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter car color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.color && !!formik.errors.color}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.color}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="Condition" className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Control
                as="select"
                name="condition"
                value={formik.values.condition}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.condition && !!formik.errors.condition
                }
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value={"pre-owned"}>Certified Pre-Owned</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.condition}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="number">
              <Form.Label>Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Vehicle Identification Number"
                name="number"
                value={formik.values.number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.number && !!formik.errors.number}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.number}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="EngineType">
              <Form.Label>Engine Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter engine type"
                name="engine_type"
                value={formik.values.engine_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.engine_type && !!formik.errors.engine_type
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.engine_type}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="FuelType">
              <Form.Label>Fuel Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter fuel type"
                name="fuel_type"
                value={formik.values.fuel_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.fuel_type && !!formik.errors.fuel_type
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.fuel_type}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="Transmission">
              <Form.Label>Transmission</Form.Label>
              <Form.Control
                as="select"
                placeholder="Enter transmission type"
                name="transmission"
                value={formik.values.transmission}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.transmission && !!formik.errors.transmission
                }
              >
                {carTransmissions.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.transmission}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.price && !!formik.errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.price}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="RegistrationDate">
              <Form.Label>Registration Date</Form.Label>
              <Form.Control
                type="date"
                name="register_date"
                value={formik.values.register_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.register_date && !!formik.errors.register_date
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.register_date}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.status && !!formik.errors.status}
              >
                <option value="">Select Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.status}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          {!attachmentLoader && (
            <FileUpload
              handelFileUpload={handelFileUploadSucces}
              handelFileRemove={removeFile}
              title={null}
              file={manualAddFile}
              isMultiple={true}
              isInvalid={formik.touched.image_url && !!formik.errors.image_url}
              errorMessage={formik.errors.image_url}
            />
          )}
        </Row>

        <Button
          variant="primary"
          className="mt-1 save"
          type="submit"
          disabled={loader || !isOnline}
        >
         {isOnline ? 'Submit' : 'Reconnting...' } 
          {loader && (
            <FaSpinner className="spinner-border spinner-border-sm border-0" />
          )}
        </Button>
        <Button
          variant="primary"
          className="mt-1 ms-5 btn btn-danger clear"
          type="button"
          onClick={clearData}
        >
          Clear
        </Button>
      </Form>
    </Container>
  );
}
