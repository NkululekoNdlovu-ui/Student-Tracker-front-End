// src/service/StudentService.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/students"; // replace with your backend URL

// Signup - create a new student
export const captureStudentDetails = async (studentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, studentData);
    return response; // should return status 201 if successful
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
};

// Login - authenticate student
export const authenticateUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response; // backend should return user info and success flag
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};
