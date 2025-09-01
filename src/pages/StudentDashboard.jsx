// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentData, setStudentData] = useState(location.state?.student || null);
  const [loading, setLoading] = useState(!studentData);

  useEffect(() => {
    if (!studentData) {
      axios.get("http://localhost:8080/student/current")
        .then(response => {
          setStudentData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching student data:", error);
          setLoading(false);
        });
    }
  }, [studentData]);

  const handleLogout = () => {
    axios.post("http://localhost:8080/student/logout")
      .finally(() => navigate("/"));
  };

  if (loading) return <p className="text-center mt-5">Loading student data...</p>;
  if (!studentData) return <p className="text-center mt-5 text-danger">Failed to load student data.</p>;

  return (
    <div className="bg-gradient-subtle">
      <header className="header-blur py-3 sticky-top">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 d-flex align-items-center">
              <div className="icon-container me-3">📖</div>
              <div>
                <h1 className="h3 mb-0 fw-bold">Student Tracker</h1>
                <small className="text-muted">Academic Progress Dashboard</small>
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-end gap-2">
              <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/subject')}>📊 Subjects</button>
              <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/reminder')}>⏰ Reminders</button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>🔓 Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid py-4">
        {/* Student Profile */}
        <div className="card card-glassmorphism mb-4 border-0 shadow">
          <div className="card-header bg-transparent border-0">
            <h5 className="card-title mb-0">👤 Student Profile</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label text-muted small fw-medium">Full Name</label>
                <p className="h6 mb-0">{studentData.firstName} {studentData.lastName}</p>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label text-muted small fw-medium">Email</label>
                <p className="h6 mb-0">{studentData.email}</p>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label text-muted small fw-medium">Course</label>
                <p className="h6 mb-0">{studentData.course}</p>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label text-muted small fw-medium">Year Level</label>
                <span className="badge bg-secondary">{studentData.yearLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card card-glassmorphism border-0 shadow hover-lift h-100 text-center p-4"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/subject')}
            >
              <div className="icon-container mb-3">📊</div>
              <h4 className="fw-bold mb-2">Subject Calculations</h4>
              <p className="text-muted">
                Manage your subjects and calculate term percentages based on tests, assignments, and exams.
              </p>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card card-glassmorphism border-0 shadow hover-lift h-100 text-center p-4"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/reminder')}
            >
              <div className="icon-container mb-3">⏰</div>
              <h4 className="fw-bold mb-2">Reminders & Due Dates</h4>
              <p className="text-muted">
                Track assignment deadlines, exam dates, and submission due dates with countdown timers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
