// Importing necessary libraries
import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../../css/car.css";
import FileUpload from "../fileUpload";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/Firebase";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import Emitter from "../../services/emitter";
import { useParams, useNavigate } from "react-router-dom";

// CarForm component
export default function CarForm() {
  const [carDetail, setCarDetail] = useState({
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
  });

  const { id } = useParams();
  const [loader,setLoader] = useState(false);
  const navigate = useNavigate();
  const [carImage,setCarImage] = useState(null);

  const user = useSelector((state) => state.app.user);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setCarDetail((preview) => ({
      ...preview,
      [name]: value,
    }));
  };

  // Handle  submission
  const handleSubmit = async (event) => {
    if (carDetail && !carDetail.image_url) {
      toast.warning("please upload image !");
      return;
    }
    setCarDetail((preview) => ({
      ...preview,
      owner_id: user.id,
    }));

    if (id) {
      updateCarDetail();
    } else {
      addCarDetail();
    }
  };

  async function addCarDetail() {
    const carCollection = collection(db, "cars");
    await addDoc(carCollection, carDetail)
      .then((response) => {
        console.log("Response", response);
        clearData();
      })
      .catch((error) => {
        console.log("Error", error);
      });
    console.log("cars", carDetail);
  }

  async function updateCarDetail() {
    const carDoc = doc(db, "cars",id);
    await updateDoc(carDoc, carDetail)
    .then((response) => {
      console.log("Response", response);
      navigate('/profile');
    })
    .catch((error) => {
      console.log("Error", error);
    });
  console.log("cars", carDetail);
  }

  // Store file into firebase storege
  const saveFileData = (e) => {
    const imageRef = ref(storage, `file/${uuid()}`);
    uploadBytes(imageRef, e[0].image)
      .then((response) => {
        console.log("response", response);
        // Get the download URL
        getDownloadURL(imageRef)
          .then((url) => {
            console.log("Url", url);
            setCarDetail((preview) => ({
              ...preview,
              image_url: url,
            }));
            toast.success("File upload Successfully");
          })
          .catch((error) => {
            console.log("Error", error);
          });
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  //Clear form data
  function clearData() {
    setCarDetail({
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
    });

    // Call EventEmitter to clear file data
    Emitter.emit("CLEAR_FILE_DATA");
  }

  // get Car Detail

  async function getCarDetail() {
    setLoader(true);
    const carDoc = doc(db, "cars", id);
    const response = await getDoc(carDoc);
    const data = response.data()
    setCarDetail(data);
    setCarImage([{
      url: data.image_url,
      id: id,
      name:data.company_name
    }])
    setLoader(false);
  }

  const removeFile = () => {
    setCarDetail((preview) => ({
      ...preview,
      image_url:null,
    }));
  }

  useEffect(() => {
    if (id) {
      getCarDetail();
    }
  }, [id]);

  return (
    <Container className="car-container">
      <h2 className="my-4">Car Details Form</h2>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="comapanyName">
              <Form.Label>Company name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Company name"
                name="company_name"
                value={carDetail.company_name}
                onChange={handleFormData}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="modal">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter car model"
                name="model"
                value={carDetail.model}
                onChange={handleFormData}
              />
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
                value={carDetail.mileage}
                onChange={handleFormData}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="color">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter car color"
                name="color"
                value={carDetail.color}
                onChange={handleFormData}
              />
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
                value={carDetail.condition}
                onChange={handleFormData}
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value={"pre-owned"}>Certified Pre-Owned</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="number">
              <Form.Label>Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Vehicle Identification Number"
                name="number"
                value={carDetail.number}
                onChange={handleFormData}
              />
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
                value={carDetail.engine_type}
                onChange={handleFormData}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="FuelType">
              <Form.Label>Fuel Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter fuel type"
                name="fuel_type"
                value={carDetail.fuel_type}
                onChange={handleFormData}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="Transmission">
              <Form.Label>Transmission</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter transmission type"
                name="transmission"
                value={carDetail.transmission}
                onChange={handleFormData}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                name="price"
                value={carDetail.price}
                onChange={handleFormData}
              />
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
                value={carDetail.register_date}
                onChange={handleFormData}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={carDetail.status}
                onChange={handleFormData}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
         { !loader && <FileUpload handelFileUpload={saveFileData} handelFileRemove={removeFile} title={null} file={carImage}/> }
        </Row>

        <Button
          variant="primary"
          className="mt-1 save"
          type="button"
          onClick={handleSubmit}
          disabled={carDetail && !carDetail.image}
        >
          Submit
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
      <ToastContainer />
    </Container>
  );
}
