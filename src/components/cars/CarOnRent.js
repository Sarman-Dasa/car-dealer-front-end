
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Collapse,
  Image,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { TbSquareRoundedChevronsRightFilled } from "react-icons/tb";
import { TbSquareRoundedChevronsDownFilled } from "react-icons/tb";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import imageNotFound from "../../image/not-found.jpg";
import { axiosPostResponse } from "../../services/axios";
import Emitter from "../../services/emitter";

export default function CarOnRent({ cars, reloadCarList,carFilter }) {
  const [openItem, setOpenItem] = useState({});
  const [carRentFilter, setCarRentFilter] = useState(carFilter);
  const MySwal = withReactContent(Swal);

  console.log("call really",carFilter);

  // Toggle car detail collepase
  const collapaseToggle = (index) => {
    setOpenItem((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const endDateFilter = (date, status) => {
    let endDate = moment(date);
    if (carFilter === 'onRent') {
      const CURRENT_DATE = moment();
      if (endDate.isSameOrBefore(CURRENT_DATE, "day")) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const updateCarStatusConfirmation = async (id) => {
    MySwal.fire({
      title: "Are you sure to update car status as Avaliable ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonClass: "",
      customClass: {
        confirmButton: "btn text-bg-primary",
        cancelButton: "btn btn-danger",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        updateCarStatus(id);
      }
    });
  };

  async function updateCarStatus(id) {
    const requestData = {
      id: id,
      status: "available",
    };
   
    const response = await axiosPostResponse(
      `cars/change-status`,
      requestData,
      true
    );
    if (response) {
      reloadCarList();
      Emitter.emit('reloadCarStatusCount',true);
    }
  }

  useEffect(() => {
    // console.log("call filter::");
    Emitter.emit('reloadCar',carRentFilter);
  }, [carRentFilter]);

  return (
    <>
      <div className="float-end mb-5 me-2">
        <Button onClick={() => setCarRentFilter("onRent")}>
          Show current car on rent detail
        </Button>
        <Button onClick={() => setCarRentFilter("preview")} className="ms-3">
          Show past car on rent detail
        </Button>
      </div>
      {cars && cars.length ? (
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Company Name</th>
              <th>Model</th>
              <th>Number</th>
              {carRentFilter === "onRent" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {cars.map((item, index) => (
              <>
                <tr key={index} style={{ cursor: "pointer" }}>
                  <td>
                    <span
                      className="me-2"
                      onClick={() => collapaseToggle(index)}
                    >
                      {openItem[index] ? (
                        <TbSquareRoundedChevronsDownFilled
                          className="text-primary"
                          size={18}
                        />
                      ) : (
                        <TbSquareRoundedChevronsRightFilled
                          className="text-primary"
                          size={18}
                        />
                      )}
                    </span>
                    <Image
                      src={ process.env.REACT_APP_API_IMAGE_PATH +
                        "/" + item.car_attachment?.url}
                      thumbnail
                      height="100px"
                      width="100px"
                      className="border-0"
                    />
                  </td>
                  <td>{item.company_name}</td>
                  <td>{item.model}</td>
                  <td>{item.number}</td>
                  {carRentFilter === "onRent" && (
                    <td className="text-start">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-disabled">Update Status</Tooltip>
                        }
                      >
                        <Button
                          className="btn bg-transparent border-0"
                          onClick={() => updateCarStatusConfirmation(item.id)}
                        >
                          <FaEdit className="text-primary" />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  )}
                </tr>
                <tr>
                  <td colSpan="5" className="p-0">
                    <Collapse in={openItem[index]}>
                      <div id={`collapse-${index}`}>
                        {item.car_rentals &&
                          item.car_rentals.length > 0 && (
                            <Table bordered>
                              <thead>
                                <tr>
                                  <th>Image</th>
                                  <th>Name</th>
                                  <th>Email</th>
                                  <th>Phone</th>
                                  <th>Start Date</th>
                                  <th>End Date</th>
                                  <th>Days</th>
                                  <th>Per Day Rent</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.car_rentals.map((detail, inx) => (
                                  <tr key={inx}>
                                    <td>
                                      <Image
                                        src={process.env.REACT_APP_API_IMAGE_PATH +
                                          "/" + detail.customer?.avatar}
                                        thumbnail
                                        height="100px"
                                        width="100px"
                                      />
                                    </td>
                                    <td>{detail.customer.full_name}</td>
                                    <td>{detail.customer.email}</td>
                                    <td>{detail.customer.phone}</td>
                                    <td>{detail.startDate}</td>
                                    <td>
                                      <Badge
                                        variant="primary"
                                        className={
                                          endDateFilter(
                                            detail.endDate,
                                            item.status
                                          )
                                            ? `bg-danger`
                                            : `bg-primary`
                                        }
                                      >
                                        {detail.endDate}
                                      </Badge>
                                    </td>
                                    <td>{detail.no_of_day}</td>
                                    <td>{detail.per_day_rent}</td>
                                    <td>{detail.total_rent}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          )}
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center mt-5">
          <img
            src={imageNotFound}
            width="60%"
            height="60%"
            className="d-inline-block align-top"
            alt="R"
          />
        </div>
      )}
    </>
  );
}
