import React, { useCallback, useContext, useEffect, useState } from "react";
import { Badge, Card, Form, Row, Spinner, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import notFoundImg from "../../image/not-found.jpg";
import CarOnRent from "../cars/CarOnRent";
import MyPagination from "../pagination";
import { axiosDeleteResponse, axiosPostResponse } from "../../services/axios";
import { CarFilterContext } from "./Profile";
import Emitter from "../../services/emitter";

export default function CarList({ setCarTotalCount, perPage }) {
  const MySwal = withReactContent(Swal);
  const [loader, setLoader] = useState(false);
  const [cars, setCars] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState();
  const navigate = useNavigate();
  const { carFilter } = useContext(CarFilterContext);

  //Get Cars list
  const getCars = useCallback(async () => {
    setLoader(true);
    const requestData = {
      status: carFilter,
      per_page: perPage,
      page: currentPage,
    };

    const response = await axiosPostResponse(
      "/cars/owner-car-list",
      requestData
    );
    if (response) {
      const data = response.data;
      setCars(data.cars);
      setTotalCount(data.count);
      setCarTotalCount(data.count);
    }

    setLoader(false);
  }, [carFilter, perPage, currentPage, setCarTotalCount]);

  // Navigate to edit page
  const editCarDetail = (id) => {
    navigate(`/add-car/${id}`);
  };

  // Update Car set car for rent
  const onChangeHandler = async (e, id) => {
    const carForRent = e.target.checked;

    if (carForRent) {
      MySwal.fire({
        title: "Add Detail",
        icon: "none",
        showCancelButton: true,
        confirmButtonText: "Add",
        input: "text",
        inputPlaceholder: `
        Enter per day rent
      `,
        inputValidator: (result) => {
          return !result && "please enter rent!";
        },
        customClass: {
          confirmButton: "btn text-bg-primary",
          cancelButton: "btn btn-danger",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          updateCarForRent(carForRent, id, result.value);
        }
      });
    } else {
      updateCarForRent(carForRent, id);
    }
  };

  async function updateCarForRent(status, id, rentValue = null) {
    const requestData = {
      id: id,
      car_for_rent: status,
      per_day_rent: rentValue,
    };

    const response = await axiosPostResponse(
      "cars/set-car-for-rent",
      requestData,
      true
    );
    if (response) {
      getCars();
      Emitter.emit('reloadCarStatusCount',true);
    }
  }

  // Show Confirmation message for car delete
  const deleteConfirmation = (id) => {
    MySwal.fire({
      title: "Do you want to delete this car?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonClass: "",
      customClass: {
        confirmButton: "btn text-bg-danger",
        cancelButton: "btn btn-danger",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCar(id); // Yes to call deleteCar function
      }
    });
  };

  // Delete Car
  async function deleteCar(id) {
    const response = await axiosDeleteResponse(`cars/delete/${id}`, {}, true);
    if (response) {
      getCars();
      Emitter.emit('reloadCarStatusCount',true);
    }
  }

  useEffect(() => {
    getCars();
  }, [getCars]);

  useEffect(() => {
    setCurrentPage(1);
  }, [perPage]);

  if (loader) {
    return (
      <div className="text-center" style={{ marginTop: "20%" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (cars && (carFilter === "onRent" || carFilter === "preview")) {
    return <CarOnRent cars={cars} reloadCarList={getCars} />;
  }

  return (
    <Row>
      {cars && cars.length ? (
        cars.map((item) => (
          <div key={item.id} className="col-md-3 my-2">
            <Card className="card-custome">
              <Card.Header className="text-end">
                <FaEdit
                  className="text-primary"
                  onClick={() => editCarDetail(item.id)}
                />
              </Card.Header>
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
                <Card.Subtitle className="mb-2 float-end me-2">
                  {item.model}
                </Card.Subtitle>
              </Card.Body>
              <Card.Text>
                <p className="ms-3" style={{ fontWeight: "600" }}>
                  Rs.{item.price}
                  <Badge
                    variant="primary"
                    className={`float-end me-2
                                ${
                                  item.status === "available"
                                    ? `bg-primary`
                                    : `bg-danger`
                                }`}
                  >
                    {item.status}
                  </Badge>
                </p>
                <span>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="car for rent"
                    onChange={(e) => onChangeHandler(e, item.id)}
                    className="ms-3"
                    checked={item.car_for_rent}
                  />
                </span>
              </Card.Text>
              <Card.Footer className="text-bg-dark">
                <Button
                  className="text-bg-primary viewBtn"
                  onClick={() => navigate(`/car-view/${item.id}`)}
                >
                  View
                </Button>
                <Button
                  className="text-bg-danger btn-danger deleteBtn"
                  onClick={() => deleteConfirmation(item.id)}
                >
                  Delete
                </Button>
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
      <div>
        <MyPagination
          totalCount={totalCount}
          perPage={perPage}
          currentPage={currentPage}
          handlePageChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      </div>
    </Row>
  );
}
