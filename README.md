# Resume Copilot – AI Resume Review Tool

## Overview
Resume Copilot is a full-stack AI-powered web application that analyzes a candidate’s resume against a job description and provides structured, actionable feedback.

The tool highlights strengths, missing skills, suggests an improved professional summary, and recommends optimized resume bullet points tailored to the job role.

---

## Features
- Upload resume (PDF/DOCX)
- Upload job description (PDF/DOCX/TXT)
- AI-generated feedback:
  - Strengths
  - Missing skills
  - Improved summary
  - Suggested resume bullets
- Clean, responsive UI
- FastAPI backend with AI agent integration

---

## Tech Stack
**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend**
- FastAPI
- Python
- pydantic-ai
- OpenAI API

---

## How to Run Locally

### Backend
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
Backend runs on: http://127.0.0.1:8000

### Frontend
cd frontend
npm install
npm run dev
Frontend runs on: http://localhost:3000

### API Endpoint
POST /analyze-files

Accepts resume file and job description file

Returns structured JSON feedback

### Notes

.env file is required with OpenAI API key

Project is designed for clarity, maintainability, and extensibility.

### Author
Pranav Singh Rawat