import React, { useEffect, useState } from "react";
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";
import {
  Card,
  Row,
  Container,
  Button,
  Modal,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { MdFilterAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import notFoundImg from "../image/not-found.jpg";
import { axiosPostResponse } from "../services/axios";

export default function Cars() {
  const [cars, setCars] = useState();
  const [showFilter, setshowFilter] = useState(false);
  const [carType, setCarType] = useState("available");
  const [priceRange, setPriceRange] = useState(0);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.app.user);
  const [searchParams] = useSearchParams();

  const viewMore = (id) => {
    navigate(`/car-view/${id}`);
  };

  const getCars = async () => {
    const requestData = {
      price_range: priceRange,
      car_type: carType,
    };
    const response = await axiosPostResponse("/cars", requestData);
    if (response) {
      console.log(response);
      const data = response.data;
      setCars(data);
    }
  };

  const applyFilter = () => {
    getCars();
    navigate(
      `/cars?${createSearchParams({
        type: carType,
        range:priceRange
      })}`);
    setshowFilter(false);
  };

  const clearFilter = () => {
    setPriceRange(0);
    setCarType('available');
    applyFilter();
  }

  const getCarForRent = (id) => {
    navigate(
      `/car-view/${id}?${createSearchParams({
        type: "car_for_rent",
      })}`
    );
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/sign-in");
      return;
    }
    getCars();

  }, []);

  useEffect(() => {
    const type = searchParams.get('type') || 'available';
    const range = searchParams.get('range') || 0;

    setCarType(type);
    setPriceRange(range);
  }, [searchParams]);

  const handleClose = () => {
    setshowFilter(false);
  };

  return (
    <div>
      <MdFilterAlt
        size="36px"
        onClick={() => setshowFilter(!showFilter)}
        className="ms-5 float-end"
      />
      <Modal show={showFilter} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="Status">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
            >
              <option value="available">purchase</option>
              <option value="rent">For Rent</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="range">
            <Form.Label>Range</Form.Label>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="button-tooltip-2">{priceRange}</Tooltip>}
            >
              <Form.Control
                type="range"
                name="priceRange"
                min={0}
                max={1000000}
                step={5000}
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </OverlayTrigger>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={applyFilter}>
            Apply
          </Button>
          <Button variant="danger" onClick={clearFilter}>
            Clear
          </Button>
        </Modal.Footer>
      </Modal>
      <Container fluid>
        <Row>
          {cars && cars.length ? (
            cars.map((item) => (
              <div key={item.id} className="col-md-3 my-2">
                <Card style={{ width: "25rem", height: "auto" }}>
                  <Card.Img
                    variant="bottom"
                    src={
                      process.env.REACT_APP_API_IMAGE_PATH +
                      "/" +
                      item.car_attachment?.url
                    }
                    style={{ height: "250px", objectFit: "inherit" }}
                  />
                  <Card.Body>
                    <Card.Title>{item.company_name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {item.model}
                    </Card.Subtitle>
                  </Card.Body>
                  <Card.Text>
                    <p className="ms-3" style={{ fontWeight: "600" }}>
                      Rs.{item.price}
                    </p>
                  </Card.Text>
                  <Card.Footer className="text-muted">
                    {carType === "available" ? (
                      <button
                        className="text-bg-primary btn btn-primary"
                        onClick={() => viewMore(item.id)}
                      >
                        View
                      </button>
                    ) : (
                      <button
                        className="text-bg-primary btn btn-primary"
                        onClick={() => getCarForRent(item.id)}
                      >
                        Get
                      </button>
                    )}
                  </Card.Footer>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center">
              <img
                src={notFoundImg}
                width="60%"
                height="100%"
                className="d-inline-block align-top"
                alt="R"
              />
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
}
