import streamlit as st
import requests
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import json
from datetime import datetime
import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data.resume_data import PERSONAL_INFO, EDUCATION, SKILLS, WORK_EXPERIENCE, PROJECTS
from utils.ai_tools import AITools

# Configure Streamlit page
st.set_page_config(
    page_title="Avni Girish - Portfolio",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for animations and styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
    
    .main-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        animation: fadeInUp 1s ease-out;
        text-align: center;
    }
    
    .section-header {
        color: #2c3e50;
        border-bottom: 3px solid #3498db;
        padding-bottom: 0.5rem;
        margin-bottom: 1.5rem;
        animation: slideInLeft 0.8s ease-out;
    }
    
    .skill-badge {
        background: linear-gradient(45deg, #3498db, #2c3e50);
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        margin: 0.2rem;
        display: inline-block;
        font-size: 0.9rem;
        animation: pulse 2s infinite;
    }
    
    .experience-card {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #3498db;
        animation: slideInRight 0.8s ease-out;
    }
    
    .project-card {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 15px;
        padding: 1.5rem;
        margin: 1rem 0;
        animation: zoomIn 0.8s ease-out;
    }
    
    .metric-card {
        background: white;
        border-radius: 10px;
        padding: 1rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        animation: bounceIn 1s ease-out;
    }
    
    .ai-insight {
        background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
        color: #2c3e50;
        animation: fadeIn 1.5s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .contact-form {
        background: white;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>
""", unsafe_allow_html=True)

# Initialize AI tools
ai_tools = AITools()

def main():
    # Sidebar navigation
    st.sidebar.image("https://via.placeholder.com/150x150/3498db/ffffff?text=AG", width=150)
    st.sidebar.title("Navigation")
    
    pages = {
        "🏠 Home": "home",
        "👨‍🎓 Education": "education", 
        "💼 Experience": "experience",
        "🚀 Projects": "projects",
        "🧠 AI Tools": "ai_tools",
        "📊 Analytics": "analytics",
        "📞 Contact": "contact"
    }
    
    selected_page = st.sidebar.selectbox("Choose a page:", list(pages.keys()))
    page = pages[selected_page]
    
    # Main content
    if page == "home":
        show_home_page()
    elif page == "education":
        show_education_page()
    elif page == "experience":
        show_experience_page()
    elif page == "projects":
        show_projects_page()
    elif page == "ai_tools":
        show_ai_tools_page()
    elif page == "analytics":
        show_analytics_page()
    elif page == "contact":
        show_contact_page()

def show_home_page():
    # Header
    st.markdown(f"""
    <div class="main-header">
        <h1>👋 Hello, I'm {PERSONAL_INFO['name']}</h1>
        <h3>Computer Science & Cognitive Science Student | AI/ML Enthusiast</h3>
        <p>{PERSONAL_INFO['location']} | {PERSONAL_INFO['email']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Quick stats
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class="metric-card">
            <h3>15+</h3>
            <p>Programming Languages & Tools</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="metric-card">
            <h3>4+</h3>
            <p>Work Experiences</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="metric-card">
            <h3>2+</h3>
            <p>Major Projects</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="metric-card">
            <h3>6+</h3>
            <p>Certifications</p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # About section
    st.markdown('<h2 class="section-header">About Me</h2>', unsafe_allow_html=True)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        <div class="ai-insight">
        <p>I'm a passionate Computer Science and Cognitive Science double major at Rutgers University, 
        specializing in AI/ML technologies and human-computer interaction. My experience spans from 
        research in cognitive development to building AI-powered applications at major financial institutions.</p>
        
        <p>I've worked on cutting-edge projects involving sentiment analysis, dynamic UI systems, and 
        data-driven insights that have impacted hundreds of users and students. My interdisciplinary 
        background allows me to bridge the gap between human cognition and artificial intelligence.</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown('<h4 class="section-header">Key Strengths</h4>', unsafe_allow_html=True)
        strengths = [
            "AI/ML Development",
            "Full-Stack Development", 
            "Research & Analytics",
            "Leadership & Mentoring",
            "Cross-functional Collaboration"
        ]
        for strength in strengths:
            st.markdown(f'<span class="skill-badge">{strength}</span>', unsafe_allow_html=True)

def show_education_page():
    st.markdown('<h1 class="section-header">🎓 Education</h1>', unsafe_allow_html=True)
    
    # University info
    st.markdown(f"""
    <div class="experience-card">
        <h3>{EDUCATION['university']}</h3>
        <p><strong>{EDUCATION['degree']}</strong></p>
        <p>📍 {EDUCATION['location']} | 🎓 {EDUCATION['graduation']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Coursework
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown('<h3 class="section-header">Relevant Coursework</h3>', unsafe_allow_html=True)
        for course in EDUCATION['coursework']:
            st.markdown(f"• {course}")
    
    with col2:
        st.markdown('<h3 class="section-header">Organizations</h3>', unsafe_allow_html=True)
        for org in EDUCATION['organizations']:
            st.markdown(f"• {org}")

def show_experience_page():
    st.markdown('<h1 class="section-header">💼 Work Experience</h1>', unsafe_allow_html=True)
    
    for company_data in WORK_EXPERIENCE:
        st.markdown(f"""
        <div class="experience-card">
            <h3>{company_data['company']}</h3>
            <p>📍 {company_data['location']}</p>
        """, unsafe_allow_html=True)
        
        for position in company_data['positions']:
            st.markdown(f"""
            <h4>{position['title']}</h4>
            <p><em>{position['period']}</em></p>
            <ul>
            """, unsafe_allow_html=True)
            
            for achievement in position['achievements']:
                st.markdown(f"<li>{achievement}</li>", unsafe_allow_html=True)
            
            st.markdown("</ul>", unsafe_allow_html=True)
        
        st.markdown("</div>", unsafe_allow_html=True)

def show_projects_page():
    st.markdown('<h1 class="section-header">🚀 Projects</h1>', unsafe_allow_html=True)
    
    for project in PROJECTS:
        st.markdown(f"""
        <div class="project-card">
            <h3>{project['name']}</h3>
            <p><em>{project['period']}</em></p>
        """, unsafe_allow_html=True)
        
        for desc in project['description']:
            st.markdown(f"<p>• {desc}</p>", unsafe_allow_html=True)
        
        st.markdown("<p><strong>Technologies:</strong></p>", unsafe_allow_html=True)
        tech_badges = " ".join([f'<span class="skill-badge">{tech}</span>' for tech in project['technologies']])
        st.markdown(tech_badges, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

def show_ai_tools_page():
    st.markdown('<h1 class="section-header">🧠 Interactive AI Tools</h1>', unsafe_allow_html=True)
    
    tab1, tab2, tab3 = st.tabs(["Sentiment Analysis", "Skill Recommendations", "Career Insights"])
    
    with tab1:
        st.markdown("### Text Sentiment Analysis")
        st.write("Enter any text to analyze its sentiment using NLP techniques!")
        
        text_input = st.text_area("Enter text to analyze:", 
                                 placeholder="Type your message here...")
        
        if st.button("Analyze Sentiment"):
            if text_input:
                result = ai_tools.analyze_sentiment(text_input)
                
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Sentiment", result['sentiment'].title())
                with col2:
                    st.metric("Polarity", f"{result['polarity']:.3f}")
                with col3:
                    st.metric("Subjectivity", f"{result['subjectivity']:.3f}")
                
                # Visualization
                fig = go.Figure(go.Indicator(
                    mode = "gauge+number",
                    value = result['polarity'],
                    domain = {'x': [0, 1], 'y': [0, 1]},
                    title = {'text': "Sentiment Polarity"},
                    gauge = {
                        'axis': {'range': [-1, 1]},
                        'bar': {'color': "darkblue"},
                        'steps': [
                            {'range': [-1, -0.1], 'color': "lightcoral"},
                            {'range': [-0.1, 0.1], 'color': "lightyellow"},
                            {'range': [0.1, 1], 'color': "lightgreen"}
                        ],
                        'threshold': {
                            'line': {'color': "red", 'width': 4},
                            'thickness': 0.75,
                            'value': 0.9
                        }
                    }
                ))
                fig.update_layout(height=400)
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("Please enter some text to analyze!")
    
    with tab2:
        st.markdown("### Skill Recommendations")
        
        target_role = st.selectbox("Select target role:", 
                                  ["Data Scientist", "Software Engineer", "AI Engineer"])
        
        if st.button("Get Recommendations"):
            all_skills = []
            for skill_category in SKILLS.values():
                all_skills.extend(skill_category)
            
            recommendations = ai_tools.generate_skill_recommendations(all_skills, target_role)
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("**Recommended Skills to Learn:**")
                for skill in recommendations['recommended_skills']:
                    st.markdown(f'<span class="skill-badge">{skill}</span>', unsafe_allow_html=True)
            
            with col2:
                st.markdown("**Your Matching Skills:**")
                for skill in recommendations['matching_skills']:
                    st.markdown(f'<span class="skill-badge">{skill}</span>', unsafe_allow_html=True)
            
            st.metric("Skills Match Percentage", f"{recommendations['match_percentage']}%")
    
    with tab3:
        st.markdown("### Career Progression Analysis")
        
        progression = ai_tools.calculate_career_progression_score(WORK_EXPERIENCE)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("Total Career Score", progression['total_score'])
            st.metric("Leadership Indicators", progression['leadership_indicators'])
        
        with col2:
            st.metric("Impact Indicators", progression['impact_indicators'])
            st.metric("Innovation Indicators", progression['innovation_indicators'])
        
        # Create progression chart
        categories = ['Leadership', 'Impact', 'Scale', 'Innovation']
        values = [
            progression['leadership_indicators'],
            progression['impact_indicators'], 
            progression['scale_indicators'],
            progression['innovation_indicators']
        ]
        
        fig = go.Figure(data=go.Scatterpolar(
            r=values,
            theta=categories,
            fill='toself',
            name='Career Progression'
        ))
        
        fig.update_layout(
            polar=dict(
                radialaxis=dict(
                    visible=True,
                    range=[0, max(values) + 1]
                )),
            showlegend=False,
            title="Career Progression Radar"
        )
        
        st.plotly_chart(fig, use_container_width=True)

def show_analytics_page():
    st.markdown('<h1 class="section-header">📊 Portfolio Analytics</h1>', unsafe_allow_html=True)
    
    # Skills distribution
    st.markdown("### Skills Distribution")
    skills_fig = ai_tools.create_skills_radar_chart(SKILLS)
    st.plotly_chart(skills_fig, use_container_width=True)
    
    # Project insights
    st.markdown("### Project Technology Analysis")
    insights = ai_tools.generate_project_insights(PROJECTS)
    st.plotly_chart(insights['chart'], use_container_width=True)
    
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Total Projects", insights['total_projects'])
    with col2:
        st.metric("Unique Technologies", insights['unique_technologies'])

def show_contact_page():
    st.markdown('<h1 class="section-header">📞 Contact Me</h1>', unsafe_allow_html=True)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        <div class="contact-form">
        """, unsafe_allow_html=True)
        
        st.markdown("### Get In Touch")
        
        with st.form("contact_form"):
            name = st.text_input("Your Name")
            email = st.text_input("Your Email")
            message = st.text_area("Your Message", height=150)
            
            submitted = st.form_submit_button("Send Message")
            
            if submitted:
                if name and email and message:
                    # Analyze sentiment of the message
                    sentiment_result = ai_tools.analyze_sentiment(message)
                    
                    st.success("Thank you for your message! I'll get back to you soon.")
                    st.info(f"Message sentiment: {sentiment_result['sentiment'].title()}")
                else:
                    st.error("Please fill in all fields.")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("### Connect With Me")
        
        contact_info = [
            f"📧 {PERSONAL_INFO['email']}",
            f"📱 {PERSONAL_INFO['phone']}",
            f"💼 {PERSONAL_INFO['linkedin']}",
            f"🐙 {PERSONAL_INFO['github']}",
            f"📍 {PERSONAL_INFO['location']}"
        ]
        
        for info in contact_info:
            st.markdown(f"<p>{info}</p>", unsafe_allow_html=True)

if __name__ == "__main__":
    main()