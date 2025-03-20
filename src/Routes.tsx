import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./components/register";
import LoginPage from "./components/login";
import HomePage from "./components/homePage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Home route */}
      <Route path="/login" element={<LoginPage />} /> {/* Login route */}
      <Route path="/register" element={<RegisterPage />} /> {/* Register route */}
    </Routes>
  );
};

export default AppRoutes;