import React, { useEffect, useState } from "react";
import { db } from "./firebase/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate,createSearchParams } from "react-router-dom";
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

export default function Dashboard() {
  const [cars, setCars] = useState();
  const [showFilter, setshowFilter] = useState(false);
  const [carType, setCarType] = useState("available");
  const [priceRange, setPriceRange] = useState(0);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.app.user);

  const viewMore = (id) => {
    navigate(`/car-view/${id}`);
  };

  const getCars = async () => {
    const carCollection = collection(db, "cars");

    const whereConditions = [
      where("owner_id", "!=",userInfo.id)
    ];

    if (carType === "available") {
      whereConditions.push(where("status", "==", "available"));
    } else if (carType === "rent") {
      whereConditions.push(where("car_for_rent", "==", "yes"));
    }
    if (priceRange) {
      whereConditions.push(where("price", "<=", priceRange));
    }

    const q = query(carCollection, ...whereConditions);
    const response = await getDocs(q);

    const cars = response.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));
    setCars(cars);
  };

  const applyFilter = () => {
    getCars();
    setshowFilter(false);
  };

  const getCarForRent = (id) => {
    navigate(`/car-view/${id}?${createSearchParams({
      type:'car_for_rent'
    })}`);
  }

  useEffect(() => {
    if(!userInfo) {
      navigate('/sign-in');
      return;
    }
    getCars();
  }, []);

  const handleClose = () => {
    setshowFilter(false);
  };

  return (
    <div>
      <MdFilterAlt size="36px" onClick={() => setshowFilter(!showFilter)} className="ms-5"/>
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
        </Modal.Footer>
      </Modal>
      <Container>
        <Row>
          {cars &&
            cars.map((item) => (
              <div key={item.id} className="col-md-3 my-2">
                <Card style={{ width: "18rem", height: "400px" }}>
                  <Card.Img
                    variant="bottom"
                    src={item.image_url}
                    style={{ height: "250px", objectFit: "contain" }}
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
                    {carType === 'available' ?
                    <button
                    className="text-bg-primary btn btn-primary"
                    onClick={() => viewMore(item.id)}
                  >
                    View
                  </button> : <button
                      className="text-bg-primary btn btn-primary"
                      onClick={() => getCarForRent(item.id)}
                    >
                      Get
                    </button> }
                  </Card.Footer>
                </Card>
              </div>
            ))}
        </Row>
      </Container>
    </div>
  );
}
