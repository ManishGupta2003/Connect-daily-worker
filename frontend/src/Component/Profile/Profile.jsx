import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedPhone = localStorage.getItem("userPhone");
    const storedLocation = localStorage.getItem("userLocation");
    const storedImage = localStorage.getItem("userProfileImage");

    setUserData({
      name: storedName || "",
      email: localStorage.getItem("userEmail") || "",
      phone: storedPhone || "",
      location: storedLocation || "",
      image: null,
    });

    if (storedImage) {
      setPreview(storedImage);
    }
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      localStorage.setItem("userProfileImage", reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // ⭐ UPDATED: string ID pass karne ke liye Number() remove kiya
      const userId = localStorage.getItem("userId");

      const response = await axios.put("http://localhost:3000/update-profile", {
        userId,
        name: userData.name,
        phone: userData.phone,
        location: userData.location,
      });

      if (response.status === 200) {
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userPhone", userData.phone);
        localStorage.setItem("userLocation", userData.location);

        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-gradient px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2
          className="text-3xl font-bold text-center mb-6 
          bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
          bg-clip-text text-transparent"
        >
          My Profile
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden shadow-lg">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No Image
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4 text-sm"
          />
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Name"
            className="input-style"
          />
          <input
            type="email"
            value={userData.name}
            disabled
            className="input-style bg-gray-100 cursor-not-allowed"
          />{" "}
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input-style"
          />
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
            placeholder="Location"
            className="input-style"
          />
          <button onClick={handleSave} className="btn-primary w-full">
            Save Changes
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
