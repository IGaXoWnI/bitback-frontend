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


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} /> 
      <Route path="/login" element={<LoginPage />} /> 
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/home" element={<HomePage />} /> 
      <Route path="/item/:id" element={<DetailPage />} />

      <Route path="/partner-signup" element={<PartnerSignupPage />} /> 
      <Route path="/merchant" element={<MerchantDashboard />} /> 
      <Route path="/admin" element={<AdminDashboard />} /> 
      <Route path="/reservations" element={<MyReservations />} />
      <Route path="/reclamations" element={<MyReclamations />} />
    </Routes>
  );
};

export default AppRoutes;