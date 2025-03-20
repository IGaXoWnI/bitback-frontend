import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

export default api;