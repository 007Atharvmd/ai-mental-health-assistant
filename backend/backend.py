from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
import psycopg2
import bcrypt
import subprocess
import logging
from textblob import TextBlob

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database Configuration
DB_CONFIG = {
    "dbname": "ai_mha",
    "user": "postgres",
    "password": "syndic@te07",
    "host": "localhost",
    "port": "5432",
}

# Database Connection Helper
def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        logger.error(f"\u274c Database connection failed: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# Ensure tables exist
conn = get_db_connection()
cursor = conn.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL
);
''')
cursor.execute('''
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    mood TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
''')
conn.commit()
conn.close()

# Crisis detection keywords
CRISIS_KEYWORDS = {"suicide", "kill myself", "die", "end my life", "hopeless", "self-harm"}

# Detect crisis messages
def detect_crisis(text: str) -> bool:
    return any(keyword in text.lower() for keyword in CRISIS_KEYWORDS)

# Sentiment analysis function
def analyze_sentiment(text: str) -> str:
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    if polarity > 0.2:
        return "positive"
    elif polarity < -0.2:
        return "depressed"
    elif any(word in text.lower() for word in {"stress", "nervous", "worried", "anxious"}):
        return "anxious"
    return "neutral"

# AI Response Simulation
def get_ai_response(prompt: str) -> str:
    try:
        response = subprocess.run(["ollama", "run", "llama2", prompt], capture_output=True, text=True, timeout=100)
        if response.returncode == 0:
            return response.stdout.strip()
        return "Error: AI response could not be generated."
    except subprocess.TimeoutExpired:
        return "Error: AI response took too long."
    except Exception as e:
        return f"Error: {str(e)}"

# Request Models
class UserRegister(BaseModel):
    username: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    username: str
    password: str

class ChatMessage(BaseModel):
    user_id: int
    message: str

# User Registration Endpoint
@app.post("/register", response_model=dict)
def register(user: UserRegister):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password, name) VALUES (%s, %s, %s) RETURNING id", (user.username.strip().lower(), hashed_password, user.name.strip()))
        user_id = cursor.fetchone()[0]
        conn.commit()
        return {"message": "Registration successful", "user_id": user_id}
    except psycopg2.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="User already exists!")
    finally:
        cursor.close()
        conn.close()

# User Login Endpoint
@app.post("/login", response_model=dict)
def login(user: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, password, name FROM users WHERE username = %s", (user.username.lower(),))
    db_user = cursor.fetchone()
    if db_user and bcrypt.checkpw(user.password.encode('utf-8'), db_user[1].encode('utf-8')):
        return {"message": "Login successful", "user_id": db_user[0], "name": db_user[2]}
    raise HTTPException(status_code=400, detail="Invalid credentials")

# Chat Processing Endpoint
@app.post("/chat", response_model=dict)
def chat(chat_msg: ChatMessage):
    if detect_crisis(chat_msg.message):
        return {"ai_response": "\u26a0 Please seek immediate help. Call a crisis hotline.", "mood": "crisis"}
    mood = analyze_sentiment(chat_msg.message)
    ai_response = get_ai_response(chat_msg.message)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO chats (user_id, message, response, mood) VALUES (%s, %s, %s, %s)", (chat_msg.user_id, chat_msg.message, ai_response, mood))
        conn.commit()
    finally:
        cursor.close()
        conn.close()
    return {"ai_response": ai_response, "mood": mood, "message": "Response sent successfully"}

# Retrieve Chat History Endpoint
@app.get("/chat-history/{user_id}", response_model=list)
def view_chat_history(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT message, response, mood, created_at FROM chats WHERE user_id = %s ORDER BY created_at ASC", (user_id,))
    chats = cursor.fetchall()
    cursor.close()
    conn.close()
    return [{"message": chat[0], "ai_response": chat[1], "mood": chat[2], "timestamp": chat[3]} for chat in chats]

# Run FastAPI App
if __name__ == "__main__":
    import uvicorn
    logger.info("\U0001F680 Starting FastAPI Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
