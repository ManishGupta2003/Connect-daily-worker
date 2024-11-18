import React from "react";
import { Link } from "react-router-dom";

const RegistrationOptions = () => {
  return (
    <div className="flex items-center justify-center h-screen custom-gradient p-8 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent shadow-sm">
          Choose Registration Type
        </h2>
        <div className="mb-4">
          <Link to="/register/worker">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full">
              Register as Worker
            </button>
          </Link>
        </div>
        <div className="mb-4">
          <Link to="/register/client">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
              Register as Client
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationOptions;
