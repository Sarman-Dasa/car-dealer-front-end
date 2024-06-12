import React, { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "../../css/style.css";
import { Form } from "react-bootstrap";
export default function GoogleMap({ getUserLocation }) {
  const [location, setLocation] = useState({
    lat: 23.193047405903453,
    lng: 72.61577348844713,
  });

  const [searchPlace, setSearchPlace] = useState();

  const handelOnSearchChange = (e) => {
    console.log(e.target.value);
  };

  const handleMarkerClick = (e) => {
    setLocation(e.detail.latLng);
    getUserLocation(e.detail.latLng);
  };
  return (
    <div className="app-container">
      <div>
      <Form.Group controlId="startDate">
        <Form.Label>Star date</Form.Label>
        <Form.Control
          type="search"
          placeholder="Enter car color"
          name="startDate"
          value={searchPlace}
          onChange={handelOnSearchChange}
        />
      </Form.Group>
      </div>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultZoom={12}
          center={{ lat: 23.193047405903453, lng: 72.61577348844713 }}
          onClick={handleMarkerClick}
        >
          <Marker position={location} />
        </Map>
      </APIProvider>
    </div>
  );
}
