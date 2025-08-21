import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import loginicon from "../assets/register.gif";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/dashboard"); 
    } catch (err) {
      alert("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* ✅ Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "15px 30px",
          background: "linear-gradient(145deg, #3b82f6, #1e40af)", // same as card
          color: "#fff",
        }}
      >
        <h2 style={{ margin: 0 }}>Matty-AI</h2>
        <div>
          <a
            href="/"
            style={{
              color: "#fff",
              marginRight: "20px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Home
          </a>
          <a
            href="/register"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Register
          </a>
        </div>
      </nav>

      {/* ✅ Main Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          background: "#f3f4f6",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row", // side by side
            width: "800px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Left side: Form */}
          <div style={{ flex: 1, padding: "40px", textAlign: "left" }}>
            <h2 style={{ marginBottom: "20px" }}>Login</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "8px",
                  border: "none",
                  outline: "none",
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "8px",
                  border: "none",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "15px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#1e40af",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                Login
              </button>
            </form>
          </div>

          {/* Right side: Image */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <img
              src={loginicon}
              alt="Login Illustration"
              style={{ width: "90%", maxWidth: "350px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
