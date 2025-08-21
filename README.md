# Matty-AI 🎨🤖  
An AI-powered design and productivity tool with a React (Vite) frontend, Node.js (Express + MongoDB) backend, and a Python (FastAPI) AI service.

---

## 📂 Project Structure
Matty-AI/
│── backend/ # Node.js backend (Express + MongoDB + routes)
│ ├── routes/ # API routes (auth, ai, notes, activity, etc.)
│ ├── models/ # MongoDB models
│ ├── server.js # Backend entry point
│ ├── ai_service.py # FastAPI AI microservice
│ ├── package.json # Backend dependencies
│ └── .env # Environment variables
│
│── frontend/ # React + Vite frontend
│ ├── src/ # Pages & components (Dashboard, CanvasEditor, etc.)
│ ├── public/
│ ├── package.json
│ └── vite.config.js
│
│── requirements.txt # Python dependencies for AI service
│── README.md

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Smital25/Matty-AI.git
cd Matty-AI
2️⃣ Backend (Node.js + MongoDB)
Install Dependencies
bash
Copy
Edit
cd backend
npm install
Configure Environment Variables
Create a .env file inside backend/:

ini
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/matty_ai
JWT_SECRET=your_secret_key
Run Backend
bash
Copy
Edit
node server.js
👉 Runs on http://localhost:5000

3️⃣ Python AI Service (FastAPI)
Install Dependencies
Make sure you have Python 3.9+ installed.
If requirements.txt is missing, install manually:

bash
Copy
Edit
pip install fastapi uvicorn motor pillow python-multipart
Run Service
bash
Copy
Edit
uvicorn ai_service:app --host 0.0.0.0 --port 5001 --reload
👉 Runs on http://localhost:5001

4️⃣ Frontend (React + Vite)
Install Dependencies
bash
Copy
Edit
cd ../frontend
npm install
Run Frontend
bash
Copy
Edit
npm run dev
👉 Runs on http://localhost:5173

5️⃣ MongoDB
Make sure MongoDB is running locally:

bash
Copy
Edit
mongod
Or use MongoDB Atlas and update the .env with your connection string.

🏃 Run Order
Start MongoDB

Start Backend → node server.js (port 5000)

Start AI Service → uvicorn ai_service:app --port 5001 (port 5001)

Start Frontend → npm run dev (port 5173)

🚀 Features
🔐 Authentication (Register/Login with JWT)

🤖 AI Assistant (FastAPI-based AI microservice)

📝 Notes System (CRUD notes stored in MongoDB)

📊 Activity Logs (Tracks user actions)

🎨 Canvas Editor (Add shapes, text, images, freehand drawing, export as PNG/PDF)

✨ AI Image Generation (Mock image generator via FastAPI)

👥 Projects & Team Management (via Express routes)

🛠️ Tech Stack
Frontend: React + Vite, Axios, React Icons, AOS, React-RND, html2canvas, jsPDF

Backend: Node.js, Express, MongoDB, JWT, Bcrypt, CORS, Dotenv

AI Service: Python FastAPI, Motor (async MongoDB), Pillow, Uvicorn

Database: MongoDB (local or Atlas)

📌 Notes
CORS is currently open (*) in AI service → restrict later for security.

AI service is running separately from Node backend.

All generated images are mock (random colors with text) → replace with real AI model if needed.

## for folders structures <img width="316" height="693" alt="image" src="https://github.com/user-attachments/assets/a1d1e84a-6f9f-45cf-a46f-6e43616f3f7c" />
