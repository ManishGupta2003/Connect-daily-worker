import React, { useState } from "react";
import axios from "axios"; // Make sure axios is imported

const CurrentLocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch the location when the button is clicked
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Update the state with the fetched location
          setLocation({ latitude, longitude });

          // Alert user
          alert("Location successfully accessed!");

          // Prepare data to be sent to the server
          const locationData = {
            Latitude: latitude,
            Longitude: longitude,
          };

          try {
            // Send location data to the server
            const response = await axios.post(
              "http://localhost:3000/location",
              locationData
            );
            console.log(response.data);
          } catch (error) {
            console.error("Error sending location to server:", error);
          }
        },
        (error) => {
          setError(error.message);
          console.error("Error fetching location:", error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      console.error("Geolocation not supported");
    }
  };

  return (
    <div>
      <h1>Current Location</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <p>
            Latitude:{" "}
            {location.latitude ? location.latitude : "Not fetched yet"}
          </p>
          <p>
            Longitude:{" "}
            {location.longitude ? location.longitude : "Not fetched yet"}
          </p>
          <button onClick={handleSubmit}>Get Location</button>
        </div>
      )}
    </div>
  );
};

export default CurrentLocation;
