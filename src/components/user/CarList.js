import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Badge, Card, Form, Row, Spinner, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { db } from "../firebase/Firebase";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import notify from "../../services/notify";
import notFoundImg from "../../image/not-found.jpg";
import CarOnRent from "../cars/CarOnRent";
import MyPagination from "../pagination";

export default function CarList({
  setCarCount,
  setCarTotalCount,
  carFilter,
  perPage,
}) {
  const MySwal = withReactContent(Swal);
  const userInfo = useSelector((state) => state.app.user);
  const [loader, setLoader] = useState(false);
  const [cars, setCars] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState();
  const [carOnRentList, setCarOnRentList] = useState();
  const [customerList, setCustomerList] = useState();
  const navigate = useNavigate();

  //Get Cars list
  const getCars = async () => {
    const carCollection = collection(db, "cars");
    const q = query(carCollection, where("owner_id", "==", userInfo.id));

    const response = await getDocs(q);

    const cars = response.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));
    setTotalCount(cars.length);
    setCarTotalCount(cars.length);
    getStatusWiseCount(cars);
    setCars(cars);
  };

  // set status wise car Count
  const getStatusWiseCount = (items) => {
    const carStatusCount = items.reduce((count, car) => {
      const { status } = car;
      count[status] = (count[status] || 0) + 1;
      if (car.car_for_rent && car.car_for_rent === "yes") {
        count["car_for_rent"] = (count["car_for_rent"] || 0) + 1;
      }
      return count;
    }, {});
    setCarCount({
      avaliable: carStatusCount.available,
      carForRent: carStatusCount.car_for_rent,
      sold: carStatusCount.sold,
      carOnRent: carStatusCount.onRent,
    });
  };

  // Filter on cars list
  const carsListFilter = useMemo(() => {
    let filterData = cars;
    if (
      carFilter === "available" ||
      carFilter === "sold" ||
      carFilter === "onRent"
    ) {
      filterData = cars.filter((item) => item.status === carFilter);
    } else if (carFilter === "car_for_rent") {
      filterData = cars.filter((item) => item.car_for_rent === "yes");
    }
    let count = filterData && filterData.length ? filterData.length : 0;
    setTotalCount(count);
    return filterData;
  }, [carFilter, cars]);

  // Navigate to edit page
  const editCarDetail = (id) => {
    navigate(`/add-car/${id}`);
  };

  // Update Car set car for rent
  const onChangeHandler = async (e, id) => {
    const carForRent = e.target.checked ? "yes" : "no";

    if (carForRent === "yes") {
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
    const carDoc = doc(db, "cars", id);
    await updateDoc(carDoc, {
      car_for_rent: status,
      per_day_rent: rentValue,
    })
      .then(() => {
        console.log("Updated");
        getCars();
      })
      .catch((error) => {
        console.log("Error", error);
      });
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
    //console.log("carDoc: ", id);
    const carDoc = doc(db, "cars", id);
    const carAttachmentsColleaction = collection(db, "car_attachments");
    const q = query(carAttachmentsColleaction, where("car_id", "==", id));

    const response = await getDocs(q);
    console.log("response: ", response);
    const batch = writeBatch(db);
    console.log("batch: ", batch);

    response.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();

    await deleteDoc(carDoc)
      .then((response) => {
        getCars();
        notify.success("Car Deleted Successfully");
        //console.log("Response", response);
      })
      .catch((error) => {
        //console.log("Error", error);
      });
  }

  // Get Car on rent details
  const getCarOnRentDetail = async () => {
    setLoader(true);

    const carCollection = collection(db, "rent_car_details");
    const q = query(carCollection, where("owner_id", "==", userInfo.id));
    const response = await getDocs(q);

    const carOnRentList = response.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));

    const customerIds = carOnRentList.map((obj) => obj.customer_id);
    if (customerIds && customerIds.length) {
      getCustomerDetail(customerIds);
    }
    setCarOnRentList(carOnRentList);
    setLoader(false);
  };

  // Get Customer Detail
  async function getCustomerDetail(ids) {
    //console.log("ids",ids);
    const customerCollection = collection(db, "users");
    const q = query(customerCollection, where("__name__", "in", ids));
    let response = await getDocs(q);
    const customers = response.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));
    setCustomerList(customers);
  }

  useEffect(() => {
    getCars();
    getCarOnRentDetail();
    // getCarOnRentDetail();
  }, []);

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
  } else if (carFilter === "onRent" && cars && carOnRentList && customerList) {
    return (
      <CarOnRent
        carRent={carOnRentList}
        cars={cars}
        customers={customerList}
        reloadCarList={getCars}
      />
    );
  }

  return (
    <Row>
      {carsListFilter && carsListFilter.length ? (
        carsListFilter
          .slice((currentPage - 1) * perPage, currentPage * perPage)
          .map((item) => (
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
                  src={item.image_url}
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
                      checked={item.car_for_rent === "yes" ? true : null}
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
