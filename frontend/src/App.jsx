import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Component/Login/login";
import RegistrationOptions from "./Component/register/RegistrationOptions";
import WorkerRegistration from "./Component/register/WorkerRegistration";
import ClientRegistration from "./Component/register/ClientRegistration";
import HomePage from "./Component/homePage/homePage";
import WorkerHomePage from "./Component/homePage/WorkerHome";
import UploadPage from "./Component/Upload/UploadImage";
import Profile from "./Component/Profile/Profile";
import Chat from "./Component/Chat/Chat";
import ChatList from "./Component/Chat/ChatList";

import History from "./Component/History/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegistrationOptions />} />
        <Route path="/register/worker" element={<WorkerRegistration />} />
        <Route path="/register/client" element={<ClientRegistration />} />
        <Route path="/register/client/Upload" element={<UploadPage />} />
        <Route path="/worker-homepage" element={<WorkerHomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat-list" element={<ChatList />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
