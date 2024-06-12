import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";
import { db, storage } from "../firebase/Firebase";
import "../../css/profile.css";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { FaEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import FileUpload from "../fileUpload";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { setLoginUserData } from "../../store/app";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CarOnRent from "../cars/CarOnRent";
import AddDum from "../../data/AddDum";
import notFoundImg from "../../image/not-found.jpg";
export default function Profile() {
  const MySwal = withReactContent(Swal);
  const userInfo = useSelector((state) => state.app.user);
  const [showUpload, setShowUpload] = useState(false);
  const [cars, setCars] = useState();
  const [carOnRentList, setCarOnRentList] = useState();
  const [carCount, setCarCount] = useState(null);
  const [customerList, setCustomerList] = useState();
  const [carFilter, setCarFilter] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Upload User profile image
  const uploadImage = (e) => {
    const imageRef = ref(storage, `user/${uuid()}`);
    // Upload Image to firebase storege
    uploadBytes(imageRef, e[0].image)
      .then((response) => {
        //console.log("response", response);
        // Get the download URL
        getDownloadURL(imageRef)
          .then((url) => {
            //console.log("File available at", url);
            updateUserProfileImage(url);
          })
          .catch((error) => {
            //console.log("Error getting download URL", error);
          });
      })
      .catch((error) => {
        //console.log("Error", error);
      });
  };

  function updateUserProfileImage(url) {
    // Update User Profile Image to set url
    const userRef = doc(db, "users", userInfo.id);
    updateDoc(userRef, { avatar: url })
      .then(() => {
        const user = {
          ...userInfo,
          avatar: url,
        };
        dispatch(setLoginUserData(user));
        localStorage.setItem("user", JSON.stringify(user));
        setShowUpload(false);
      })
      .catch((error) => {
        //console.log("Error", error);
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

  // Update Car set car for rent
  const onChangeHandler = async (e, id) => {
    //console.log(e.target.value, id);
    const carForRent = e.target.checked ? "yes" : "no";

    const carDoc = doc(db, "cars", id);
    await updateDoc(carDoc, {
      car_for_rent: carForRent,
    })
      .then(() => {
        console.log("Updated");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  // Delete Car
  async function deleteCar(id) {
    //console.log("carDoc: ", id);
    const carDoc = doc(db, "cars", id);
    await deleteDoc(carDoc)
      .then((response) => {
        //console.log("Response", response);
      })
      .catch((error) => {
        //console.log("Error", error);
      });
  }

  // Get Car on rent details
  const getCarOnRentDetail = async () => {
    const carCollection = collection(db, "rent_car_details");
    const q = query(carCollection, where("owner_id", "==", userInfo.id));
    const response = await getDocs(q);

    const carOnRentList = response.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));

    const customerIds = carOnRentList.map((obj) => obj.customer_id);
    //  console.log('carOnRentList: ', carOnRentList);
    if (customerIds && customerIds.length) {
      getCustomerDetail(customerIds);
    }

    setCarOnRentList(carOnRentList);

    setCarCount((preview) => ({
      ...preview,
      carOnRent: response.docs.length,
    }));
    //console.log("car on rent::",carCount);
  };

  // set status wise car Count
  const getStatusWiseCount = (items) => {
    //console.log("items: ", items);
    // if(cars && cars.length) {
    const carStatusCount = items.reduce((count, car) => {
      const { status } = car;
      count[status] = (count[status] || 0) + 1;
      if (car.car_for_rent && car.car_for_rent === "yes") {
        count["car_for_rent"] = (count["car_for_rent"] || 0) + 1;
      }
      return count;
    }, {});

    // //console.log("carStatusCount: ", carStatusCount);
    setCarCount((preview) => ({
      ...preview,
      avaliable: carStatusCount.available,
      carForRent: carStatusCount.car_for_rent,
      sold: carStatusCount.sold,
    }));
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
    // else if(carFilter === 'car_on_rent') {
    //   const carId = carOnRentList.map((obj) => obj.car_id);
    //   filterData = cars.filter((item) => carId.includes(item.id));
    // }
    return filterData;
  }, [carFilter, cars]);


  // edit carDetail
  const editCarDetail = (id) => {
    navigate(`/add-car/${id}`)
  }

  useEffect(() => {
    //Get Cars list
    const getCars = async () => {
      const carCollection = collection(db, "cars");
      const q = query(carCollection, where("owner_id", "==", userInfo.id));

      const response = await getDocs(q);

      const cars = response.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      console.log("cars", cars);
      getStatusWiseCount(cars);
      setCars(cars);
    };
    getCars();
    getCarOnRentDetail();
    // getCarOnRentDetail();
  }, []);

  return (
    <>
      {showUpload && (
        <FileUpload
          handelFileUpload={uploadImage}
          title="Upload Profile Image"
        />
      )}
      <div>
        <Row className="user-profile">
          <Col className="col-3">
            {/* User Profile card view start */}
            {userInfo && (
              <div className="profile-card">
                <div className="card" style={{ width: "18rem" }}>
                  <img
                    src={userInfo.avatar}
                    className="card-img-top"
                    alt="User Avatar"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{userInfo.full_name}</h5>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Email:</strong> {userInfo.email}
                    </li>
                    <li className="list-group-item">
                      <strong>Location:</strong> {userInfo.city}
                    </li>
                  </ul>
                  <div className="card-body">
                    <Button onClick={() => setShowUpload(!showUpload)}>
                      Upload Image
                    </Button>
                  </div>
                </div>
                {/* User Profile card view end */}

                {/* Car's count */}
                <div className="mt-5">
                  <div className="card" style={{ width: "18rem" }}>
                    <div className="card-body">
                      <h5 className="card-title">Car Count</h5>
                      {cars && cars.length === 0 && <AddDum />}
                    </div>
                    <ul className="list-group list-group-flush">
                      <li
                        className="list-group-item d-flex justify-content-between"
                        onClick={() => setCarFilter("available")}
                      >
                        <strong>Available :</strong>
                        <Badge variant="primary">
                          {carCount && carCount.avaliable
                            ? carCount.avaliable
                            : 0}
                        </Badge>
                      </li>
                      <li
                        className="list-group-item d-flex justify-content-between"
                        onClick={() => setCarFilter("sold")}
                      >
                        <strong>Sold :</strong>
                        <Badge variant="primary">
                          {carCount && carCount.sold ? carCount.sold : 0}
                        </Badge>
                      </li>
                      <li
                        className="list-group-item d-flex justify-content-between"
                        onClick={() => setCarFilter("car_for_rent")}
                      >
                        <strong>Car for rent :</strong>
                        <Badge variant="primary">
                          {carCount && carCount.carForRent
                            ? carCount.carForRent
                            : 0}
                        </Badge>
                      </li>
                      <li
                        className="list-group-item d-flex justify-content-between"
                        onClick={() => setCarFilter("onRent")}
                      >
                        <strong>Car on rent :</strong>
                        <Badge variant="primary">
                          {carCount && carCount.carOnRent
                            ? carCount.carOnRent
                            : 0}
                        </Badge>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Col>

          {/* Car Details */}
          <Col md={9} sm={12} className="car-detail">
            <Row>
              {carsListFilter && carsListFilter.length ? (
                carsListFilter.map((item) => (
                  <div key={item.id} className="col-md-3 my-2">
                    <Card style={{ width: "18rem", height: "500px" }}>
                      <Card.Header className="text-end">
                        <FaEdit
                          className="text-primary"
                          onClick={() => editCarDetail(item.id)}
                        />
                      </Card.Header>
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
                        <p className="ms-3">
                          <strong>Status:</strong>
                          <Badge
                            variant="primary"
                            className={
                              item.status == "available"
                                ? `bg-primary`
                                : `bg-danger`
                            }
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
                      <Card.Footer className="text-muted">
                        <Button
                          className="text-bg-primary"
                          onClick={() => navigate(`/car-view/${item.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          className="text-bg-danger btn-danger ms-2"
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
                    height="60%"
                    className="d-inline-block align-top"
                    alt="R"
                  />
                </div>
              )}
            </Row>
          </Col>
        </Row>
      </div>
      {cars && carOnRentList && customerList && (
        <CarOnRent
          carRent={carOnRentList}
          cars={cars}
          customers={customerList}
        />
      )}
    </>
  );
}