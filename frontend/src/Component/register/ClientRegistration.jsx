import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Password: "",
    Location: "",
  });

  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();

    const phoneValid = validatePhoneNumber(formData.Phone);

    if (!phoneValid) {
      setErrors({ Phone: "Phone number must be 10 digits long" });
      return;
    } else {
      setErrors({});
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/customer",
        formData,
      );

      if (response.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen custom-gradient p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Register Customer
        </h1>

        <form onSubmit={handleCustomerSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
            {errors.Phone && (
              <p className="text-red-500 text-xs mt-1">{errors.Phone}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              placeholder="Location"
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Register Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientRegistration;
