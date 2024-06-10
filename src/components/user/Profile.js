import React, { useEffect, useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import FileUpload from "../fileUpload";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { setLoginUserData } from "../../store/app";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Profile() {
  const MySwal = withReactContent(Swal);

  const userInfo = useSelector((state) => state.app.user);
  const [showUpload, setShowUpload] = useState(false);
  const [cars, setCars] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uploadImage = (e) => {
    const imageRef = ref(storage, `user/${uuid()}`);
    // Upload Image to firebase storege
    uploadBytes(imageRef, e[0].image)
      .then((response) => {
        console.log("response", response);
        // Get the download URL
        getDownloadURL(imageRef)
          .then((url) => {
            console.log("File available at", url);
            updateUserProfileImage(url);
          })
          .catch((error) => {
            console.log("Error getting download URL", error);
          });
      })
      .catch((error) => {
        console.log("Error", error);
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

  const onChangeHandler = async (e,id) => {
    console.log(e.target.value,id);
    const carForRent = e.target.checked ? 'yes' : 'no';

    const carDoc = doc(db,'cars',id);
    await updateDoc(carDoc,{
      car_for_rent:carForRent
    }).then(() => {
      console.log("Updated");
    }).catch((error) => {
      console.log("Error",error);
    })
  };

  // Delete Car
  async function deleteCar(id) {
    console.log("carDoc: ", id);
    const carDoc = doc(db, "cars", id);
    await deleteDoc(carDoc)
      .then((response) => {
        console.log("Response", response);
      })
      .catch((error) => {
        console.log("Error", error);
      });
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
      setCars(cars);
    };
    getCars();
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
                <div></div>
              </div>
            )}
          </Col>

          {/* Car Details */}
          <Col md={9} sm={12} className="car-detail">
            <Row>
              {cars &&
                cars.map((item) => (
                  <div key={item.id} className="col-md-3 my-2">
                    <Card style={{ width: "18rem", height: "500px" }}>
                      <Card.Img
                        variant="bottom"
                        src={item.image_url}
                        style={{ height: "250px", objectFit: "contain" }}
                      />
                      <Card.Body>
                        <Card.Title>{item.compna_name}</Card.Title>
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
                            label="car on for rent"
                            onChange={(e)=> onChangeHandler(e,item.id)}
                            className="ms-3"
                            checked={item.car_for_rent === 'yes' ? true : null}
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
                ))}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
