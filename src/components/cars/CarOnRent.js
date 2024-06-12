import React, { useMemo } from "react";
import { Image, Table } from "react-bootstrap";

export default function CarOnRent({ carRent, cars, customers }) {
  console.log('cars: ', cars);
  console.log("customer: ", customers);
  //   const detail = useMemo(() => {
  //     let items = carRent.map((item) => {
  //       const car = cars.find((car) => car.id === item.car_id);
  //       return { ...item, car };
  //     });
  //     return items;
  //   }, [carRent, cars]);

  const mapCustomerAndCarOnRentData = useMemo(() => {
    let items =  carRent.map((item) => {
      const customerDetail = customers.find(
        (cus) => cus.id === item.customer_id
      );
      return { ...item, customerDetail };
    });
    // console.log("map rent & customer::",items);
    return items;
  }, [carRent, customers]);

  const carForRent = cars.filter((item) => item.car_for_rent === "yes");
  console.log('carForRent: ', carForRent);

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

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Image</th>
          <th>Company Name</th>
          <th>Model</th>
          <th>Number</th>
          <th>Rental Details</th>
        </tr>
      </thead>
      <tbody>
        {console.log("detail", detail)}
        {detail &&
          detail.map((item, index) => (
            <tr key={index}>
              <td>
                <Image
                  src={item.image_url}
                  thumbnail
                  height="100px"
                  width="100px"
                />
              </td>
              <td>{item.company_name}</td>
              <td>{item.model}</td>
              <td>{item.number}</td>
              {item.carRentDetail && item.carRentDetail.length > 0 ? (
                <td>
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
                        <th>Rent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.carRentDetail.map((detail, inx) => (
                        <tr key={inx}>
                          <td>
                            {" "}
                            <Image
                              src={detail.customerDetail.avatar}
                              thumbnail
                              height="100px"
                              width="100px"
                            />
                          </td>
                          { console.log("customerDetail",detail.customerDetail)}
                          <td>{detail.customerDetail.full_name}</td>
                          <td>{detail.customerDetail.email}</td>
                          <td>{detail.customerDetail.phone}</td>
                          <td>{detail.startDate}</td>
                          <td>{detail.endDate}</td>
                          <td>{detail.no_of_day}</td>
                          <td>{detail.rent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
              ) : (
                <td className="text-center">
                  <span>No Data </span>
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
