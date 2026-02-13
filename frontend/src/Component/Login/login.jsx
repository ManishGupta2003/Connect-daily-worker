import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:3000/login", {
        Email: email,
        Password: password,
      });

      if (response.status === 200) {
        // 1. Backend se 'userRole' ko bhi extract karein
        const {
          userId,
          userName,
          userPhone,
          userLocation,
          userSkills,
          userRole,
        } = response.data;

        const skillsArray = Array.isArray(userSkills) ? userSkills : [];

        // 2. Data store karein
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", userRole); // Future use ke liye kaam ayega
        localStorage.setItem("userName", userName);
        localStorage.setItem("userPhone", userPhone);
        localStorage.setItem("userLocation", userLocation);
        localStorage.setItem("userSkills", JSON.stringify(skillsArray));

        // 3. Sahi Logic: userRole (0 ya 1) check karein, userId nahi
        if (userRole === "worker") {
          navigate("/worker-homepage");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-gradient px-4">
      <div className="card-style w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="input-style"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="input-style"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
