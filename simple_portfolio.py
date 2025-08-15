"""
Simplified Portfolio App - Basic HTML version
This version runs without external dependencies
"""

import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data.resume_data import PERSONAL_INFO, EDUCATION, SKILLS, WORK_EXPERIENCE, PROJECTS, CERTIFICATIONS, AWARDS
from utils.ai_tools import AITools

def generate_html_portfolio():
    """Generate a static HTML portfolio"""
    ai_tools = AITools()
    
    # Calculate some basic stats
    all_skills = []
    for skill_category in SKILLS.values():
        all_skills.extend(skill_category)
    
    total_achievements = 0
    for company in WORK_EXPERIENCE:
        for position in company["positions"]:
            total_achievements += len(position["achievements"])
    
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{PERSONAL_INFO['name']} - Portfolio</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }}
        
        .hero {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 0;
            text-align: center;
            animation: fadeInUp 1s ease-out;
        }}
        
        .hero h1 {{
            font-size: 3rem;
            margin-bottom: 1rem;
        }}
        
        .hero p {{
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }}
        
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            padding: 3rem 0;
        }}
        
        .stat-card {{
            background: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            animation: bounceIn 1s ease-out;
        }}
        
        .stat-card h3 {{
            font-size: 2.5rem;
            color: #667eea;
            margin-bottom: 0.5rem;
        }}
        
        .section {{
            padding: 3rem 0;
            background: white;
            margin: 2rem 0;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }}
        
        .section h2 {{
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.5rem;
            margin-bottom: 2rem;
            animation: slideInLeft 0.8s ease-out;
        }}
        
        .skills-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }}
        
        .skill-category {{
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }}
        
        .skill-badge {{
            background: linear-gradient(45deg, #3498db, #2c3e50);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            margin: 0.2rem;
            display: inline-block;
            font-size: 0.9rem;
            animation: pulse 2s infinite;
        }}
        
        .experience-card {{
            background: white;
            border-radius: 10px;
            padding: 2rem;
            margin: 1rem 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #3498db;
            animation: slideInRight 0.8s ease-out;
        }}
        
        .project-card {{
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            padding: 2rem;
            margin: 1rem 0;
            animation: zoomIn 0.8s ease-out;
        }}
        
        .ai-demo {{
            background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
            border-radius: 10px;
            padding: 2rem;
            margin: 1rem 0;
        }}
        
        .sentiment-input {{
            width: 100%;
            padding: 1rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 1rem;
        }}
        
        .btn {{
            background: linear-gradient(45deg, #3498db, #2c3e50);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.3s;
        }}
        
        .btn:hover {{
            transform: translateY(-2px);
        }}
        
        .result-box {{
            background: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            display: none;
        }}
        
        @keyframes fadeInUp {{
            from {{
                opacity: 0;
                transform: translateY(30px);
            }}
            to {{
                opacity: 1;
                transform: translateY(0);
            }}
        }}
        
        @keyframes slideInLeft {{
            from {{
                opacity: 0;
                transform: translateX(-30px);
            }}
            to {{
                opacity: 1;
                transform: translateX(0);
            }}
        }}
        
        @keyframes slideInRight {{
            from {{
                opacity: 0;
                transform: translateX(30px);
            }}
            to {{
                opacity: 1;
                transform: translateX(0);
            }}
        }}
        
        @keyframes pulse {{
            0% {{
                transform: scale(1);
            }}
            50% {{
                transform: scale(1.05);
            }}
            100% {{
                transform: scale(1);
            }}
        }}
        
        @keyframes zoomIn {{
            from {{
                opacity: 0;
                transform: scale(0.9);
            }}
            to {{
                opacity: 1;
                transform: scale(1);
            }}
        }}
        
        @keyframes bounceIn {{
            0% {{
                opacity: 0;
                transform: scale(0.3);
            }}
            50% {{
                transform: scale(1.05);
            }}
            70% {{
                transform: scale(0.9);
            }}
            100% {{
                opacity: 1;
                transform: scale(1);
            }}
        }}
        
        .contact-links {{
            background: #2c3e50;
            color: white;
            padding: 2rem 0;
            text-align: center;
        }}
        
        .contact-links a {{
            color: #3498db;
            text-decoration: none;
            margin: 0 1rem;
            font-size: 1.1rem;
        }}
        
        .contact-links a:hover {{
            color: #84fab0;
        }}
    </style>
</head>
<body>
    <div class="hero">
        <div class="container">
            <h1>👋 Hello, I'm {PERSONAL_INFO['name']}</h1>
            <p>Computer Science & Cognitive Science Student | AI/ML Enthusiast</p>
            <p>📍 {PERSONAL_INFO['location']} | 📧 {PERSONAL_INFO['email']}</p>
        </div>
    </div>
    
    <div class="container">
        <div class="stats">
            <div class="stat-card">
                <h3>{len(all_skills)}</h3>
                <p>Technical Skills</p>
            </div>
            <div class="stat-card">
                <h3>{len(WORK_EXPERIENCE)}</h3>
                <p>Work Experiences</p>
            </div>
            <div class="stat-card">
                <h3>{len(PROJECTS)}</h3>
                <p>Major Projects</p>
            </div>
            <div class="stat-card">
                <h3>{len(CERTIFICATIONS)}</h3>
                <p>Certifications</p>
            </div>
        </div>
        
        <div class="section">
            <div class="container">
                <h2>🎓 Education</h2>
                <div class="experience-card">
                    <h3>{EDUCATION['university']}</h3>
                    <p><strong>{EDUCATION['degree']}</strong></p>
                    <p>📍 {EDUCATION['location']} | 🎓 {EDUCATION['graduation']}</p>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="container">
                <h2>🛠️ Skills</h2>
                <div class="skills-grid">
    """
    
    # Add skills sections
    for category, skill_list in SKILLS.items():
        html += f"""
                    <div class="skill-category">
                        <h3>{category.replace('_', ' ').title()}</h3>
                        <div>
        """
        for skill in skill_list:
            html += f'<span class="skill-badge">{skill}</span>'
        html += """
                        </div>
                    </div>
        """
    
    html += """
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="container">
                <h2>💼 Work Experience</h2>
    """
    
    # Add work experience
    for company_data in WORK_EXPERIENCE:
        html += f"""
                <div class="experience-card">
                    <h3>{company_data['company']}</h3>
                    <p>📍 {company_data['location']}</p>
        """
        
        for position in company_data['positions']:
            html += f"""
                    <h4>{position['title']}</h4>
                    <p><em>{position['period']}</em></p>
                    <ul>
            """
            
            for achievement in position['achievements']:
                html += f"<li>{achievement}</li>"
            
            html += "</ul>"
        
        html += "</div>"
    
    html += """
            </div>
        </div>
        
        <div class="section">
            <div class="container">
                <h2>🚀 Projects</h2>
    """
    
    # Add projects
    for project in PROJECTS:
        html += f"""
                <div class="project-card">
                    <h3>{project['name']}</h3>
                    <p><em>{project['period']}</em></p>
        """
        
        for desc in project['description']:
            html += f"<p>• {desc}</p>"
        
        html += "<p><strong>Technologies:</strong></p><div>"
        for tech in project['technologies']:
            html += f'<span class="skill-badge">{tech}</span>'
        html += "</div></div>"
    
    html += """
            </div>
        </div>
        
        <div class="section">
            <div class="container">
                <h2>🧠 AI Demo: Sentiment Analysis</h2>
                <div class="ai-demo">
                    <h3>Try the Sentiment Analysis Tool</h3>
                    <p>Enter some text below and click "Analyze" to see AI-powered sentiment analysis in action!</p>
                    <textarea class="sentiment-input" id="sentimentText" placeholder="Type your message here..." rows="4"></textarea>
                    <button class="btn" onclick="analyzeSentiment()">Analyze Sentiment</button>
                    <div class="result-box" id="sentimentResult">
                        <h4>Analysis Result:</h4>
                        <p id="sentimentOutput"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """
    
    # Add contact section
    html += f"""
    <div class="contact-links">
        <div class="container">
            <h2>Connect With Me</h2>
            <p>
                <a href="mailto:{PERSONAL_INFO['email']}">Email</a>
                <a href="https://{PERSONAL_INFO['linkedin']}">LinkedIn</a>
                <a href="https://{PERSONAL_INFO['github']}">GitHub</a>
            </p>
        </div>
    </div>
    
    <script>
        function analyzeSentiment() {{
            const text = document.getElementById('sentimentText').value;
            if (!text.trim()) {{
                alert('Please enter some text to analyze!');
                return;
            }}
            
            // Simple client-side sentiment analysis
            const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love', 'like', 'happy', 'excited'];
            const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad', 'angry', 'disappointed'];
            
            const words = text.toLowerCase().match(/\\b\\w+\\b/g) || [];
            const positiveCount = words.filter(word => positiveWords.includes(word)).length;
            const negativeCount = words.filter(word => negativeWords.includes(word)).length;
            
            let sentiment = 'neutral';
            let polarity = (positiveCount - negativeCount) / Math.max(words.length, 1);
            
            if (polarity > 0.1) sentiment = 'positive';
            else if (polarity < -0.1) sentiment = 'negative';
            
            const resultBox = document.getElementById('sentimentResult');
            const output = document.getElementById('sentimentOutput');
            
            output.innerHTML = `
                <strong>Sentiment:</strong> ` + sentiment.toUpperCase() + ` <br>
                <strong>Polarity Score:</strong> ` + polarity.toFixed(3) + ` <br>
                <strong>Positive words found:</strong> ` + positiveCount + ` <br>
                <strong>Negative words found:</strong> ` + negativeCount + `
            `;
            
            resultBox.style.display = 'block';
            resultBox.style.borderLeft = `4px solid ` + (sentiment === 'positive' ? '#2ecc71' : sentiment === 'negative' ? '#e74c3c' : '#f39c12');
        }}
    </script>
</body>
</html>
    """
    
    return html

if __name__ == "__main__":
    # Generate and save the HTML portfolio
    html_content = generate_html_portfolio()
    
    with open('/home/runner/work/portfolio/portfolio/portfolio.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Portfolio generated successfully!")
    print("Open 'portfolio.html' in your browser to view the portfolio.")
    print("\nFeatures included:")
    print("- Responsive design with animations")
    print("- Interactive AI sentiment analysis tool")
    print("- Complete resume information")
    print("- Modern styling with gradients")
    print("- Contact information and links")