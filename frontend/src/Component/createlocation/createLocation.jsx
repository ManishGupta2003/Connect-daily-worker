import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure this path is correct

const center = [26.8828672, 80.9631744];

const LeafletMap = () => (
  <div style={{ height: "400px", width: "100%" }}>
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>A sample location.</Popup>
      </Marker>
    </MapContainer>
  </div>
);

export default LeafletMap;
