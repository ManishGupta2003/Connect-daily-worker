import React, { useState } from "react";
import axios from "axios";

const UploadPage = () => {
  const [problem, setProblem] = useState("");
  const [problemType, setProblemType] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Retrieve customer phone number and location from localStorage
  const customerPhone = localStorage.getItem("userPhone");
  const customerLocation = localStorage.getItem("userLocation");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!customerPhone || !customerLocation) {
      setMessage("Customer phone number or location is not available.");
      return;
    }

    const formData = new FormData();
    formData.append("Problem", problem);
    formData.append("ProblemType", problemType);
    formData.append("CustomerPhone", customerPhone);
    formData.append("CustomerLocation", customerLocation); // Add CustomerLocation
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setMessage("Problem and image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading problem and image:", error);
      setMessage("Failed to upload problem and image");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <h2 className="text-3xl font-bold mb-6">Upload Problem</h2>
      <form onSubmit={handleUpload} className="w-full max-w-md">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Problem Description"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Problem Type"
            value={problemType}
            onChange={(e) => setProblemType(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Upload
        </button>
      </form>
      {message && <p className="text-center text-gray-600 mt-4">{message}</p>}
    </div>
  );
};

export default UploadPage;
