import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const WorkerRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Password: "",
    Location: "",
    Skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();

    const skillsArray = formData.Skills.split(",").map((skill) => skill.trim());

    const data = {
      ...formData,
      Skills: skillsArray,
    };

    try {
      const response = await axios.post("http://localhost:3000/worker", data);

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
          Register Worker
        </h1>

        <form onSubmit={handleWorkerSubmit}>
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

          <div className="mb-4">
            <input
              type="text"
              name="Skills"
              value={formData.Skills}
              onChange={handleChange}
              placeholder="Skills (comma separated)"
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Register Worker
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkerRegistration;
