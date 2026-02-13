import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import addLogo from "../../assets/add.png";
import chatLogo from "../../assets/chat.png";
import historyLogo from "../../assets/history.png";
import userLogo from "../../assets/user.png";
import homeLogo from "../../assets/home.png";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [workers, setWorkers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSearch = async (value) => {
    setSearch(value);
    setShowSuggestions(true);

    const location = localStorage.getItem("userLocation");

    if (!value) {
      setWorkers([]);
      setRecommendations([]);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get("http://localhost:3000/search-workers", {
        params: {
          skill: value,
          location: location,
        },
      });

      setWorkers(response.data);
      setRecommendations(response.data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error("Search error:", error);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col app-gradient text-white">
      {/* HEADER */}
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-bold mb-6">Welcome 👋</h1>

        {/* Search Bar */}
        <div className="relative bg-white rounded-xl shadow-lg p-2">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search services (plumber, electrician...)"
            className="w-full px-4 py-2 text-gray-700 rounded-xl focus:outline-none"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && recommendations.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-xl mt-2 z-50">
              {recommendations.map((worker) => (
                <div
                  key={worker._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  {worker.Name} – {worker.Skills[0]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow px-6 mt-8">
        {/* Loading */}
        {loading && (
          <p className="text-center text-white">Searching workers...</p>
        )}

        {/* Worker Results */}
        {workers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Workers</h2>

            <div className="space-y-4">
              {workers.map((worker) => (
                <div
                  key={worker._id}
                  className="bg-white text-gray-800 rounded-xl shadow-lg p-4"
                >
                  <h3 className="font-semibold text-lg">{worker.Name}</h3>
                  <p className="text-gray-600">
                    Skills: {worker.Skills.join(", ")}
                  </p>
                  <p className="text-gray-600">Phone: {worker.Phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && search && workers.length === 0 && (
          <p className="text-center mt-6">No workers found in your location.</p>
        )}

        {/* Default Card */}
        {!search && (
          <div className="flex justify-center mt-12">
            <Link to="/register/client/Upload" className="w-full max-w-sm">
              <div className="bg-white text-gray-800 rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition duration-300 cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <img
                    src={addLogo}
                    alt="Add"
                    className="w-10 h-10 object-contain"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-2">Post a Problem</h2>

                <p className="text-gray-600 text-sm">
                  Describe your issue and connect with skilled workers
                  instantly.
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="bg-white shadow-2xl rounded-t-3xl py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center text-blue-600">
            <img src={homeLogo} alt="Home" className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </div>

          {/* ✅ Replaced static chat block with Link to /chat-list */}
          <Link to="/chat-list">
            <div className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
              <img src={chatLogo} alt="Chat" className="w-6 h-6 mb-1" />
              <span className="text-xs">Chat</span>
            </div>
          </Link>
          <Link to="/history">
            <div className="flex flex-col items-center text-gray-600">
              <img src={historyLogo} alt="History" className="w-6 h-6 mb-1" />
              <span className="text-xs">History</span>
            </div>
          </Link>

          <Link to="/profile">
            <div className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
              <img src={userLogo} alt="Profile" className="w-6 h-6 mb-1" />
              <span className="text-xs">Profile</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
