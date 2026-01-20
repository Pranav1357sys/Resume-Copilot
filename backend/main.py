# Main entry point for the application
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from agent import analyze_resume

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for assignment/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RequestData(BaseModel):
    resume: str
    job_description: str

@app.post("/analyze")
async def analyze(data: RequestData):
    result = await analyze_resume(data.resume, data.job_description)
    return result

from fastapi import UploadFile, File
from file_utils import extract_text_from_pdf, extract_text_from_docx
import tempfile
import os

@app.post("/analyze-files")
async def analyze_files(
    resume_file: UploadFile = File(...),
    jd_file: UploadFile = File(...)
):
    def read_file(uploaded_file):
        suffix = uploaded_file.filename.split(".")[-1].lower()

        with tempfile.NamedTemporaryFile(delete=False, suffix="." + suffix) as tmp:
            tmp.write(uploaded_file.file.read())
            tmp_path = tmp.name

        if suffix == "pdf":
            text = extract_text_from_pdf(tmp_path)
        elif suffix in ["docx", "doc"]:
            text = extract_text_from_docx(tmp_path)
        else:
            with open(tmp_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()

        os.remove(tmp_path)
        return text

    resume_text = read_file(resume_file)
    jd_text = read_file(jd_file)

    result = await analyze_resume(resume_text, jd_text)
    return {
    "strengths": result.strengths,
    "missing_skills": result.missing_skills,
    "improved_summary": result.improved_summary,
    "suggested_bullets": result.suggested_bullets,
}

