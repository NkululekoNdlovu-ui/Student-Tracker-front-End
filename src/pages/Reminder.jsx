import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- use real router navigation

export default function Reminder({ student, onLogout }) {
  const navigate = useNavigate(); // real navigation
  const [reminders, setReminders] = useState([
    {
      id: "1",
      subjectId: "1",
      subjectName: "Mathematics",
      type: "assignment",
      title: "Calculus Assignment 1",
      dueDate: "2024-08-25T15:00",
      description: "Complete exercises 1-20 from chapter 5"
    },
    {
      id: "2",
      subjectId: "2",
      subjectName: "Computer Science",
      type: "exam",
      title: "Midterm Examination",
      dueDate: "2024-08-30T10:00",
      description: "Covers algorithms and data structures"
    }
  ]);

  const [subjects] = useState([
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Computer Science" },
    { id: "3", name: "Physics" }
  ]);

  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    subjectId: '',
    type: 'assignment',
    title: '',
    dueDate: '',
    description: ''
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const studentData = student || {
    id: "demo",
    first_name: "Demo",
    last_name: "Student",
    email: "demo@student.com",
    course: "Computer Science",
    year_level: "Third Year"
  };

  const handleLogout = onLogout || (() => {
    alert("Logout functionality not configured");
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addReminder = () => {
    if (!newReminder.subjectId || !newReminder.title || !newReminder.dueDate) {
      alert("❌ ERROR: Please fill in all required fields.");
      return;
    }

    const subject = subjects.find(s => s.id === newReminder.subjectId);
    const reminderObj = {
      id: Date.now().toString(),
      subjectId: newReminder.subjectId,
      subjectName: subject?.name || 'Unknown Subject',
      type: newReminder.type,
      title: newReminder.title,
      dueDate: newReminder.dueDate,
      description: newReminder.description
    };

    setReminders([...reminders, reminderObj]);
    setNewReminder({ subjectId: '', type: 'assignment', title: '', dueDate: '', description: '' });
    setIsAddingReminder(false);
    alert(`✅ SUCCESS: Reminder "${newReminder.title}" added.`);
  };

  const getCountdown = (dueDate) => {
    const diff = new Date(dueDate) - currentTime;
    if (diff < 0) return { days: 0, hours: 0, minutes: 0, overdue: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes, overdue: false };
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
    alert("✅ SUCCESS: Reminder deleted successfully.");
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'dueDate') cmp = new Date(a.dueDate) - new Date(b.dueDate);
    else cmp = a[sortBy].localeCompare(b[sortBy]);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const getTypeEmoji = (type) => {
    switch (type) {
      case 'assignment': return '📚';
      case 'submission': return '📝';
      case 'exam': return '🧪';
      default: return '⏰';
    }
  };

  return (
    <div className="min-vh-100 p-3" style={{ backgroundColor: '#f8fafc' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button onClick={() => navigate('/')} className="btn btn-outline-secondary btn-sm me-2">⬅ Back</button>
          <span>Reminders</span>
        </div>
        <div>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">🚪 Logout</button>
        </div>
      </div>

      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setIsAddingReminder(true)}>➕ Add Reminder</button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th onClick={() => handleSort('title')}>Title</th>
            <th>Subject</th>
            <th onClick={() => handleSort('type')}>Type</th>
            <th onClick={() => handleSort('dueDate')}>Due In</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedReminders.map(r => {
            const countdown = getCountdown(r.dueDate);
            return (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.subjectName}</td>
                <td>{getTypeEmoji(r.type)} {r.type}</td>
                <td>{countdown.overdue ? '⌛ Overdue' : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteReminder(r.id)}>🗑 Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isAddingReminder && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Add Reminder</h5>
              <select className="form-select mb-2" value={newReminder.subjectId} onChange={(e) => setNewReminder({...newReminder, subjectId: e.target.value})}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select className="form-select mb-2" value={newReminder.type} onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}>
                <option value="assignment">Assignment</option>
                <option value="submission">Submission</option>
                <option value="exam">Exam</option>
              </select>
              <input type="text" className="form-control mb-2" placeholder="Title" value={newReminder.title} onChange={(e) => setNewReminder({...newReminder, title: e.target.value})} />
              <input type="datetime-local" className="form-control mb-2" value={newReminder.dueDate} onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})} />
              <textarea className="form-control mb-2" placeholder="Description" value={newReminder.description} onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}></textarea>
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
