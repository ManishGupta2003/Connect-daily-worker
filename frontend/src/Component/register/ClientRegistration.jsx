import React, { useState } from "react";
import axios from "axios";

const ClientRegistration = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Password: "",
    Location: "",
  });

  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (phone) => {
    // Example validation: phone number should be 10 digits long
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
        formData
      );
      console.log(response.data);
      alert("Customer data submitted successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-custom-gradient p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent shadow-sm">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="Phone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.Phone && (
              <p className="text-red-500 text-xs italic">{errors.Phone}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              placeholder="Location"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
