# 🚀 Connect Daily Worker

A MERN Stack based platform that connects **clients** with **daily workers** (plumber, electrician, painter, etc.) through real-time chat, job assignment, and rating system.

This project helps customers post their problems and allows nearby skilled workers to connect and solve them efficiently.

---

## 🎯 Project Objective  

The main goal of this project is to create a digital platform where:

- Clients can post problems with images.
- Workers can find jobs based on skills and location
- Both can communicate using real-time chat
- Clients can approve workers for a job
- Jobs move to history after completion
- Workers receive ratings from clients

---

## 🧠 Features

### 👤 Authentication & Roles
- Separate registration for **Client** and **Worker**
- Role-based login redirection
- Worker and Client dashboards

---

### 📦 Problem Upload (Client)
- Upload problem description
- Add problem type
- Upload image
- Location-based tracking

---

### 👷 Worker Dashboard
- Shows only relevant problems based on:
  - Skills
  - Location
- Open jobs only (assigned jobs hidden automatically)

---

### 💬 Real-Time Chat (Socket.io)
- Live messaging between client and worker
- Problem-based chat rooms
- Previous messages history
- Sender name shown in messages

---

### ✅ Worker Approval System
- Client can approve a worker from chat
- Job status changes:
  - `open → assigned → completed`
- Assigned job disappears from other workers’ home pages

---

### ⭐ Rating System
- Client gives rating (1–5) from History page
- Rating allowed only once
- Job marked as completed after rating

---

### 📜 History System
- Client History:
  - Assigned jobs
  - Completed jobs
  - Rating option

- Worker History:
  - Assigned jobs
  - Completed jobs

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- Socket.io

### Database
- MongoDB
- Mongoose

---

## ⚙️ Project Structure

Connect-daily-worker/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── server.js
│
├── frontend/
│ ├── src/
│ │ ├── Component/
│ │ │ ├── Chat/
│ │ │ ├── Profile/
│ │ │ ├── History/
│ │ │ └── homePage/
│
└── README.md

2️⃣ Backend Setup
cd backend
npm install
npm start

Install command:
npm install

Packages used:
npm install express
npm install mongoose
npm install cors
npm install multer
npm install socket.io

Backend runs on:

http://localhost:3000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Install command:
npm install

Packages used:
npm install react
npm install react-dom
npm install react-router-dom
npm install axios
npm install socket.io-client
npm install tailwindcss

Frontend runs on:

http://localhost:5173

4️⃣ Tailwind CSS Setup 
npm install tailwindcss @tailwindcss/vite



Backend me Express, MongoDB aur Socket.io use kiya hai. Frontend React + Tailwind CSS pe bana hai. Real-time chat ke liye socket.io-client use kiya gaya hai.
