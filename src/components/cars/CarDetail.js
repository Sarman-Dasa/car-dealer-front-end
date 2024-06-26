import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import GoogleMap from "../map/index";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DatePicker from "react-multi-date-picker";
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
import { Slide } from "react-slideshow-image";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { axiosGetResponse, axiosPostResponse } from "../../services/axios";
import notify from "../../services/notify";

export default function CarDetail() {
  const [car, setCar] = useState();
  const [loader, setLoader] = useState(true);
  const userInfo = useSelector((state) => state.app.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isCarForRent, setIsCarForRent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const type = searchParams.get("type");
  const currentDate = moment().format("YYYY-MM-DD");
  const MySwal = withReactContent(Swal);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [carRentDetail, setCarRentDetail] = useState({
    startDate: currentDate,
    endDate: currentDate,
    owner_id: null,
    customer_id: userInfo.id,
    no_of_day: null,
    per_day_rent: null,
    total_rent: null,
    car_id: id,
    pickup_location: {},
  });

  const [carBookedDates, setCarBookedDates] = useState([]);

  // Function to check if a date falls within any of the booked date ranges
  const isDateBooked = (date) => {
    return carBookedDates.some(({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    });
  };

  const isRangeBooked = (startDate, endDate) => {
    const date = new Date(startDate);
    while (date <= endDate) {
      if (isDateBooked(date)) return true;
      date.setDate(date.getDate() + 1);
    }
    return false;
  };

  // Get specific car detail
  const getCarDetail = async () => {
    setLoader(true);
    const response = await axiosGetResponse(`cars/view/${id}`);
    if (response) {
      const data = response.data;
      setCar(data);
    }
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
  async function buyCar() {
    const requestData = {
      id: id,
      status: "sold",
    };
    setLoader(true);
    const response = await axiosPostResponse(
      `cars/change-status`,
      requestData,
      true
    );
    if (response) {
      getCarDetail();
    }
    setLoader(false);
  }

  // set car for rent form detail
  const handelFormData = async (e) => {
    // const { name, value } = e.target;
    setDateRange(e);
    let startDate = e[0]?.format();
    let endDate = e[1]?.format();

    setCarRentDetail((preview) => ({
      ...preview,
      startDate: startDate,
      endDate: endDate,
    }));
  };

  //store data into firebase database
  const getCarForRent = async () => {
    console.log("carRentDetail: ", carRentDetail);
    const response = await axiosPostResponse(
      "/rental/create",
      carRentDetail,
      true
    );

    if (response) {
      getCarDetail();
      setShowModal(false);
    }
  };

  // set user location data
  const handelUserLocation = (e) => {
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
    // Check if select date is on range
    if (isRangeBooked(startDate, endDate)) {
      notify.warn("Please Select valid end date!");
      setDateRange();
    } else {
      let dayDifference = endDate.diff(startDate, "days") + 1;
      const PER_DAY_RENT = car && car.per_day_rent;
      const totalRent = PER_DAY_RENT * dayDifference;
      setCarRentDetail((preview) => ({
        ...preview,
        no_of_day: dayDifference,
        per_day_rent: PER_DAY_RENT,
        total_rent: totalRent,
      }));
      //
    }
  }, [carRentDetail.startDate, carRentDetail.endDate, car]);

  useEffect(() => {
    // Get Booked date range
    const getBookedDateRange = async () => {
      const requestData = {
        car_id: id,
      };
      const response = await axiosPostResponse(
        "cars/car-booked-date",
        requestData,
        false
      );

      if (response) {
        console.log("response: ", response);
        setCarBookedDates(response.data);
      }
    };

    if (showModal) {
      getBookedDateRange();
    }
  }, [id, showModal]);
  // css code start

  const spanStyle = {
    padding: "20px",
    background: "transmission",
    color: "#000000",
    fontSize: "24px",
    fontWeight: 600,
  };

  const properties = {
    prevArrow: <FaAnglesLeft className="text-primary" />,
    nextArrow: <FaAnglesRight className="text-primary" />,
  };

  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "300px",
  };
  // css code end

  return (
    <div>
      <Button className="ms-5 mt-2" onClick={() => navigate(-1)}>
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
        {}
        {!loader && car && (
          <>
            <Row>
              <Col md={6}>
                <div className="slide-container">
                  <Slide {...properties}>
                    {car &&
                      car.car_attachments &&
                      car.car_attachments.map((slideImage, index) => (
                        <div key={index}>
                          <div
                            style={{
                              ...divStyle,
                              backgroundImage: `url(${
                                process.env.REACT_APP_API_IMAGE_PATH +
                                "/" +
                                slideImage.url
                              })`,
                            }}
                          >
                            <span style={spanStyle}>{slideImage?.caption}</span>
                          </div>
                        </div>
                      ))}
                  </Slide>
                </div>
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

                    <Image
                      src={
                        process.env.REACT_APP_API_IMAGE_PATH +
                        "/" +
                        car.owner?.avatar
                      }
                      thumbnail
                    />
                  </Col>
                  <Col md={6} className="mt-4 pt-4">
                    <p>
                      <strong>Name:</strong> {car.owner.full_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {car.owner.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {car.owner.phone}
                    </p>
                  </Col>
                </Row>
              </Col>
              {car.seller && (
                <Col md={6}>
                  <Row>
                    <Col md={6}>
                      <span className="heading">Seller Detail</span>
                      <Image
                        src={
                          process.env.REACT_APP_API_IMAGE_PATH +
                          "/" +
                          car.seller?.avatar
                        }
                        thumbnail
                      />
                    </Col>
                    <Col md={6} className="mt-4 pt-4">
                      <p>
                        <strong>Name:</strong> {car.seller.full_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {car.seller.email}
                      </p>
                      <p>
                        <strong>phone:</strong> {car.seller.phone}
                      </p>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </>
        )}
      </Container>

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
            <Col className="col-6">
              <Form.Group controlId="endDate">
                <Form.Label>Select Date</Form.Label>
                <DatePicker
                  value={dateRange}
                  onChange={handelFormData}
                  dateSeparator=" to "
                  range
                  rangeHover
                  containerClassName="date-select mx-2 form-control"
                  placeholder="Select Date"
                  minDate={moment().format("YYYY-MM-DD")}
                  mapDays={({ date }) => {
                    let props = {};
                    if (isDateBooked(date.toDate())) {
                      props.disabled = true;
                      props.style = {
                        backgroundColor: "#d7d3d3",
                        color: "#fff",
                      };
                    }
                    return props;
                  }}
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
                Total::{carRentDetail.total_rent}
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
