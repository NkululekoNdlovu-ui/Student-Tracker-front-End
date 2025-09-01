import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("students");
  const [error, setError] = useState({
    students: null,
    subjects: null,
    reminders: null,
  });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // For real UI, consider react-toastify
  };

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true);
    setError({ students: null, subjects: null, reminders: null });

    try {
      const [studentsRes, subjectsRes, remindersRes] = await Promise.all([
        axios.get("http://localhost:8080/api/students/getAll"),
        axios.get("http://localhost:8080/api/subjects"),
        axios.get("http://localhost:8080/api/reminders"),
      ]);

      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
      setReminders(remindersRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError({
        students: err.response?.data?.message || "Failed to load students",
        subjects: err.response?.data?.message || "Failed to load subjects",
        reminders: err.response?.data?.message || "Failed to load reminders",
      });
      showToast("Failed to fetch data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete student
  const deleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/students/${studentId}`);
      setStudents((prev) =>
        prev.filter((student) => student.student_id !== studentId)
      );
      showToast("Student deleted successfully");
    } catch (err) {
      console.error("Error deleting student:", err);
      showToast("Failed to delete student: " + err.message, "error");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const StatCard = ({ title, value, subtitle, iconName }) => {
    const iconMap = { users: "👥", book: "📚", bell: "🔔", trend: "📈" };
    return (
      <div className="col-lg-3 col-md-6 mb-4">
        <div
          className="card border-0 h-100"
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center">
              <div
                className="p-2 rounded"
                style={{ backgroundColor: "#eff6ff" }}
              >
                <div className="d-inline-flex align-items-center justify-content-center">
                  {iconMap[iconName] || "📊"}
                </div>
              </div>
              <div className="ms-3">
                <h6 className="text-muted mb-0 small">{title}</h6>
                <h4 className="mb-0 fw-bold text-dark">
                  {value !== null
                    ? typeof value === "number"
                      ? value.toLocaleString()
                      : value
                    : "--"}
                </h4>
                <small className="text-muted">{subtitle}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <div className="border-bottom bg-white shadow-sm">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontSize: "20px" }}>🎓</span>
              </div>
              <div>
                <h5 className="mb-0 text-dark fw-semibold">Admin Dashboard</h5>
                <small className="text-muted">Student Management System</small>
              </div>
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={handleLogout}
              style={{ borderRadius: "8px" }}
            >
              <span className="me-2" style={{ fontSize: "14px" }}>
                🚪
              </span>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        {/* Statistics Cards */}
        <div className="row mb-4">
          <StatCard
            title="Active Students"
            value={students.length}
            subtitle="Registered students"
            iconName="users"
          />
          <StatCard
            title="Total Subjects"
            value={subjects.length}
            subtitle="Enrolled subjects"
            iconName="book"
          />
          <StatCard
            title="Active Reminders"
            value={reminders.filter(
              (r) => new Date(r.due_date) > new Date()
            ).length}
            subtitle="Upcoming deadlines"
            iconName="bell"
          />
          <StatCard
            title="Average Performance"
            value={`${
              subjects.length > 0
                ? Math.round(
                    subjects.reduce((acc, subject) => {
                      const avg =
                        (subject.term1 +
                          subject.term2 +
                          subject.term3 +
                          subject.term4) /
                        4;
                      return acc + avg;
                    }, 0) / subjects.length
                  )
                : 0
            }%`}
            subtitle="Overall grade average"
            iconName="trend"
          />
        </div>

        {/* Action Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="card border-0"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <span style={{ fontSize: "18px" }} className="me-2">
                    🗃️
                  </span>
                  <h6 className="mb-0 fw-semibold">Data Management</h6>
                </div>
                <p className="text-muted small mb-3">
                  Load and manage all system data
                </p>
                <button
                  className={`btn btn-primary ${isLoading ? "disabled" : ""}`}
                  onClick={fetchAllData}
                  disabled={isLoading}
                  style={{ borderRadius: "8px", padding: "12px 24px" }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Loading All Data...
                    </>
                  ) : (
                    <>
                      <span className="me-2" style={{ fontSize: "16px" }}>
                        🗃️
                      </span>
                      Load All Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {(error.students || error.subjects || error.reminders) && (
          <div
            className="alert alert-danger border-0 mb-4"
            style={{
              borderRadius: "12px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
            }}
          >
            <strong>Unable to load data:</strong>{" "}
            {error.students || error.subjects || error.reminders}
          </div>
        )}

        {/* Data Tables */}
        {(students.length > 0 || subjects.length > 0 || reminders.length > 0) ? (
          <div
            className="card border-0"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="card-header bg-white border-bottom"
              style={{ borderRadius: "12px 12px 0 0" }}
            >
              <ul className="nav nav-tabs card-header-tabs border-0">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "students" ? "active" : ""
                    } border-0`}
                    onClick={() => setActiveTab("students")}
                    style={{ borderRadius: "8px 8px 0 0" }}
                  >
                    <span style={{ fontSize: "16px" }} className="me-2">
                      👥
                    </span>
                    Students ({students.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "subjects" ? "active" : ""
                    } border-0`}
                    onClick={() => setActiveTab("subjects")}
                    style={{ borderRadius: "8px 8px 0 0" }}
                  >
                    <span style={{ fontSize: "16px" }} className="me-2">
                      📚
                    </span>
                    Subjects ({subjects.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "reminders" ? "active" : ""
                    } border-0`}
                    onClick={() => setActiveTab("reminders")}
                    style={{ borderRadius: "8px 8px 0 0" }}
                  >
                    <span style={{ fontSize: "16px" }} className="me-2">
                      🔔
                    </span>
                    Reminders ({reminders.length})
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body p-0">
              {/* Students Tab */}
              {activeTab === "students" && (
                <div className="p-4">
                  {students.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Course</th>
                            <th>Year Level</th>
                            <th>Registered</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.student_id}>
                              <td>{student.student_id}</td>
                              <td>
                                {student.first_name} {student.last_name}
                              </td>
                              <td className="text-muted">{student.email}</td>
                              <td>{student.course || "Not specified"}</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {student.year_level || "Not specified"}
                                </span>
                              </td>
                              <td className="text-muted">
                                {new Date(student.created_at).toLocaleDateString()}
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() =>
                                    deleteStudent(student.student_id)
                                  }
                                >
                                  🗑️ Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <span className="text-muted mb-3 d-block" style={{ fontSize: "48px" }}>
                        👥
                      </span>
                      <h6 className="text-muted">No students data available</h6>
                      <p className="text-muted small mb-0">
                        Load data to see students information
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Subjects Tab */}
              {activeTab === "subjects" && (
                <div className="p-4">
                  {subjects.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Subject Name</th>
                            <th>Student</th>
                            <th>Term 1</th>
                            <th>Term 2</th>
                            <th>Term 3</th>
                            <th>Term 4</th>
                            <th>Average</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((subject) => {
                            const avg = (
                              (subject.term1 +
                                subject.term2 +
                                subject.term3 +
                                subject.term4) /
                              4
                            ).toFixed(1);
                            return (
                              <tr key={subject.id}>
                                <td>{subject.name}</td>
                                <td>
                                  {subject.students?.first_name}{" "}
                                  {subject.students?.last_name}
                                </td>
                                <td>{subject.term1}%</td>
                                <td>{subject.term2}%</td>
                                <td>{subject.term3}%</td>
                                <td>{subject.term4}%</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      avg >= 50 ? "bg-success" : "bg-danger"
                                    }`}
                                  >
                                    {avg}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <span className="text-muted mb-3 d-block" style={{ fontSize: "48px" }}>
                        📚
                      </span>
                      <h6 className="text-muted">No subjects data available</h6>
                    </div>
                  )}
                </div>
              )}

              {/* Reminders Tab */}
              {activeTab === "reminders" && (
                <div className="p-4">
                  {reminders.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Title</th>
                            <th>Student</th>
                            <th>Type</th>
                            <th>Due Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reminders.map((reminder) => {
                            const dueDate = new Date(reminder.due_date);
                            const isOverdue = dueDate < new Date();
                            return (
                              <tr key={reminder.id}>
                                <td>{reminder.title}</td>
                                <td>
                                  {reminder.students?.first_name}{" "}
                                  {reminder.students?.last_name}
                                </td>
                                <td>{reminder.type}</td>
                                <td>{dueDate.toLocaleDateString()}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      isOverdue ? "bg-danger" : "bg-success"
                                    }`}
                                  >
                                    {isOverdue ? "Overdue" : "Active"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <span className="text-muted mb-3 d-block" style={{ fontSize: "48px" }}>
                        🔔
                      </span>
                      <h6 className="text-muted">No reminders data available</h6>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <span style={{ fontSize: "32px" }}>🗃️</span>
            <h5>No Data Loaded</h5>
            <p>Click "Load All Data" to fetch students, subjects, and reminders.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
