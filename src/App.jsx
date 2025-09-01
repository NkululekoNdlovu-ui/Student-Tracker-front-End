import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import Subject from "./pages/Subject";
import Reminder from "./pages/Reminder";
import AdminDashBoard from "./pages/AdminDashBoard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/subject" element={<Subject />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/admindashboard" element={<AdminDashBoard />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
