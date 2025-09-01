import React, { useState } from "react";

// Mock navigation and toast
const useNavigate = () => (path) => {
  console.log(`Navigating to: ${path}`);
  alert(`Would navigate to: ${path}`);
};

const useToast = () => ({
  toast: ({ title, description, variant }) => {
    const type = variant === "destructive" ? "ERROR" : "SUCCESS";
    alert(`${type}: ${title}\n${description}`);
  },
});

export default function Subjects({ student, onLogout }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [subjects, setSubjects] = useState([
  ]);

  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [termDetails, setTermDetails] = useState({ test: 0, assignment: 0, exam: 0, testWeight: 30, assignmentWeight: 30, examWeight: 40 });
  const [selectedTerm, setSelectedTerm] = useState("term1");
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });

  const studentData = student || { first_name: "Demo", last_name: "Student", email: "demo@student.com" };
  const handleLogout = onLogout || (() => alert("Logout not configured"));

  const addSubject = () => {
    if (subjects.length >= 10) return toast({ title: "Max subjects reached", description: "You can only add up to 10 subjects.", variant: "destructive" });
    if (!newSubject.name.trim()) return toast({ title: "Subject name required", description: "Enter a subject name.", variant: "destructive" });

    const newSub = { id: Date.now().toString(), name: newSubject.name, description: newSubject.description, term1: 0, term2: 0, term3: 0, term4: 0 };
    setSubjects([...subjects, newSub]);
    setNewSubject({ name: "", description: "" });
    setIsAddingSubject(false);
    toast({ title: "Subject added", description: `${newSubject.name} added successfully.` });
  };

  const calculateTermPercentage = () => {
    const { test, assignment, exam, testWeight, assignmentWeight, examWeight } = termDetails;
    if (testWeight + assignmentWeight + examWeight !== 100) return toast({ title: "Invalid weights", description: "Weights must sum to 100%.", variant: "destructive" });

    const percentage = (test * testWeight + assignment * assignmentWeight + exam * examWeight) / 100;
    if (selectedSubject) {
      const updated = subjects.map(s => s.id === selectedSubject.id ? { ...s, [selectedTerm]: percentage } : s);
      setSubjects(updated);
      setSelectedSubject(null);
      toast({ title: "Term calculated", description: `${selectedTerm.toUpperCase()} percentage: ${percentage.toFixed(2)}%` });
    }
  };

  const openTermModal = (subject, term) => {
    setSelectedSubject(subject);
    setSelectedTerm(term);
    setTermDetails({ test: 0, assignment: 0, exam: 0, testWeight: 30, assignmentWeight: 30, examWeight: 40 });
  };

  const getGradeBadgeClass = (p) => p < 50 ? "bg-danger" : p <= 65 ? "bg-warning" : "bg-success";

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast({ title: "Deleted", description: "Subject removed." });
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8fafc", padding: "20px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button onClick={() => navigate("/")} className="btn btn-outline-secondary">⬅ Back</button>
          <h4>Subject Calculations</h4>
        </div>
        <div className="d-flex gap-2">
          <button onClick={() => navigate("/")} className="btn btn-outline-primary">🏠 Dashboard</button>
          <button onClick={handleLogout} className="btn btn-outline-danger">🚪 Logout</button>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="card p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>My Subjects ({subjects.length}/10)</h5>
          <button onClick={() => setIsAddingSubject(true)} className="btn btn-primary">➕ Add Subject</button>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className="text-center">Term 1 %</th>
              <th className="text-center">Term 2 %</th>
              <th className="text-center">Term 3 %</th>
              <th className="text-center">Term 4 %</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id}>
                <td className="align-middle">
                  <button className="btn btn-link p-0" onClick={() => openTermModal(s, "term1")}>{s.name}</button>
                </td>
                <td className="align-middle">{s.description}</td>
                <td className="text-center align-middle">
                  <span className={`badge ${getGradeBadgeClass(s.term1)}`} onClick={() => openTermModal(s, "term1")} style={{ cursor: "pointer" }}>
                    {s.term1.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center align-middle">
                  <span className={`badge ${getGradeBadgeClass(s.term2)}`} onClick={() => openTermModal(s, "term2")} style={{ cursor: "pointer" }}>
                    {s.term2.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center align-middle">
                  <span className={`badge ${getGradeBadgeClass(s.term3)}`} onClick={() => openTermModal(s, "term3")} style={{ cursor: "pointer" }}>
                    {s.term3.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center align-middle">
                  <span className={`badge ${getGradeBadgeClass(s.term4)}`} onClick={() => openTermModal(s, "term4")} style={{ cursor: "pointer" }}>
                    {s.term4.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center align-middle">
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteSubject(s.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Subject Modal */}
      {isAddingSubject && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Add New Subject</h5>
              <input type="text" className="form-control mb-2" placeholder="Subject Name" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} />
              <textarea className="form-control mb-2" placeholder="Description" value={newSubject.description} onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })} />
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setIsAddingSubject(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={addSubject}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Term Modal */}
      {selectedSubject && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Calculate Term - {selectedSubject.name}</h5>
              <select className="form-select mb-2" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                <option value="term1">Term 1</option>
                <option value="term2">Term 2</option>
                <option value="term3">Term 3</option>
                <option value="term4">Term 4</option>
              </select>
              <div className="row mb-2">
                <div className="col-6">
                  <input type="number" className="form-control" placeholder="Test %" value={termDetails.test} onChange={(e) => setTermDetails({ ...termDetails, test: Number(e.target.value) })} />
                </div>
                <div className="col-6">
                  <input type="number" className="form-control" placeholder="Test Weight %" value={termDetails.testWeight} onChange={(e) => setTermDetails({ ...termDetails, testWeight: Number(e.target.value) })} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <input type="number" className="form-control" placeholder="Assignment %" value={termDetails.assignment} onChange={(e) => setTermDetails({ ...termDetails, assignment: Number(e.target.value) })} />
                </div>
                <div className="col-6">
                  <input type="number" className="form-control" placeholder="Assignment Weight %" value={termDetails.assignmentWeight} onChange={(e) => setTermDetails({ ...termDetails, assignmentWeight: Number(e.target.value) })} />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <input type="number" className="form-control" placeholder="Exam %" value={termDetails.exam} onChange={(e) => setTermDetails({ ...termDetails, exam: Number(e.target.value) })} />
                </div>
                <div className="col-6">
                  <input type="number" className="form-control" placeholder="Exam Weight %" value={termDetails.examWeight} onChange={(e) => setTermDetails({ ...termDetails, examWeight: Number(e.target.value) })} />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setSelectedSubject(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={calculateTermPercentage}>Calculate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
