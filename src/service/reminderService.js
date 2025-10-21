import axios from "axios";

const BASE_URL = "http://localhost:8080/api/reminders";

export const fetchReminders = async (studentId) => {
    try {
        const response = await axios.get(`${BASE_URL}/student/${studentId}`);
        return response.data; 
    }
    catch (error) {
        console.error("Fetch reminders error:", error.response?.data || error.message);
        throw error;
    }
}

export const addReminder = async (reminderData) => {
    try {
        const response = await axios.post(`${BASE_URL}/add`, reminderData);
        return response; // should return status 201 if successful
    }
    catch (error) {
        console.error("Add reminder error:", error.response?.data || error.message);
        throw error;
    }
}

export const getAllReminders = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getAll`);
        return response.data; // should return an array of all reminders
    }
    catch (error) {
        console.error("Get all reminders error:", error.response?.data || error.message);
        throw error;
    }
}

