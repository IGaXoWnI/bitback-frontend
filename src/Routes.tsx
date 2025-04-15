import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import WelcomePage from "./pages/welcomePage";
import HomePage from "./pages/Home";
import DetailPage from "./pages/detailPage";
import LocationMap from "./components/LocationMap";
import PartnerSignupPage from "./pages/partnerSignupPage";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} /> {/* Home route */}
      <Route path="/login" element={<LoginPage />} /> {/* Login route */}
      <Route path="/register" element={<RegisterPage />} /> {/* Register route */}
      <Route path="/home" element={<HomePage />} /> {/* Home route */}
      <Route path="/item/:id" element={<DetailPage />} />
      <Route path="/map" element={<LocationMap />} />
      <Route path="/partner-signup" element={<PartnerSignupPage />} /> {/* Fallback route */}
    </Routes>
  );
};

export default AppRoutes;