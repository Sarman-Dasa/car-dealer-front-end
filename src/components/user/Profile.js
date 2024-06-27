import React, { createContext, useCallback, useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import { db, storage } from "../firebase/Firebase";
import "../../css/profile.css";
import { doc, updateDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import FileUpload from "../fileUpload";
import { v4 as uuid } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { setLoginUserData } from "../../store/app";
import AddDum from "../../data/AddDum";
import CarList from "./CarList";
import { axiosPostResponse } from "../../services/axios";
import Emitter from "../../services/emitter";
export const CarFilterContext = createContext()

export default function Profile() {
  const userInfo = useSelector((state) => state.app.user);
  const [showUpload, setShowUpload] = useState(false);
  const [carCount, setCarCount] = useState(null);
  const [carFilter, setCarFilter] = useState(null);
  const [perPage, setPerPage] = useState(4);
  const [carTotalCount,setCarTotalCount] = useState(0);
  const perPageOption = [4, 8, 16, 32];
  const dispatch = useDispatch();

  // Upload User profile image
  const uploadImage = (e) => {
    const id = uuid();
    const imageRef = ref(storage, `images/${id}`);
    // Upload Image to firebase storege
    uploadBytes(imageRef, e[0].image)
      .then((response) => {
        console.log("response", response);
        // Get the download URL
        getDownloadURL(imageRef)
          .then(async (url) => {
            //console.log("File available at", url);
            //Delete old image for firebase storege
            const imageRef = ref(storage, `images/${userInfo.avatar_id}`);
            await deleteObject(imageRef)
              .then((result) => {
                console.log("result: ", result);
              })
              .catch((err) => {
                console.log("err: ", err);
              });
            updateUserProfileImage(url, id); // update user data
          })
          .catch((error) => {
            //console.log("Error getting download URL", error);
          });
      })
      .catch((error) => {
        //console.log("Error", error);
      });
  };

  function updateUserProfileImage(url, id) {
    // Update User Profile Image to set url
    const userRef = doc(db, "users", userInfo.id);
    updateDoc(userRef, { avatar: url, avatar_id: id })
      .then(() => {
        const user = {
          ...userInfo,
          avatar: url,
          avatar_id: id,
        };
        dispatch(setLoginUserData(user));
        localStorage.setItem("user", JSON.stringify(user));
        setShowUpload(false);
      })
      .catch((error) => {
        //console.log("Error", error);
      });
  }

  const statusWiseCarCount = async () => {
    const response = await axiosPostResponse('cars/car-count');
    if(response) {
      const data = response.data;
      setCarCount({
        avaliable: data.avaliable,
        carForRent: data.car_for_rent,
        sold: data.sold,
        carOnRent: data.on_rent,
        totalCount: data.count,
      });
    }
  }

  useEffect(() => {
    statusWiseCarCount();

    Emitter.on('reloadCarStatusCount',() => {
      statusWiseCarCount();
    })

    Emitter.on('reloadCar',(data) => {
        setCarFilter(data);
    })
    return () => {
      Emitter.off('reloadCarStatusCount');
      Emitter.off('reloadCar');
    };
  }, []);

  // Memoize the setter function
  const setCarTotalCountCallback = useCallback((count) => {
    setCarTotalCount(count);
  }, []);

  return (
    <>
      {showUpload && (
        <div className="" style={{ maxWidth: "400px" }}>
          <FileUpload
            handelFileUpload={uploadImage}
            title="Upload Profile Image"
            showFooter={true}
          />
        </div>
      )}
      <div>
        <Row className="user-profile g-0">
          <Col className="col-3">
            {/* User Profile card view start */}
            {userInfo && (
              <div className="profile-card">
                <div className="card" style={{ width: "18rem" }}>
                  <img
                    src={ process.env.REACT_APP_API_IMAGE_PATH +
                      "/" + userInfo.avatar}
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

                {/* Car's count card Start */}
                <div className="mt-2">
                  <div className="card" style={{ width: "18rem" }}>
                    <div className="card-body  d-flex justify-content-between">
                      <h5 className="card-title" style={{ minWidth: "50%" }}>
                        Car Count
                      </h5>
                      {/* Only for testing purposes to add dummy data */}
                      {!carTotalCount ? (
                        <AddDum />
                      ) : (
                        <Form.Select
                          size="sm"
                          onChange={(e) => setPerPage(e.target.value)}
                          defaultValue={perPageOption[0]}
                        >
                          {perPageOption.map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    </div>
                    <ul className="list-group list-group-flush">
                      <li>
                      <li
                        className="list-group-item d-flex justify-content-between"
                        onClick={() => setCarFilter(null)}
                      >
                        <strong>All :</strong>
                        <Badge variant="primary">
                          {carCount && carCount.totalCount
                            ? carCount.totalCount
                            : 0}
                        </Badge>
                      </li>
                      </li>
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
                {/* Car's count card end */}
              </div>
            )}
          </Col>
          {/* Car Details */}
          <Col md={9} sm={12} className="car-detail">
          <CarFilterContext.Provider value={{carFilter, setCarFilter}}>
            <CarList
              setCarCount={setCarCount}
              setCarTotalCount={setCarTotalCountCallback}
              perPage={perPage}
            />
            </CarFilterContext.Provider>
          </Col>
        </Row>
      </div>
    </>
  );
}
