import { useState } from "react";
import axios from "axios";
// ✅ Import your image here
import RegisterGif from "../assets/register.gif"; // <-- change path to your asset

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/register", form);
    alert("Registered successfully!");
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
            href="/login"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </a>
        </div>
      </nav>

      {/* ✅ Register Form Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          background: "#f3f4f6",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "linear-gradient(145deg, #3b82f6, #1e40af)",
            color: "white",
            borderRadius: "12px",
            width: "700px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* ✅ Left GIF Section */}
          <div
            style={{
              flex: 1,
              background: "#1e3a8a33",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <img
              src={RegisterGif}
              alt="Register illustration"
              style={{
                width: "100%",
                maxWidth: "280px",
                borderRadius: "12px",
              }}
            />
          </div>

          {/* ✅ Right Form Section */}
          <form
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
              Register
            </h2>

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              style={inputStyle}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "15px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "0.3s",
              }}
            >
              Register
            </button>

            {/* ✅ Already registered? */}
            <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
              Already registered?{" "}
              <a
                href="/login"
                style={{ color: "#ffd700", fontWeight: "bold", textDecoration: "none" }}
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
  outline: "none",
};
