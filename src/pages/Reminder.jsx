import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addReminder, fetchReminders } from "../service/reminderService"; // <-- import fetchReminders

export default function Reminder({ student }) {
  const navigate = useNavigate();
  const location = useLocation();
  const stateStudent = location.state?.student;
  if (stateStudent && !student) {
    student = stateStudent;
  }
  const [reminders, setReminders] = useState([]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    type: "ASSIGNMENT",
    dueDate: "",
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch reminders from backend
  const fetchRemindersForStudent = async () => {
    setLoading(true);
    try {
      if (!student || !student.studentId) throw new Error("Student not found");
      const data = await fetchReminders(student.studentId); 
      setReminders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to load reminders.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemindersForStudent(); 
  }, [student]);

  // 🔹 Add new reminder
  // Add new reminder and check response
  const handleAddReminder = async () => {
    if (!newReminder.title || !newReminder.dueDate) {
      alert("❌ Please fill in required fields.");
      return;
    }
    try {
      // Attach student to reminder
      const reminderPayload = {
        ...newReminder,
        student: { studentId: student.studentId }
      };
      const response = await addReminder(reminderPayload);
      if (response.status === 201 || response.status === 200) {
        setIsAddingReminder(false);
        setNewReminder({ title: "", description: "", type: "ASSIGNMENT", dueDate: "" });
        alert("✅ Reminder added!");
        fetchRemindersForStudent(); // <-- now works
      } else {
        alert("❌ Failed to add reminder. Server error.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add reminder.");
    }
  };
  // 🔹 Delete reminder
  const deleteReminder = (id) => {
    fetch(`http://localhost:8080/api/reminders/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete reminder");
        setReminders(reminders.filter((r) => r.reminderId !== id));
        alert("✅ Reminder deleted!");
      })
      .catch((err) => console.error(err));
  };

  // 🔹 Countdown
  const getCountdown = (dueDate) => {
    const diff = new Date(dueDate) - currentTime;
    if (diff < 0) return { days: 0, hours: 0, minutes: 0, overdue: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes, overdue: false };
  };

  // 🔹 Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <button
          onClick={() => navigate("/studentDashboard", { state: { student } })} // <-- always pass student
          className="btn btn-outline-secondary"
        >
          ⬅ Back
        </button>
        <button className="btn btn-primary" onClick={() => setIsAddingReminder(true)}>
          ➕ Add Reminder
        </button>
      </div>

      {/* 🔹 Loading & Error */}
      {loading && <p>Loading reminders...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (!Array.isArray(reminders) || reminders.length === 0) && (
        <p>No reminders found.</p>
      )}

      {!loading && !error && Array.isArray(reminders) && reminders.length > 0 && (
        <table className="table table-striped">
          <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Due Date</th>
            <th>Countdown</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {reminders.map((r) => {
            const countdown = getCountdown(r.dueDate);
            return (
              <tr key={r.reminderId}>
                <td>{r.title}</td>
                <td>{r.type}</td>
                <td>{r.dueDate}</td>
                <td>
                  {countdown.overdue
                    ? "⌛ Overdue"
                    : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`}
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteReminder(r.reminderId)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      )}

      {/* 🔹 Add Reminder Modal */}
      {isAddingReminder && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Add Reminder</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Description"
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
              />
              <select
                className="form-select mb-2"
                value={newReminder.type}
                onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
              >
                <option value="ASSIGNMENT">Assignment</option>
                <option value="SUBMISSION">Submission</option>
                <option value="EXAM">Exam</option>
              </select>
              <input
                type="datetime-local"
                className="form-control mb-2"
                value={newReminder.dueDate}
                onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
              />
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setIsAddingReminder(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddReminder}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}