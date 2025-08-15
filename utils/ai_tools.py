import re
from collections import Counter
import random

class AITools:
    def __init__(self):
        pass
        
    def analyze_sentiment(self, text):
        """Simple sentiment analysis using keyword-based approach"""
        if not text:
            return {"polarity": 0, "subjectivity": 0, "sentiment": "neutral"}
        
        # Simple sentiment analysis using positive/negative word lists
        positive_words = [
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 
            'awesome', 'love', 'like', 'happy', 'excited', 'impressed', 'perfect'
        ]
        negative_words = [
            'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad', 
            'angry', 'disappointed', 'frustrated', 'poor', 'worst'
        ]
        
        text_lower = text.lower()
        words = re.findall(r'\b\w+\b', text_lower)
        
        positive_count = sum(1 for word in words if word in positive_words)
        negative_count = sum(1 for word in words if word in negative_words)
        total_words = len(words)
        
        if total_words == 0:
            polarity = 0
        else:
            polarity = (positive_count - negative_count) / total_words
        
        subjectivity = (positive_count + negative_count) / max(total_words, 1)
        
        if polarity > 0.1:
            sentiment = "positive"
        elif polarity < -0.1:
            sentiment = "negative"
        else:
            sentiment = "neutral"
            
        return {
            "polarity": round(polarity, 3),
            "subjectivity": round(subjectivity, 3),
            "sentiment": sentiment
        }
    
    def generate_skill_recommendations(self, current_skills, target_role="Data Scientist"):
        """Generate skill recommendations based on current skills and target role"""
        skill_recommendations = {
            "Data Scientist": [
                "Deep Learning", "TensorFlow", "PyTorch", "MLOps", "Apache Spark",
                "Hadoop", "Kubernetes", "Docker", "AWS", "GCP", "Azure ML"
            ],
            "Software Engineer": [
                "Microservices", "Docker", "Kubernetes", "GraphQL", "Redis",
                "Elasticsearch", "CI/CD", "Testing Frameworks", "System Design"
            ],
            "AI Engineer": [
                "Computer Vision", "Reinforcement Learning", "MLOps", "Model Deployment",
                "Edge Computing", "ONNX", "TensorRT", "Model Optimization"
            ]
        }
        
        recommended = skill_recommendations.get(target_role, skill_recommendations["Data Scientist"])
        missing_skills = [skill for skill in recommended if skill not in current_skills]
        
        return {
            "recommended_skills": missing_skills[:5],
            "matching_skills": [skill for skill in current_skills if skill in recommended],
            "match_percentage": round(len([skill for skill in current_skills if skill in recommended]) / len(recommended) * 100, 1)
        }
    
    def create_skills_data(self, skills_data):
        """Create skills data for visualization"""
        categories = list(skills_data.keys())
        values = [len(skills_data[cat]) for cat in categories]
        
        return {
            "categories": categories,
            "values": values,
            "title": "Skills Distribution"
        }
    
    def generate_project_insights(self, projects):
        """Generate insights from project data"""
        all_technologies = []
        for project in projects:
            all_technologies.extend(project.get("technologies", []))
        
        tech_counts = Counter(all_technologies)
        
        return {
            "tech_distribution": tech_counts,
            "total_projects": len(projects),
            "unique_technologies": len(set(all_technologies))
        }
    
    def calculate_career_progression_score(self, work_experience):
        """Calculate a career progression score based on experience"""
        score = 0
        keywords = {
            "leadership": ["lead", "manage", "mentor", "direct", "coordinate"],
            "impact": ["improve", "increase", "optimize", "achieve", "develop"],
            "scale": ["200+", "650+", "500,000", "40%", "15%", "65%", "3.5x"],
            "innovation": ["AI", "develop", "pioneer", "build", "create"]
        }
        
        all_achievements = []
        for company in work_experience:
            for position in company["positions"]:
                all_achievements.extend(position["achievements"])
        
        text = " ".join(all_achievements).lower()
        
        for category, words in keywords.items():
            category_score = sum(1 for word in words if word.lower() in text)
            score += category_score
        
        return {
            "total_score": score,
            "leadership_indicators": sum(1 for word in keywords["leadership"] if word in text),
            "impact_indicators": sum(1 for word in keywords["impact"] if word in text),
            "scale_indicators": sum(1 for word in keywords["scale"] if word in text),
            "innovation_indicators": sum(1 for word in keywords["innovation"] if word in text)
        }
    
    def predict_skill_synergy(self, skill1, skill2):
        """Predict synergy between two skills"""
        synergies = {
            ("Python", "AI/ML"): 0.95,
            ("FastAPI", "Python"): 0.90,
            ("Streamlit", "Python"): 0.85,
            ("React.js", "JavaScript"): 0.90,
            ("PostgreSQL", "Python"): 0.80,
            ("NLP", "Python"): 0.90,
            ("Data Science", "Python"): 0.95
        }
        
        # Check direct synergy
        key = (skill1, skill2)
        reverse_key = (skill2, skill1)
        
        if key in synergies:
            return synergies[key]
        elif reverse_key in synergies:
            return synergies[reverse_key]
        else:
            # Generate random synergy for demonstration
            return round(random.uniform(0.3, 0.8), 2)