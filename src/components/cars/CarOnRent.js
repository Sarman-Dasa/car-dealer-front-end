import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Collapse,
  Image,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { TbSquareRoundedChevronsRightFilled } from "react-icons/tb";
import { TbSquareRoundedChevronsDownFilled } from "react-icons/tb";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { db } from "../firebase/Firebase";

export default function CarOnRent({ carRent, cars, customers,reloadCarList }) {

  const [openItem, setOpenItem] = useState({});
  // const [oldCarRentIds,setOldCarRentsIds] = useState();
  const [carRentFilter,setCarRentFilter] = useState('current');
  const [carForRent, setCarForRent] = useState(cars.filter((item) => item.status === "onRent"));
  const MySwal = withReactContent(Swal);

  const mapCustomerAndCarOnRentData = useMemo(() => {
    let items = carRent.map((item) => {
      const customerDetail = customers.find(
        (cus) => cus.id === item.customer_id
      );
      return { ...item, customerDetail };
    });
    // console.log("map rent & customer::",items);
    return items;
  }, [carRent, customers]);

  // const carForRent = cars.filter((item) => item.status === "onRent");
  // const carForRent = cars.filter((item) => item.car_for_rent === "yes");
  // console.log("carForRent: ", carForRent);

  const detail = useMemo(() => {
    let items = carForRent.map((item) => {
      const carRentDetail = mapCustomerAndCarOnRentData.filter(
        (carR) => carR.car_id === item.id
      );
      return { ...item, carRentDetail };
    });
    console.log("items: ", items);
    return items;
  }, [carForRent, mapCustomerAndCarOnRentData]);

  // Toggle car detail collepase 
  const collapaseToggle = (index) => {
    setOpenItem((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const endDateFilter = (date, status) => {
    let endDate = moment(date);
    if (status === "onRent") {
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
    console.log(id);
      const carDoc = doc(db,'cars',id);
      await updateDoc(carDoc,{status:'available'}).then(() => {
        toast.success("Data updated");
        reloadCarList();
      }).catch((err) => {
         toast.error(err);
      });
  }

  useEffect(() => {
      if(carRentFilter === 'current') {
        const carForRent = cars.filter((item) => item.status === "onRent");
        setCarForRent(carForRent);
      }
      else if(carRentFilter === 'preview') {
        const carIds = carRent.map((obj) => obj.car_id);
        const carForRent = cars.filter((item) => carIds.includes(item.id) && item.status !== "onRent");
        setCarForRent(carForRent);
      }
  },[carRent, carRentFilter, cars]);

  return (
    <>
    <div className="float-end mb-5 me-2">
      <Button onClick={() => setCarRentFilter('current')}>Show current car on rent detail </Button>
      <Button  onClick={() => setCarRentFilter('preview')} className="ms-3">Show past car on rent detail </Button>
    </div>
    <Table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Company Name</th>
          <th>Model</th>
          <th>Number</th>
          { carRentFilter === 'current' &&  <th>Action</th> }
        </tr>
      </thead>
      <tbody>
        {detail &&
          detail.map((item, index) => (
            <>
              <tr key={index} style={{ cursor: "pointer" }}>
                <td>
                  <span className="me-2" onClick={() => collapaseToggle(index)}>
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
                    src={item.image_url}
                    thumbnail
                    height="100px"
                    width="100px"
                    className="border-0"
                  />
                </td>
                <td>{item.company_name}</td>
                <td>{item.model}</td>
                <td>{item.number}</td>
                 {
                 carRentFilter === 'current' && <td className="text-start">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-disabled">Update Status</Tooltip>}
                  >
                    <Button
                      className="btn bg-transparent border-0"
                      onClick={() => updateCarStatusConfirmation(item.id)}
                    >
                      <FaEdit className="text-primary" />
                    </Button>
                  </OverlayTrigger>
                </td>
                 }
              </tr>
              <tr>
                <td colSpan="5" className="p-0">
                  <Collapse in={openItem[index]}>
                    <div id={`collapse-${index}`}>
                      {item.carRentDetail && item.carRentDetail.length > 0 && (
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
                            {item.carRentDetail.map((detail, inx) => (
                              <tr key={inx}>
                                <td>
                                  <Image
                                    src={detail.customerDetail.avatar}
                                    thumbnail
                                    height="100px"
                                    width="100px"
                                  />
                                </td>
                                <td>{detail.customerDetail.full_name}</td>
                                <td>{detail.customerDetail.email}</td>
                                <td>{detail.customerDetail.phone}</td>
                                <td>{detail.startDate}</td>
                                <td>
                                  <Badge
                                    variant="primary"
                                    className={
                                      endDateFilter(detail.endDate, item.status)
                                        ? `bg-danger`
                                        : `bg-primary`
                                    }
                                  >
                                    {detail.endDate}
                                  </Badge>
                                </td>
                                <td>{detail.no_of_day}</td>
                                <td>{detail.per_day_rent}</td>
                                <td>{detail.rent}</td>
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
      <ToastContainer />
    </Table>
    </>
  );
}
