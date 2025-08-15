from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data.resume_data import PERSONAL_INFO, EDUCATION, SKILLS, WORK_EXPERIENCE, PROJECTS, CERTIFICATIONS, AWARDS
from utils.ai_tools import AITools

app = FastAPI(title="Avni Girish Portfolio API", description="Interactive AI/ML Portfolio Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize AI tools
ai_tools = AITools()

# Pydantic models
class SentimentRequest(BaseModel):
    text: str

class SkillRecommendationRequest(BaseModel):
    target_role: str = "Data Scientist"

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

# API Endpoints

@app.get("/")
async def root():
    return {"message": "Welcome to Avni Girish's Interactive Portfolio API"}

@app.get("/api/personal-info")
async def get_personal_info():
    return PERSONAL_INFO

@app.get("/api/education")
async def get_education():
    return EDUCATION

@app.get("/api/skills")
async def get_skills():
    return SKILLS

@app.get("/api/work-experience")
async def get_work_experience():
    return WORK_EXPERIENCE

@app.get("/api/projects")
async def get_projects():
    return PROJECTS

@app.get("/api/certifications")
async def get_certifications():
    return {"certifications": CERTIFICATIONS, "awards": AWARDS}

@app.post("/api/sentiment-analysis")
async def analyze_sentiment(request: SentimentRequest):
    try:
        result = ai_tools.analyze_sentiment(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/skill-recommendations")
async def get_skill_recommendations(request: SkillRecommendationRequest):
    try:
        all_skills = []
        for skill_category in SKILLS.values():
            all_skills.extend(skill_category)
        
        recommendations = ai_tools.generate_skill_recommendations(all_skills, request.target_role)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/skills-radar-data")
async def get_skills_radar_data():
    try:
        radar_data = ai_tools.create_skills_radar_chart(SKILLS)
        return {"chart_data": radar_data.to_json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/experience-timeline-data")
async def get_experience_timeline_data():
    try:
        timeline_data = ai_tools.create_experience_timeline(WORK_EXPERIENCE)
        return {"chart_data": timeline_data.to_json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/project-insights")
async def get_project_insights():
    try:
        insights = ai_tools.generate_project_insights(PROJECTS)
        return {
            "tech_distribution": dict(insights["tech_distribution"]),
            "chart_data": insights["chart"].to_json(),
            "total_projects": insights["total_projects"],
            "unique_technologies": insights["unique_technologies"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/career-progression")
async def get_career_progression():
    try:
        progression = ai_tools.calculate_career_progression_score(WORK_EXPERIENCE)
        return progression
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/skill-synergy/{skill1}/{skill2}")
async def get_skill_synergy(skill1: str, skill2: str):
    try:
        synergy = ai_tools.predict_skill_synergy(skill1, skill2)
        return {"skill1": skill1, "skill2": skill2, "synergy_score": synergy}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/contact")
async def submit_contact_message(message: ContactMessage):
    try:
        # Analyze sentiment of the message
        sentiment = ai_tools.analyze_sentiment(message.message)
        
        # In a real application, you would save this to a database
        # For now, we'll just return a confirmation with sentiment analysis
        
        response_message = "Thank you for your message! "
        if sentiment["sentiment"] == "positive":
            response_message += "I'm excited to connect with you!"
        elif sentiment["sentiment"] == "negative":
            response_message += "I appreciate your feedback and will get back to you soon."
        else:
            response_message += "I'll review your message and respond accordingly."
        
        return {
            "status": "success",
            "message": response_message,
            "sentiment_analysis": sentiment
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/portfolio-stats")
async def get_portfolio_stats():
    try:
        all_skills = []
        for skill_category in SKILLS.values():
            all_skills.extend(skill_category)
        
        total_achievements = 0
        for company in WORK_EXPERIENCE:
            for position in company["positions"]:
                total_achievements += len(position["achievements"])
        
        stats = {
            "total_skills": len(all_skills),
            "total_projects": len(PROJECTS),
            "total_work_experiences": sum(len(company["positions"]) for company in WORK_EXPERIENCE),
            "total_achievements": total_achievements,
            "total_certifications": len(CERTIFICATIONS),
            "total_awards": len(AWARDS)
        }
        
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)