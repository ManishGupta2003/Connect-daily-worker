import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const url =
          role === "client"
            ? `http://localhost:3000/client-history/${userId}`
            : `http://localhost:3000/worker-history/${userId}`;

        const res = await axios.get(url);
        setJobs(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const giveRating = async (problemId, value) => {
    try {
      await axios.put(`http://localhost:3000/rate/${problemId}`, {
        rating: value,
      });

      setJobs((prev) =>
        prev.map((job) =>
          job._id === problemId
            ? { ...job, rating: value, status: "completed" }
            : job,
        ),
      );
    } catch (err) {
      alert("Rating already submitted");
    }
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "assigned") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen app-gradient text-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Work History</h1>

      {loading ? (
        <p className="text-center">Loading history...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-300">No history found.</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white text-gray-800 rounded-2xl shadow-xl p-5"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{job.Problem}</h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(
                    job.status,
                  )}`}
                >
                  {job.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Type: {job.ProblemType}
              </p>

              {/* IMAGE */}
              {job.imageBase64 && (
                <img
                  src={`data:${job.contentType};base64,${job.imageBase64}`}
                  alt="problem"
                  className="w-full h-40 object-cover rounded-xl mt-3"
                />
              )}

              {/* RATING SECTION */}
              <div className="mt-4">
                {job.rating !== null ? (
                  <p className="text-yellow-500 font-semibold">
                    ⭐ Rating: {job.rating}/5
                  </p>
                ) : (
                  role === "client" &&
                  job.status === "assigned" && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Rate Worker:
                      </span>

                      <select
                        onChange={(e) =>
                          giveRating(job._id, Number(e.target.value))
                        }
                        className="border rounded px-2 py-1 text-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="1">⭐ 1</option>
                        <option value="2">⭐ 2</option>
                        <option value="3">⭐ 3</option>
                        <option value="4">⭐ 4</option>
                        <option value="5">⭐ 5</option>
                      </select>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
