import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import api from "../api.tsx";

function Register() {
  const navigate = useNavigate(); // Add this
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const role = "Consumer";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/register", { name, email, password, role });
      
      // Update this line to match the login pattern
      // Check both possible token locations
      const token = response.data.autorisations?.token || response.data.token;
      
      // Save token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      
      // Also save user data like in login
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      // Navigate with registration flag
      navigate("/home", { 
        state: { 
          fromRegistration: true
        } 
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F9F3F0]">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg border border-[#F9F3F0]">
        <h2 className="text-2xl font-semibold mb-6 text-[#02615E]">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#02615E]">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#02615E] bg-[#F9F3F0]/30"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#02615E]">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#02615E] bg-[#F9F3F0]/30"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#02615E]">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#02615E] bg-[#F9F3F0]/30"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#02615E] text-white py-2 px-4 rounded-md hover:bg-[#037d78] transition-all shadow-md"
          >
            Register
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account? <Link to="/login" className="text-[#02615E] hover:underline">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;