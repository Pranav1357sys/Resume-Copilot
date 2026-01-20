from pydantic_ai import Agent
from dotenv import load_dotenv
from models import ResumeFeedback

load_dotenv()

agent = Agent(
    model="openai:gpt-3.5-turbo",
    system_prompt=(
        "You are an expert resume reviewer.\n"
        "Return output EXACTLY in this format:\n\n"
        "Strengths:\n"
        "- point\n\n"
        "Missing Skills:\n"
        "- point\n\n"
        "Improved Summary:\n"
        "paragraph\n\n"
        "Suggested Bullets:\n"
        "- point"
    ),
)

async def analyze_resume(resume: str, job_description: str) -> ResumeFeedback:
    prompt = f"""
Resume:
{resume}

Job Description:
{job_description}
"""

    result = await agent.run(prompt)

    # ✅ THIS IS THE CRITICAL LINE
    text: str = result.output

    def extract(section: str):
        if section not in text:
            return []
        block = text.split(section)[1].split("\n\n")[0]
        return [
            line.replace("-", "").strip()
            for line in block.splitlines()
            if line.strip()
        ]

    return ResumeFeedback(
        strengths=extract("Strengths:"),
        missing_skills=extract("Missing Skills:"),
        improved_summary=(
            text.split("Improved Summary:")[1].split("\n\n")[0].strip()
            if "Improved Summary:" in text
            else ""
        ),
        suggested_bullets=extract("Suggested Bullets:"),
    )
