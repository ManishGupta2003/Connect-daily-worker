import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate import
import homeLogo from "../../assets/home.png";
import chatLogo from "../../assets/chat.png";
import historyLogo from "../../assets/history.png";
import userLogo from "../../assets/user.png";

const WorkerHome = () => {
  const navigate = useNavigate(); // ✅ Initialized navigate
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const skillsString = localStorage.getItem("userSkills");
        const location = localStorage.getItem("userLocation");

        if (!skillsString || !location) {
          setError("Worker skills or location not found");
          return;
        }

        const skills = JSON.parse(skillsString);

        const response = await axios.get("http://localhost:3000/search", {
          params: {
            location: location,
            skills: skills.join(","),
          },
        });

        if (Array.isArray(response.data)) {
          const filteredProblems = response.data.filter((problem) =>
            skills.includes(problem.ProblemType),
          );

          setProblems(filteredProblems);
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setError("Failed to fetch problems");
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen flex flex-col app-gradient text-white">
      {/* HEADER */}
      <div className="px-6 pt-8">
        <h1 className="text-3xl font-bold mb-6">Worker Dashboard 👷‍♂️</h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow px-6">
        {error && <p className="text-red-400 text-center">{error}</p>}

        {problems.length === 0 ? (
          <p className="text-center mt-10">
            No problems available in your location.
          </p>
        ) : (
          <div className="space-y-6">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="bg-white text-gray-800 rounded-2xl shadow-xl p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`data:${problem.contentType};base64,${problem.imageBase64}`}
                    alt={problem.filename}
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{problem.Problem}</h2>
                    <p className="text-gray-600">Type: {problem.ProblemType}</p>
                    <p className="text-gray-600">
                      Contact: {problem.CustomerPhone}
                    </p>

                    {/* ✅ Added Chat Button */}
                    <button
                      onClick={() =>
                        navigate("/chat", {
                          state: {
                            problemId: problem._id,
                            problemTitle: problem.Problem,
                            receiverMongoId: problem.customerMongoId,
                          },
                        })
                      }
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                    >
                      Chat with Client
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="bg-white shadow-2xl rounded-t-3xl py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center text-blue-600 cursor-pointer">
            <img src={homeLogo} alt="Home" className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </div>

          {/* ✅ Replaced static chat block with Link */}
          <Link to="/chat-list">
            <div className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition">
              <img src={chatLogo} alt="Chat" className="w-6 h-6 mb-1" />
              <span className="text-xs">Chat</span>
            </div>
          </Link>
          <Link to="/history">
            <div className="flex flex-col items-center text-gray-600 cursor-pointer">
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

export default WorkerHome;
