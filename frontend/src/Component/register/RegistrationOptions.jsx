import React from "react";
import { Link } from "react-router-dom";

const RegistrationOptions = () => {
  return (
    <div className="min-h-screen flex items-center justify-center app-gradient px-4">
      <div className="card-style w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Choose Account Type
        </h2>

        <div className="flex flex-col gap-6">
          <Link to="/register/worker">
            <button className="btn-primary w-full">Register as Worker</button>
          </Link>

          <Link to="/register/client">
            <button
              className="w-full py-3 rounded-xl font-semibold text-white 
                               bg-green-600 hover:bg-green-700 
                               transition duration-300"
            >
              Register as Client
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationOptions;
