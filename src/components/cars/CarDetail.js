import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../firebase/Firebase";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import GoogleMap from "../map/index";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

export default function CarDetail() {
  const [car, setCar] = useState();
  const [loader, setLoader] = useState(true);
  const userInfo = useSelector((state) => state.app.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCarForRent, setIsCarForRent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const type = searchParams.get("type");
  const currentDate = moment().format("YYYY-MM-DD");
  const MySwal = withReactContent(Swal);

  const [carRentDetail, setCarRentDetail] = useState({
    startDate: currentDate,
    endDate: currentDate,
    owner_id: null,
    customer_id: userInfo.id,
    no_of_day: null,
    rent: null,
    car_id: id,
    pickup_location: {},
  });

  // const [startDate,setStartDate] = useState(currentDate);
  // const [endDate,setEndDate] = useState(currentDate);

  // Get specific car detail
  const getCarDetail = async () => {
    const carDoc = doc(db, "cars", id);
    setLoader(true);
    const response = await getDoc(carDoc);
    const carDetail = response.data();

    const OWNER_ID = carDetail && carDetail.owner_id;
    // set car owner Id
    setCarRentDetail((preview) => ({
      ...preview,
      owner_id: OWNER_ID,
    }));

    setCar(carDetail);

    getCarOwnerDetail(carDetail.owner_id);
    if (carDetail.seller_id) {
      getSellerUserDetail(carDetail.seller_id);
    }
  };

  // get Car owner detail
  const getCarOwnerDetail = async (ownerId) => {
    const userDoc = doc(db, "users", ownerId);
    const response = await getDoc(userDoc);
    const owner = response.data();
    setCar((preview) => ({
      ...preview,
      ownerDetail: owner,
    }));
    setLoader(false);
  };

  // Show Confirmation message for car delete
  const carBuyConfirmation = (id) => {
    MySwal.fire({
      title: "Are you sure to buy this car?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonClass: "",
      customClass: {
        confirmButton: "btn text-bg-success",
        cancelButton: "btn btn-danger",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        buyCar(); // Yes to call buyCar function
      }
    });
  };
  // Buy car funcation
  function buyCar() {
    const userRef = doc(db, "cars", id);
    const date = moment().format("YYYY/MM/DD");
    console.log("date: ", date);

    const carDetail = {
      status: "sold",
      seller_id: userInfo.id,
      sellDate: date,
    };

    updateDoc(userRef, carDetail)
      .then(() => {
        toast.success("Data updated");
        getCarDetail();
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  // seller detail
  const getSellerUserDetail = async (id) => {
    setLoader(true);
    const userDoc = doc(db, "users", id);
    const response = await getDoc(userDoc);
    const seller = response.data();
    setCar((preview) => ({
      ...preview,
      sellerDetail: seller,
    }));
    setLoader(false);

    setLoader(false);
  };

  // set car for rent form detail
  const handelFormData = async (e) => {
    const { name, value } = e.target;
    console.log("name, value: ", name, value);

    setCarRentDetail((preview) => ({
      ...preview,
      [name]: value,
    }));
  };

  //store data into firebase database
  const getCarForRent = async () => {
    const carRentDoc = collection(db, "rent_car_details");
    const carDoc = doc(db, "cars", id);
    await addDoc(carRentDoc, carRentDetail)
      .then((response) => {
        // console.log("response: ", response);
        updateDoc(carDoc, { status: "onRent" }) // Update car status as onRent
          .then(() => {
            toast.success("Your car is booked");
            setShowModal(false);
          })
          .catch((err) => {
            console.log("err: ", err);
          });
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  // set user location data
  const handelUserLocation = (e) => {
    console.log("e", e);
    setCarRentDetail((preview) => ({
      ...preview,
      pickup_location: e,
    }));
  };
  useEffect(() => {
    getCarDetail();
    if (searchParams && type === "car_for_rent") {
      setIsCarForRent(true);
    }
  }, []);

  // Set No of day & rent
  useEffect(() => {
    let startDate = moment(carRentDetail.startDate);
    let endDate = moment(carRentDetail.endDate);

    // Check if endDate is less than startDate
    if (endDate.isBefore(startDate)) {
      toast.warning("Please Select valid end date!");
    } else {
      let dayDifference = endDate.diff(startDate, "days") + 1;
      const PER_DAY_RENT = 500;
      const totalRent = PER_DAY_RENT * dayDifference;
      setCarRentDetail((preview) => ({
        ...preview,
        no_of_day: dayDifference,
        rent: totalRent,
      }));
      // console.log("Number of days:", totalRent);
    }
  }, [carRentDetail.startDate, carRentDetail.endDate]);

  return (
    <div>
      <Button className="ms-5" onClick={() => navigate(-1)}>
        <IoMdArrowRoundBack />
        Back
      </Button>

      <Container className="mt-5">
        {loader && (
          <div className="text-center" style={{ marginTop: "30%" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {!loader && car && (
          <>
            <Row>
              <Col md={6}>
                {car.image_url && <Image src={car.image_url} fluid />}
              </Col>
              <Col md={3}>
                <h2>{car.company_name}</h2>
                <p>
                  <strong>Model:</strong> {car.model}
                </p>
                <p>
                  <strong>Mileage:</strong> {car.mileage}
                </p>
                <p>
                  <strong>Color:</strong> {car.color}
                </p>
                <p>
                  <strong>Condition:</strong> {car.condition}
                </p>
                <p>
                  <strong>Status:</strong>
                  <Badge
                    variant="primary"
                    className={
                      car.status == "available" ? `bg-primary` : `bg-danger`
                    }
                  >
                    {car.status}
                  </Badge>
                </p>
                <p>
                  <strong>Transmission:</strong> {car.transmission}
                </p>

                {/* Buy & rent Button start */}
                {!car.seller_id &&
                  car.owner_id !== userInfo.id &&
                  (isCarForRent ? (
                    <Button onClick={() => setShowModal(true)}>
                      Get Car For Rent
                    </Button>
                  ) : (
                    <Button onClick={carBuyConfirmation}> Buy</Button>
                  ))}
                {/* Buy & rent Button end */}
              </Col>
              <Col md={3} className="mt-4 pt-4">
                <p>
                  <strong>Number:</strong> {car.number}
                </p>
                <p>
                  <strong>Engine Type:</strong> {car.engine_type}
                </p>
                <p>
                  <strong>Price:</strong> {car.price}
                </p>
                <p>
                  <strong>Fuel Type:</strong> {car.fuel_type}
                </p>
                <p>
                  <strong>Register Date:</strong> {car.register_date}
                </p>
                {car.sellDate && (
                  <p>
                    <strong>Sold Date:</strong> {car.sellDate}
                  </p>
                )}
              </Col>
            </Row>
            {/* Car owner Details */}
            <Row className="owner-detail">
              <Col md={6}>
                <Row>
                  <Col md={6}>
                    <span className="heading">Owner Detail</span>
                    {car.image_url && (
                      <Image src={car.ownerDetail.avatar} thumbnail />
                    )}
                  </Col>
                  <Col md={6} className="mt-4 pt-4">
                    <p>
                      <strong>Name:</strong> {car.ownerDetail.full_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {car.ownerDetail.email}
                    </p>
                    <p>
                      <strong>City:</strong> {car.ownerDetail.city}
                    </p>
                  </Col>
                </Row>
              </Col>
              {car.sellerDetail && (
                <Col md={6}>
                  <Row>
                    <Col md={6}>
                      <span className="heading">Seller Detail</span>
                      {car.image_url && (
                        <Image src={car.sellerDetail.avatar} thumbnail />
                      )}
                    </Col>
                    <Col md={6} className="mt-4 pt-4">
                      <p>
                        <strong>Name:</strong> {car.sellerDetail.full_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {car.sellerDetail.email}
                      </p>
                      <p>
                        <strong>City:</strong> {car.sellerDetail.city}
                      </p>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </>
        )}
      </Container>
      <ToastContainer />

      {/* Car for rent modal */}
      <Modal
        centered
        show={showModal}
        onHide={() => setShowModal(!showModal)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Car for rent </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Star date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter car color"
                  name="startDate"
                  value={carRentDetail.startDate}
                  onChange={handelFormData}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="endDate">
                <Form.Label>End date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter car color"
                  name="endDate"
                  value={carRentDetail.endDate}
                  onChange={handelFormData}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label className="mt-2">
                No of Days:: {carRentDetail.no_of_day}
              </Form.Label>
            </Col>
            <Col>
              <Form.Label className="mt-2">
                Total::{carRentDetail.rent}
              </Form.Label>
            </Col>
          </Row>
          <Form.Label className="mt-2">Select PickUp location :</Form.Label>
          <GoogleMap getUserLocation={handelUserLocation} />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={getCarForRent}>
            Pay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
