import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

// 🔹 Import your images (replace with your own later)
import heroImg from "../assets/hero.gif";
import feature1 from "../assets/feature1.jpg";
import feature2 from "../assets/feature2.gif";
import feature3 from "../assets/feature3.jpg";
import feature4 from "../assets/feature4.jpg";
import testimonial1 from "../assets/testimonial1.jpg";
import testimonial2 from "../assets/testimonial2.jpg";
import testimonial3 from "../assets/testimonial3.jpg";

export default function Landing() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#333", lineHeight: 1.6 }}>
      {/* Hero Section */}
      {/* Hero Section */}
<section
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: "120px 40px",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    color: "white",
    gap: "40px",
  }}
>
  {/* Left Content */}
  <div style={{ flex: "1", minWidth: "320px", textAlign: "left", maxWidth: "600px" }}>
    <h1
      style={{
        fontSize: "58px",
        marginBottom: "20px",
        fontWeight: "900",
        letterSpacing: "-1px",
        lineHeight: "1.2",
      }}
      data-aos="fade-right"
    >
      Welcome to <span style={{ color: "#FFD700" }}>Matty-AI</span>
    </h1>
    <p
      style={{
        fontSize: "22px",
        marginBottom: "40px",
        opacity: 0.95,
        lineHeight: "1.6",
      }}
      data-aos="fade-right"
      data-aos-delay="200"
    >
      🚀 The future of design is here. Instantly generate professional UI layouts powered by{" "}
      <b>Artificial Intelligence</b>.
    </p>
    <div style={{ marginTop: "20px" }} data-aos="fade-up" data-aos-delay="400">
      <Link to="/register">
        <button style={primaryBtn}>✨ Get Started</button>
      </Link>
      <Link to="/login">
        <button style={secondaryBtn}>Login</button>
      </Link>
    </div>
    <p
      style={{
        marginTop: "25px",
        fontSize: "16px",
        opacity: 0.85,
      }}
      data-aos="fade-up"
      data-aos-delay="600"
    >
      Loved by <b>50,000+ designers</b> and developers worldwide 🌍
    </p>
  </div>

  {/* Right Image */}
  <div style={{ flex: "1", minWidth: "320px", textAlign: "center" }}>
    <img
      src={heroImg}
      alt="Hero"
      style={{
        width: "100%",
        maxWidth: "550px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        transform: "scale(1)",
        transition: "transform 0.4s ease",
      }}
      data-aos="zoom-in"
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
  </div>
</section>

      {/* Features Section */}
      <section style={{ padding: "90px 20px", textAlign: "center" }}>
        <h2 style={sectionHeading}>✨ Features</h2>
        <div style={flexRow}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{ ...cardStyle, backgroundColor: cardColors[i % cardColors.length] }}
              data-aos="flip-left"
            >
              <img
                src={f.img}
                alt={f.title}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "15px",
                }}
              />
              <h3 style={{ fontSize: "22px", marginBottom: "15px" }}>
                {f.icon} {f.title}
              </h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "90px 20px", background: "#f9f9ff", textAlign: "center" }}>
        <h2 style={sectionHeading}>⚙️ How It Works</h2>
        <div style={flexRow}>
          {steps.map((s, i) => (
            <div key={i} style={stepCard} data-aos="zoom-in" data-aos-delay={i * 200}>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                {s.icon} {s.title}
              </h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ padding: "90px 20px", textAlign: "center", background: "linear-gradient(135deg, #f9f9ff, #e6e6ff)" }}>
        <h2
          style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "60px", color: "#4A148C" }}
          data-aos="fade-up"
        >
          💡 Why Choose <span style={{ color: "#FF4081" }}>Matty-AI?</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {whyCards.map((card, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              data-aos-delay={i * 100}
              style={card.style}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-10px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h3 style={{ fontSize: "22px", marginBottom: "15px", color: card.color }}>{card.icon} {card.title}</h3>
              <p style={{ fontSize: "16px", color: card.textColor }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "90px 20px", background: "#f1f1f1", textAlign: "center" }}>
        <h2 style={sectionHeading}>💬 What Our Users Say</h2>
        <div style={flexRow}>
          {testimonials.map((t, i) => (
            <div key={i} style={testimonialCard} data-aos="fade-up" data-aos-delay={i * 200}>
              <img
                src={t.img}
                alt={t.name}
                style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "15px", objectFit: "cover" }}
              />
              <p>"{t.quote}"</p>
              <h4 style={{ marginTop: "15px", fontWeight: "bold" }}>- {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
<section style={{ padding: "100px 20px", textAlign: "center", background: "#f8f9fa" }}>
  <h2 style={sectionHeading}>ℹ️ About Matty-AI</h2>
  <p
    style={{
      fontSize: "18px",
      maxWidth: "820px",
      margin: "20px auto 50px",
      opacity: 0.9,
      lineHeight: "1.8",
    }}
    data-aos="fade-up"
  >
    <b>Matty-AI</b> is your AI-powered design companion that empowers developers, 
    startups, and enterprises to create production-ready UIs in seconds.  
    Our mission: <b>simplify design, accelerate development, and spark creativity</b> 
    with cutting-edge AI tools.
  </p>

  {/* About Highlights */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "30px",
      maxWidth: "1000px",
      margin: "0 auto",
    }}
  >
    {/* Card 1 */}
    <div
      data-aos="zoom-in"
      style={{
        background: "#ffffff",
        padding: "30px 25px",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        flex: "1 1 250px",
        maxWidth: "300px",
        transition: "transform 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <h3 style={{ fontSize: "22px", marginBottom: "12px", color: "#0077FF" }}>🚀 Mission</h3>
      <p style={{ fontSize: "16px", opacity: 0.8 }}>
        To revolutionize the way people design and build apps, 
        making it <b>faster, smarter, and more intuitive</b>.
      </p>
    </div>

    {/* Card 2 */}
    <div
      data-aos="zoom-in"
      data-aos-delay="200"
      style={{
        background: "#ffffff",
        padding: "30px 25px",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        flex: "1 1 250px",
        maxWidth: "300px",
        transition: "transform 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <h3 style={{ fontSize: "22px", marginBottom: "12px", color: "#28a745" }}>🌍 Vision</h3>
      <p style={{ fontSize: "16px", opacity: 0.8 }}>
        A world where <b>anyone</b> can design beautiful user interfaces 
        with just ideas — powered by AI.
      </p>
    </div>

    {/* Card 3 */}
    <div
      data-aos="zoom-in"
      data-aos-delay="400"
      style={{
        background: "#ffffff",
        padding: "30px 25px",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        flex: "1 1 250px",
        maxWidth: "300px",
        transition: "transform 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <h3 style={{ fontSize: "22px", marginBottom: "12px", color: "#ff5722" }}>💡 Values</h3>
      <p style={{ fontSize: "16px", opacity: 0.8 }}>
        Innovation, simplicity, and trust.  
        We believe in <b>empowering creators</b> at every level.
      </p>
    </div>
  </div>
</section>


      {/* Contact Section */}
<section style={{ padding: "100px 20px", background: "linear-gradient(135deg, #f9f9f9, #eef3f7)", textAlign: "center" }}>
  <h2 style={sectionHeading}>📬 Get in Touch</h2>
  <p style={{ fontSize: "18px", maxWidth: "700px", margin: "20px auto", opacity: 0.85 }} data-aos="fade-up">
    We’d love to hear from you! Whether you have questions, feedback, or partnership ideas, our team is here to help. 
    Reach out via email, visit us, or simply fill out the form below.
  </p>

  {/* Contact Info */}
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px", marginTop: "50px" }}>
    <div data-aos="fade-up" style={{ background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 8px 18px rgba(0,0,0,0.1)" }}>
      <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>📧 Email</h3>
      <p><a href="mailto:support@mattyai.com" style={{ color: "#0077ff", fontWeight: "bold" }}>support@mattyai.com</a></p>
    </div>
    <div data-aos="fade-up" data-aos-delay="200" style={{ background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 8px 18px rgba(0,0,0,0.1)" }}>
      <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>📍 Location</h3>
      <p>Bengaluru, India</p>
    </div>
    <div data-aos="fade-up" data-aos-delay="400" style={{ background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 8px 18px rgba(0,0,0,0.1)" }}>
      <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>🌐 Website</h3>
      <p><a href="https://mattyai.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0077ff", fontWeight: "bold" }}>www.mattyai.com</a></p>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer style={{ background: "#1a1a1a", color: "#ccc", textAlign: "center", padding: "30px", fontSize: "14px" }}>
        <p>© {new Date().getFullYear()} Matty-AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

// 🔹 Button styles
const primaryBtn = {
  padding: "14px 32px",
  marginRight: "15px",
  fontSize: "17px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#FFD700",
  color: "#333",
  fontWeight: "bold",
  transition: "all 0.3s ease",
};
const secondaryBtn = { ...primaryBtn, backgroundColor: "#fff", color: "#2575fc" };

// 🔹 Reusable styles
const sectionHeading = { fontSize: "38px", marginBottom: "40px", fontWeight: "700" };
const flexRow = { display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" };
const cardStyle = {
  width: "280px",
  padding: "28px",
  borderRadius: "14px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
  backgroundColor: "#fff",
  transition: "transform 0.3s ease",
};
const stepCard = { ...cardStyle, width: "220px" };
const testimonialCard = { ...cardStyle, width: "300px", fontStyle: "italic", background: "#fff" };

// 🔹 Card colors
const cardColors = ["#fce4ec", "#e3f2fd", "#e8f5e9", "#fff3e0"];

// 🔹 Features
const features = [
  { icon: "⚡", title: "Instant UI", desc: "Generate beautiful, production-ready UI instantly.", img: feature1 },
  { icon: "🎨", title: "Customizable", desc: "Edit UI components to match your brand.", img: feature2 },
  { icon: "📂", title: "Export Options", desc: "Export into React, HTML, or TailwindCSS.", img: feature3 },
  { icon: "🤖", title: "AI Suggestions", desc: "Get smart color, layout & font suggestions.", img: feature4 },
];

// 🔹 How it works steps
const steps = [
  { icon: "1️⃣", title: "Describe", desc: "Tell Matty-AI what kind of UI you need." },
  { icon: "2️⃣", title: "Generate", desc: "AI instantly creates UI layouts for you." },
  { icon: "3️⃣", title: "Customize", desc: "Tweak until it’s perfect for your project." },
  { icon: "4️⃣", title: "Export", desc: "Download React, Tailwind, or HTML code." },
];

// 🔹 Why Choose Us cards
const whyCards = [
  { icon: "⚡", title: "Save Time", desc: "Reduce hours of manual designing with instant AI-powered UI generation.", color: "#673AB7", textColor: "#444", style: { background: "white", padding: "30px 20px", borderRadius: "20px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", transition: "all 0.3s ease" } },
  { icon: "🎨", title: "Creative & Modern", desc: "AI-driven creativity aligned with the latest design principles.", color: "white", textColor: "white", style: { background: "linear-gradient(135deg, #FF80AB, #FF4081)", padding: "30px 20px", borderRadius: "20px", color: "white", boxShadow: "0 8px 20px rgba(0,0,0,0.15)", transition: "all 0.3s ease" } },
  { icon: "👌", title: "Beginner Friendly", desc: "Easy to use for beginners, yet powerful enough for professionals.", color: "#009688", textColor: "#444", style: { background: "white", padding: "30px 20px", borderRadius: "20px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", transition: "all 0.3s ease" } },
  { icon: "🌍", title: "Trusted Worldwide", desc: "Loved by thousands of designers and developers across the globe.", color: "white", textColor: "white", style: { background: "linear-gradient(135deg, #42A5F5, #1E88E5)", padding: "30px 20px", borderRadius: "20px", color: "white", boxShadow: "0 8px 20px rgba(0,0,0,0.15)", transition: "all 0.3s ease" } },
  { icon: "🚀", title: "Always Improving", desc: "Powered by the latest AI models and continuously evolving.", color: "#FF9800", textColor: "#444", style: { background: "white", padding: "30px 20px", borderRadius: "20px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", transition: "all 0.3s ease" } },
];

// 🔹 Testimonials
const testimonials = [
  { quote: "Matty-AI saved me weeks of work. I now design dashboards in minutes!", name: "Priya, Frontend Dev", img: testimonial1 },
  { quote: "The AI suggestions are mind-blowing. Like having a designer buddy.", name: "James, UI/UX Designer", img: testimonial2 },
  { quote: "Super easy to use, even for beginners. Highly recommend it!", name: "Ankit, Student", img: testimonial3 },
];
