import React, { useState, useEffect } from "react";
import axios from "axios";
import homeLogo from "../../assets/home.png";
import chatLogo from "../../assets/chat.png";
import historyLogo from "../../assets/history.png";
import userLogo from "../../assets/user.png";

const WorkerHome = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // Retrieve worker's skills and location from localStorage
        const skillsString = localStorage.getItem("userSkills");
        const location = localStorage.getItem("userLocation");

        if (!skillsString || !location) {
          setError("Worker skills or location not found in localStorage");
          return;
        }

        // Parse skills from JSON string
        const skills = JSON.parse(skillsString);

        // Make a request to fetch problems
        const response = await axios.get("http://localhost:3000/search", {
          params: {
            location: location,
            // Consider adding skills if required by your backend
            skills: skills.join(","), // Example format, adjust if needed
          },
        });

        // Check if the response is in the expected format
        if (Array.isArray(response.data)) {
          // Filter problems to include only those that match worker's skills
          const filteredProblems = response.data.filter((problem) =>
            skills.includes(problem.ProblemType)
          );

          // Update state with the filtered problems
          setProblems(filteredProblems);
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setError(
          "Failed to fetch problems. Please check the console for more details."
        );
      }
    };

    fetchProblems();
  }, []);

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
        {error && <p className="text-red-500">{error}</p>}
        {problems.length === 0 ? (
          <p>No problems found</p>
        ) : (
          <ul className="w-full space-y-4">
            {problems.map((problem) => (
              <li
                key={problem._id}
                className="border border-gray-300 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <img
                    src={`data:${problem.contentType};base64,${problem.imageBase64}`}
                    alt={problem.filename}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold">{problem.Problem}</h2>
                    <p className="text-gray-700">{problem.ProblemType}</p>
                    <p className="text-gray-600">
                      Contact: {problem.CustomerPhone}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-8 px-8 rounded-lg shadow-xl mx-[100px] sticky bottom-5">
        <div className="flex justify-evenly items-center">
          <div className="icon bg-blue-500 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
            <img
              src={homeLogo}
              alt="Home Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="icon w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
            <img
              src={chatLogo}
              alt="Chat Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="icon w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl cursor-pointer hover:bg-red-600 transition-colors shadow-lg">
            <img
              src={historyLogo}
              alt="History Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="icon bg-gray-600 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-2xl cursor-pointer hover:bg-gray-700 transition-colors shadow-lg">
            <img
              src={userLogo}
              alt="User Icon"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkerHome;
