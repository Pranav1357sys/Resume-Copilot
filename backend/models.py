# Data models
from pydantic import BaseModel
from typing import List

class ResumeFeedback(BaseModel):
    strengths: List[str]
    missing_skills: List[str]
    improved_summary: str
    suggested_bullets: List[str]
