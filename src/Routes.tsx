import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import WelcomePage from "./pages/welcomePage";
import HomePage from "./pages/Home";
import DetailPage from "./pages/detailPage";
import PartnerSignupPage from "./pages/partnerSignupPage";
import MerchantDashboard from "./pages/MerchantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyReservations from "./pages/MyReservations";
import MyReclamations from "./pages/MyReclamations";
import MyReports from "./pages/MyReports";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} /> {/* Home route */}
      <Route path="/login" element={<LoginPage />} /> {/* Login route */}
      <Route path="/register" element={<RegisterPage />} /> {/* Register route */}
      <Route path="/home" element={<HomePage />} /> {/* Home route */}
      <Route path="/item/:id" element={<DetailPage />} />

      <Route path="/partner-signup" element={<PartnerSignupPage />} /> {/* Fallback route */}
      <Route path="/merchant" element={<MerchantDashboard />} /> {/* Fallback route */}
      <Route path="/admin" element={<AdminDashboard />} /> {/* Fallback route */}
      <Route path="/reservations" element={<MyReservations />} />
      <Route path="/reclamations" element={<MyReclamations />} />
    </Routes>
  );
};

export default AppRoutes;