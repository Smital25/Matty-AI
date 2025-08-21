import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ Import useNavigate
import axios from "axios";
import "../pages/styles/Dashboard.css";
import CanvasEditor from "../pages/CanvasEditor";
import { FaRobot, FaStickyNote, FaChartLine, FaTrash } from "react-icons/fa";
import AIIcon from "../assets/askai.jpg";
import Notes from "../assets/notesselct.jpg";
import Activity from "../assets/activity.jpg";

export default function Dashboard() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [activity, setActivity] = useState([]);

  const navigate = useNavigate();   // ✅ Initialize navigate

  useEffect(() => {
    fetchNotes();
    fetchActivity();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/activity");
      setActivity(res.data);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    }
  };

  const handleAskAI = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setAiResponse("");

    try {
      const res = await axios.post("http://localhost:5001/api/ai/generate", {
        prompt: aiPrompt,
      });
      setAiResponse(res.data.output);

      await axios.post("http://localhost:5001/api/activity", {
        action: "Asked AI",
        meta: { prompt: aiPrompt },
      });
      fetchActivity();
    } catch (err) {
      console.error("AI request failed:", err);
      setAiResponse("⚠️ Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    try {
      await axios.post("http://localhost:5001/api/notes", { text: newNote });
      setNewNote("");
      fetchNotes();
      fetchActivity();
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/notes/${id}`);
      fetchNotes();
      fetchActivity();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/");   // ✅ Works now
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h2 className="logo">Matty-AI</h2>
        </div>
        <div className="navbar-right">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <h1>👋 Welcome back, Matty!</h1>
          <p>
            Your personal <span>AI-powered</span> dashboard
          </p>
        </header>

        {/* Top 3 Cards */}
        <div className="dashboard-cards">
          {/* AI Assistant */}
          <div className="card ai-card">
            <h2>
              <FaRobot /> 🤖 Ask Matty-AI
            </h2>
            <img src={AIIcon} alt="AI GIF" className="card-gif" />
            <div className="input-row">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="✨ Ask AI anything..."
              />
              <button onClick={handleAskAI}>
                {loading ? "Thinking..." : "Ask"}
              </button>
            </div>
            <div className="response-box">
              {loading ? (
                <div className="loading">
                  <img
                    src="https://i.gifer.com/VAyR.gif"
                    alt="Loading"
                    className="loader-gif"
                  />
                  <span>AI is thinking...</span>
                </div>
              ) : (
                aiResponse || "🤖 Waiting for your question..."
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="card notes-card">
            <h2>
              <FaStickyNote /> 📝 Quick Notes
            </h2>
            <img src={Notes} alt="Notes GIF" className="card-gif" />
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your thoughts..."
            />
            <button onClick={handleSaveNote}>Save Note</button>
            <ul className="notes-list">
              {notes.map((note) => (
                <li key={note._id}>
                  <span>{note.text}</span>
                  <button onClick={() => handleDeleteNote(note._id)}>
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity */}
          <div className="card activity-card">
            <h2>
              <FaChartLine /> 📊 Recent Activity
            </h2>
            <img src={Activity} alt="Activity GIF" className="card-gif" />
            <ul className="activity-list">
              {activity.length > 0 ? (
                activity.map((a) => (
                  <li key={a._id}>
                    <span className="action">{a.action}</span>
                    <span className="date">
                      {new Date(a.date).toLocaleString()}
                    </span>
                  </li>
                ))
              ) : (
                <li>No activity yet</li>
              )}
            </ul>
          </div>
        </div>

        {/* Canva-style Editor */}
        <div className="card editor-card">
          <h2>🎨 Canva-style Editor</h2>
          <CanvasEditor userId={"replace_with_loggedin_user_id"} />
        </div>
      </main>
    </div>
  );
}
