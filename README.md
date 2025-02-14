# AI-Driven Mental Health Assistant

## Overview

The **AI-Driven Mental Health Assistant** is an AI-powered chatbot designed to support mental well-being by analyzing user sentiment, detecting crisis situations, and offering therapist recommendations. It runs **Llama 2 locally via Ollama** for generating responses and is currently hosted on **localhost**.

## Features

✅ **Sentiment Analysis** – Analyzes user messages to determine mood.  
🚨 **Crisis Detection** – Identifies high-risk emotional states and alerts users.  
📊 **Mood Tracking** – Displays an average mood score for self-monitoring.  
🌍 **Multilingual Support** – Supports English & Hindi conversations.  
🔐 **User Authentication** – Secure login system for personalized experience.  
🤖 **AI-Powered Responses** – Uses **Llama 2 via Ollama** for contextual replies.  
💾 **Chat History** – Stores previous conversations for reference.  
🎤 **Voice Input** – Speech-to-text functionality for seamless interaction.  
⚡ **Local Deployment** – Ensures privacy with offline execution.  

---

## Tech Stack

### **Frontend**
- **Next.js (React)**
- **Tailwind CSS** (for UI styling)
- **Lucide Icons** (for UI elements)

### **Backend**
- **FastAPI** (Python-based web framework)
- **PostgreSQL** (Database for storing chat history)
- **Ollama** (Runs Llama 2 model locally)
- **SQLAlchemy** (ORM for database interactions)
- **SpeechRecognition API** (For voice input)

---

## Installation & Setup

### 1️⃣ Prerequisites:
- Install **Ollama** → [Download Here](https://ollama.ai/)
- Install **Node.js & npm** → [Download Here](https://nodejs.org/)
- Install **Python 3.8+**
- Install **PostgreSQL** → Ensure a database is set up

### 2️⃣ Clone the Repository:
```sh
git clone https://github.com/your-repo/mental-health-assistant.git
cd mental-health-assistant```



### Backend Setup:
Create a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run the backend server

python3 backend.py


### Frontend Setup:

Navigate to the frontend/ folder:

cd frontend

Install dependencies:

npm install
Start the Next.js frontend:

npm run dev

The frontend should now be running at http://localhost:3000

