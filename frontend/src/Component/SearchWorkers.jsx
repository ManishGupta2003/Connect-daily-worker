import React, { useState } from "react";
import axios from "axios";

const SearchWorkers = () => {
  const [skill, setSkill] = useState("");
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:3000/search", {
        params: { skill },
      });
      setWorkers(response.data);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Error fetching workers");
      setWorkers([]);
    }
  };

  return (
    <div>
      <h1>Search Workers by Skill</h1>
      <input
        type="text"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="Enter skill"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      <ul>
        {workers.map((worker) => (
          <li key={worker._id}>
            {worker.Name} - {worker.skill} -{worker.Phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchWorkers;
