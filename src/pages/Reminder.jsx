import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Reminder({ student, onLogout }) {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    type: "ASSIGNMENT",
    dueDate: "",
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🔹 Fetch reminders from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/reminders/getAll")
        .then((res) => res.json())
        .then((data) => setReminders(data))
        .catch((err) => console.error("Error fetching reminders:", err));
  }, []);

  // 🔹 Add new reminder
  const addReminder = () => {
    if (!newReminder.title || !newReminder.dueDate) {
      alert("❌ Please fill in required fields.");
      return;
    }

    fetch("http://localhost:8080/api/reminders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReminder),
    })
        .then((res) => res.json())
        .then((data) => {
          setReminders([...reminders, data]);
          setIsAddingReminder(false);
          setNewReminder({ title: "", description: "", type: "ASSIGNMENT", dueDate: "" });
          alert("✅ Reminder added!");
        })
        .catch((err) => console.error("Error adding reminder:", err));
  };

  // 🔹 Delete reminder
  const deleteReminder = (id) => {
    fetch(`http://localhost:8080/api/reminders/${id}`, { method: "DELETE" })
        .then(() => {
          setReminders(reminders.filter((r) => r.reminderId !== id));
          alert("✅ Reminder deleted!");
        })
        .catch((err) => console.error("Error deleting reminder:", err));
  };

  const getCountdown = (dueDate) => {
    const diff = new Date(dueDate) - currentTime;
    if (diff < 0) return { days: 0, hours: 0, minutes: 0, overdue: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes, overdue: false };
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <button onClick={() => navigate("/studentDashboard")} className="btn btn-outline-secondary">⬅ Back</button>
          <button className="btn btn-primary" onClick={() => setIsAddingReminder(true)}>➕ Add Reminder</button>
        </div>

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
                  <td>{countdown.overdue ? "⌛ Overdue" : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteReminder(r.reminderId)}>🗑 Delete</button>
                  </td>
                </tr>
            );
          })}
          </tbody>
        </table>

        {isAddingReminder && (
            <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content p-3">
                  <h5>Add Reminder</h5>
                  <input type="text" className="form-control mb-2" placeholder="Title"
                         value={newReminder.title}
                         onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  />
                  <textarea className="form-control mb-2" placeholder="Description"
                            value={newReminder.description}
                            onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  />
                  <select className="form-select mb-2"
                          value={newReminder.type}
                          onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                  >
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="SUBMISSION">Submission</option>
                    <option value="EXAM">Exam</option>
                  </select>
                  <input type="datetime-local" className="form-control mb-2"
                         value={newReminder.dueDate}
                         onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary" onClick={() => setIsAddingReminder(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={addReminder}>Add</button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
