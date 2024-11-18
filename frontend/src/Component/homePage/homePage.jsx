import React from "react";
import { Link } from "react-router-dom";
import addLogo from "../../assets/add.png";
import chatLogo from "../../assets/chat.png";
import historyLogo from "../../assets/history.png";
import userLogo from "../../assets/user.png";
import homeLogo from "../../assets/home.png";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex justify-center mt-2">
        <div className="SearchBar flex w-64 h-12 bg-gray-100 border border-gray-300 rounded-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-full px-4 py-2 text-gray-700 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="uIcon flex items-center justify-center w-20 h-20 bg-blue-500 text-white text-3xl font-bold rounded-full">
          <Link to="/register/client/Upload">
            <img
              src={addLogo}
              alt="Add Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </Link>
        </div>
        <div className="uText mt-4 text-lg text-gray-800">
          Post your Problem
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 px-8 rounded-lg shadow-xl mx-[100px] sticky bottom-5">
        <div className="flex justify-evenly items-center">
          <div className="icon bg-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
            <img
              src={homeLogo}
              alt="Add Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="icon w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
            <img
              src={chatLogo}
              alt="Add Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="icon  w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl cursor-pointer hover:bg-red-600 transition-colors shadow-lg">
            <img
              src={historyLogo}
              alt="Add Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="icon bg-gray-600 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl cursor-pointer hover:bg-gray-700 transition-colors shadow-lg">
            <img
              src={userLogo}
              alt="Add Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
