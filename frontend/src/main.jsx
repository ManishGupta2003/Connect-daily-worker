import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import RegistrationForm from "./App.jsx";
//import Login from "./Component/Login/login";
//import ImageUpload from "./Component/UploadImage";
//import CurrentLocation from "./Component/location";
//import LeafletMap from "./Component/createlocation/createLocation";
//import HomePage from "./homePage";
//import SearchWorkers from "./Component/SearchWorkers.jsx";
//import ClientRegistration from "./Component/register/ClientRegistration";
//import WorkerRegistration from "./Component/register/WorkerRegistration";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
