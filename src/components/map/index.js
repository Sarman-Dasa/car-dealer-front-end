import React, { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "../../css/style.css";
export default function GoogleMap({ getUserLocation }) {
  const [location, setLocation] = useState({
    lat: 23.193047405903453,
    lng: 72.61577348844713,
  });

  const handleMarkerClick = (e) => {
    setLocation(e.detail.latLng);
    getUserLocation(e.detail.latLng);
  };
  return (
    <div className="app-container">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultZoom={12}
          center={location}
          onClick={handleMarkerClick}
        >
          <Marker position={location} />
        </Map>
      </APIProvider>
    </div>
  );
}
