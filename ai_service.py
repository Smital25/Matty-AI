from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId
from PIL import Image, ImageDraw, ImageFont
import base64, io
import motor.motor_asyncio

# ---------- App Setup ----------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔒 restrict later e.g. ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MongoDB ----------
MONGO_URI = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client["matty_ai"]
notes_collection = db["notes"]
activity_collection = db["activity"]

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc


# ---------- AI ROUTE ----------
@app.post("/api/ai/generate")
async def generate_ai_response(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "").lower()

    if "hello" in prompt:
        return {"output": "Hello 👋! I’m Matty-AI, how can I help you today?"}
    elif "your name" in prompt:
        return {"output": "My name is Matty-AI 🤖, your AI assistant."}
    elif "time" in prompt:
        return {"output": f"The current time is {datetime.now().strftime('%H:%M:%S')} ⏰"}
    elif "who created you" in prompt or "developer" in prompt:
        return {"output": "I was created as part of the **Matty-AI project** 💡."}
    elif "what is matty-ai" in prompt:
        return {"output": "Matty-AI is a lightweight AI assistant 🤖 built to answer basic questions."}
    elif "features" in prompt:
        return {"output": "I can greet you, tell the time, share about myself, and solve basic math 🧮."}
    elif any(op in prompt for op in ["+", "-", "*", "/"]):
        try:
            result = eval(prompt)  # ⚠️ demo only
            return {"output": f"The result is {result} ✅"}
        except:
            return {"output": "Sorry 😅, I couldn’t calculate that."}
    elif "goodbye" in prompt or "bye" in prompt:
        return {"output": "Goodbye 👋! Come back anytime!"}
    else:
        return {"output": "Hmm 🤔 I don’t know that yet, but soon I’ll get smarter!"}


# ---------- Notes ----------
@app.get("/api/notes")
async def get_notes():
    cursor = notes_collection.find().sort("date", -1).limit(50)
    notes = [serialize_doc(n) async for n in cursor]
    return notes

@app.post("/api/notes")
async def add_note(request: Request):
    data = await request.json()
    note = {"text": data.get("text", ""), "date": datetime.now()}
    result = await notes_collection.insert_one(note)
    note["_id"] = str(result.inserted_id)

    # log activity
    await activity_collection.insert_one({
        "action": "Added Note",
        "meta": {"noteId": note["_id"], "preview": note["text"][:80]},
        "date": datetime.now()
    })

    return note

@app.delete("/api/notes/{note_id}")
async def delete_note(note_id: str):
    result = await notes_collection.delete_one({"_id": ObjectId(note_id)})
    if result.deleted_count == 0:
        return {"error": "Note not found"}

    # log activity
    await activity_collection.insert_one({
        "action": "Deleted Note",
        "meta": {"noteId": note_id},
        "date": datetime.now()
    })

    return {"status": "deleted", "id": note_id}


# ---------- Activity ----------
@app.get("/api/activity")
async def get_activity():
    cursor = activity_collection.find().sort("date", -1).limit(20)
    logs = [serialize_doc(a) async for a in cursor]
    return logs

@app.post("/api/activity")
async def add_activity(request: Request):
    data = await request.json()
    entry = {
        "action": data.get("action", "Unknown"),
        "meta": data.get("meta", {}),
        "date": datetime.now(),
    }
    result = await activity_collection.insert_one(entry)
    entry["_id"] = str(result.inserted_id)
    return entry


import random

# ---------- Image Generation ----------
@app.post("/api/ai/image")
async def generate_image(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "No prompt provided")

    # Generate a random color
    random_color = (random.randint(50, 200), random.randint(50, 200), random.randint(50, 200))

    img = Image.new("RGB", (512, 512), color=random_color)
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.load_default()
        draw.text((10, 10), prompt[:50], fill=(255, 255, 255), font=font)
    except Exception:
        pass

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return JSONResponse({"image": f"data:image/png;base64,{img_str}"})

# ---------- Root ----------
@app.get("/")
async def root():
    return {"message": "✅ Matty-AI Backend Running"}
