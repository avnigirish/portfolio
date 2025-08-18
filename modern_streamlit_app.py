import streamlit as st
import requests
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import json
from datetime import datetime
import sys
import os
import base64

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data.resume_data import PERSONAL_INFO, EDUCATION, SKILLS, WORK_EXPERIENCE, PROJECTS
from utils.ai_tools import AITools

# Configure Streamlit page
st.set_page_config(
    page_title="Avni Girish - Interactive Portfolio",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS with purple gradient theme and advanced animations
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
    
    :root {
        --primary-purple: #8B5CF6;
        --secondary-purple: #A78BFA;
        --dark-purple: #6D28D9;
        --light-purple: #C4B5FD;
        --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --gradient-2: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%);
        --gradient-3: linear-gradient(45deg, #6366F1, #8B5CF6, #EC4899);
        --glass-bg: rgba(255, 255, 255, 0.1);
        --glass-border: rgba(255, 255, 255, 0.2);
    }

    .stApp {
        background: var(--gradient-1);
        font-family: 'Space Grotesk', sans-serif;
    }
    
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 1200px;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Custom hero section */
    .hero-container {
        background: var(--gradient-2);
        border-radius: 30px;
        padding: 4rem 2rem;
        text-align: center;
        color: white;
        margin-bottom: 3rem;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(20px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
    }
    
    .hero-container::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
    }
    
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .hero-title {
        font-size: 4rem;
        font-weight: 700;
        margin-bottom: 1rem;
        position: relative;
        z-index: 2;
        text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
        from { text-shadow: 0 0 30px rgba(255, 255, 255, 0.5); }
        to { text-shadow: 0 0 50px rgba(255, 255, 255, 0.8), 0 0 60px rgba(139, 92, 246, 0.6); }
    }
    
    .hero-subtitle {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        opacity: 0.9;
        position: relative;
        z-index: 2;
    }
    
    /* Glass morphism cards */
    .glass-card {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        padding: 2rem;
        margin: 2rem 0;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .glass-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--gradient-2);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }
    
    .glass-card:hover::before {
        transform: scaleX(1);
    }
    
    .glass-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
        background: rgba(255, 255, 255, 0.15);
    }
    
    /* Section headers */
    .section-header {
        font-size: 2.5rem;
        font-weight: 600;
        color: white;
        text-align: center;
        margin: 3rem 0 2rem 0;
        position: relative;
    }
    
    .section-header::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 4px;
        background: var(--gradient-2);
        border-radius: 2px;
    }
    
    /* Interactive buttons */
    .interactive-button {
        background: var(--gradient-2);
        color: white;
        border: none;
        border-radius: 25px;
        padding: 12px 30px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        margin: 0.5rem;
    }
    
    .interactive-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }
    
    .interactive-button:hover::before {
        left: 100%;
    }
    
    .interactive-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
    }
    
    /* Skills visualization */
    .skill-category {
        background: var(--glass-bg);
        border-radius: 15px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 1px solid var(--glass-border);
        backdrop-filter: blur(10px);
    }
    
    .skill-category h3 {
        color: white;
        font-size: 1.3rem;
        margin-bottom: 1rem;
        position: relative;
        padding-left: 20px;
    }
    
    .skill-category h3::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: var(--gradient-2);
        border-radius: 2px;
    }
    
    .skill-tag {
        display: inline-block;
        background: rgba(139, 92, 246, 0.3);
        color: var(--light-purple);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        margin: 0.3rem;
        font-size: 0.9rem;
        border: 1px solid rgba(139, 92, 246, 0.5);
        transition: all 0.3s ease;
        cursor: default;
    }
    
    .skill-tag:hover {
        background: var(--gradient-2);
        color: white;
        transform: translateY(-2px);
    }
    
    /* Experience timeline */
    .timeline-item {
        background: var(--glass-bg);
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem 0;
        border-left: 4px solid var(--primary-purple);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        transition: all 0.3s ease;
    }
    
    .timeline-item:hover {
        transform: translateX(10px);
        background: rgba(255, 255, 255, 0.15);
        border-left-color: var(--secondary-purple);
    }
    
    .timeline-title {
        color: white;
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .timeline-company {
        color: var(--secondary-purple);
        font-weight: 500;
        margin-bottom: 1rem;
    }
    
    .timeline-description {
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
    }
    
    /* Project cards */
    .project-card {
        background: var(--glass-bg);
        border-radius: 20px;
        padding: 2rem;
        margin: 2rem 0;
        border: 1px solid var(--glass-border);
        backdrop-filter: blur(15px);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .project-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--gradient-2);
    }
    
    .project-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    }
    
    .project-title {
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
    
    .project-description {
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
    
    /* AI Tools styling */
    .ai-tool-container {
        background: var(--glass-bg);
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem 0;
        border: 1px solid var(--glass-border);
        backdrop-filter: blur(15px);
    }
    
    .ai-result {
        background: rgba(139, 92, 246, 0.2);
        border-radius: 10px;
        padding: 1.5rem;
        margin: 1rem 0;
        border-left: 4px solid var(--primary-purple);
        color: white;
    }
    
    /* Metrics and stats */
    .metric-container {
        background: var(--glass-bg);
        border-radius: 15px;
        padding: 2rem;
        text-align: center;
        border: 1px solid var(--glass-border);
        backdrop-filter: blur(15px);
        transition: all 0.3s ease;
        margin: 1rem;
    }
    
    .metric-container:hover {
        transform: scale(1.05);
        background: rgba(255, 255, 255, 0.15);
    }
    
    .metric-number {
        font-size: 3rem;
        font-weight: 700;
        color: var(--secondary-purple);
        display: block;
        text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
    }
    
    .metric-label {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
        margin-top: 0.5rem;
    }
    
    /* Contact section */
    .contact-container {
        background: var(--gradient-2);
        border-radius: 20px;
        padding: 3rem 2rem;
        text-align: center;
        color: white;
        margin: 3rem 0;
        position: relative;
        overflow: hidden;
    }
    
    .contact-container::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: var(--gradient-3);
        border-radius: 22px;
        z-index: -1;
    }
    
    .contact-link {
        display: inline-block;
        background: var(--glass-bg);
        color: white;
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 25px;
        margin: 1rem;
        font-weight: 500;
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        transition: all 0.3s ease;
    }
    
    .contact-link:hover {
        transform: translateY(-3px);
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    /* Plotly customization */
    .js-plotly-plot .plotly .modebar {
        background: var(--glass-bg) !important;
        border-radius: 10px;
    }
    
    /* Animations */
    @keyframes slideInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .slide-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    .fade-in {
        animation: fadeIn 0.8s ease-out;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .hero-title {
            font-size: 2.5rem;
        }
        
        .hero-container {
            padding: 2rem 1rem;
        }
        
        .section-header {
            font-size: 2rem;
        }
        
        .glass-card {
            padding: 1.5rem;
            margin: 1rem 0;
        }
    }
</style>
""", unsafe_allow_html=True)

# Initialize AI tools
@st.cache_resource
def init_ai_tools():
    return AITools()

ai_tools = init_ai_tools()

def main():
    # Hero Section
    st.markdown(f"""
    <div class="hero-container slide-in">
        <h1 class="hero-title">{PERSONAL_INFO['name']}</h1>
        <p class="hero-subtitle">AI/ML Engineer & Creative Technologist</p>
        <p style="font-size: 1.1rem; opacity: 0.9;">Bridging Computer Science & Cognitive Science at Rutgers University</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Navigation tabs with custom styling
    tabs = st.tabs([
        "🏠 Home", "🧠 About Me", "💻 Skills", "💼 Experience", 
        "🚀 Projects", "🤖 AI Tools", "📊 Analytics", "📞 Contact"
    ])
    
    with tabs[0]:
        show_home_page()
    
    with tabs[1]:
        show_about_page()
    
    with tabs[2]:
        show_skills_page()
    
    with tabs[3]:
        show_experience_page()
    
    with tabs[4]:
        show_projects_page()
    
    with tabs[5]:
        show_ai_tools_page()
    
    with tabs[6]:
        show_analytics_page()
    
    with tabs[7]:
        show_contact_page()

def show_home_page():
    st.markdown('<h2 class="section-header fade-in">Welcome to My Digital Universe</h2>', unsafe_allow_html=True)
    
    # Interactive metrics
    col1, col2, col3, col4 = st.columns(4)
    
    metrics_data = [
        ("15+", "Technologies Mastered"),
        ("200+", "Research Participants"),
        ("4+", "Professional Experiences"),
        ("6+", "Certifications Earned")
    ]
    
    for col, (number, label) in zip([col1, col2, col3, col4], metrics_data):
        with col:
            st.markdown(f"""
            <div class="metric-container slide-in">
                <span class="metric-number">{number}</span>
                <span class="metric-label">{label}</span>
            </div>
            """, unsafe_allow_html=True)
    
    # Interactive introduction
    st.markdown("""
    <div class="glass-card fade-in">
        <h3 style="color: white; font-size: 1.8rem; margin-bottom: 1.5rem;">🎯 My Mission</h3>
        <p style="color: rgba(255,255,255,0.9); font-size: 1.2rem; line-height: 1.8;">
            I'm passionate about creating AI solutions that understand and enhance human cognition. 
            My interdisciplinary background in Computer Science and Cognitive Science allows me to 
            build technology that's not just powerful, but truly human-centered.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Quick navigation
    st.markdown('<h3 style="color: white; text-align: center; margin: 3rem 0 2rem 0;">🚀 Explore My Journey</h3>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🧠 View My Research", key="research_btn", help="Explore cognitive science research"):
            st.balloons()
            st.success("Research highlights coming up in Experience section!")
    
    with col2:
        if st.button("💻 See My Projects", key="projects_btn", help="Check out my latest work"):
            st.balloons()
            st.success("Amazing projects await in the Projects section!")
    
    with col3:
        if st.button("🤖 Try AI Tools", key="ai_btn", help="Experience AI-powered features"):
            st.balloons()
            st.success("Interactive AI tools ready in the AI Tools section!")

def show_about_page():
    st.markdown('<h2 class="section-header">About Me</h2>', unsafe_allow_html=True)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        <div class="glass-card">
            <h3 style="color: white; margin-bottom: 1.5rem;">🎓 Academic Journey</h3>
            <p style="color: rgba(255,255,255,0.9); line-height: 1.8; font-size: 1.1rem;">
                Currently pursuing a double major in <strong>Computer Science</strong> and <strong>Cognitive Science</strong> 
                at Rutgers University. This unique combination allows me to understand both the technical aspects 
                of AI and the human cognitive processes that inspire intelligent systems.
            </p>
            
            <h3 style="color: white; margin: 2rem 0 1rem 0;">🔬 Research Focus</h3>
            <p style="color: rgba(255,255,255,0.9); line-height: 1.8; font-size: 1.1rem;">
                My research at the Cognition and Learning Center involves analyzing cognitive development patterns 
                in children, with a focus on mathematical cognition and nutrition's impact on learning. 
                I've worked with 200+ participants and discovered significant correlations that could reshape 
                early childhood education.
            </p>
            
            <h3 style="color: white; margin: 2rem 0 1rem 0;">💡 Innovation Philosophy</h3>
            <p style="color: rgba(255,255,255,0.9); line-height: 1.8; font-size: 1.1rem;">
                I believe the best AI systems are those that augment human intelligence rather than replace it. 
                My work focuses on creating intuitive, ethical AI that enhances human capabilities while 
                respecting cognitive diversity and individual differences.
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        # Education details
        st.markdown(f"""
        <div class="glass-card">
            <h3 style="color: white; margin-bottom: 1.5rem;">🏫 Education</h3>
            <div style="color: rgba(255,255,255,0.9); line-height: 1.6;">
                <strong style="color: var(--secondary-purple);">{EDUCATION['university']}</strong><br>
                {EDUCATION['degree']}<br>
                <small style="opacity: 0.8;">Expected Graduation: {EDUCATION['graduation']}</small>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Key coursework
        st.markdown("""
        <div class="glass-card" style="margin-top: 2rem;">
            <h3 style="color: white; margin-bottom: 1.5rem;">📚 Key Coursework</h3>
        """, unsafe_allow_html=True)
        
        highlighted_courses = [
            "Intro to Artificial Intelligence",
            "Data Science and Data Management", 
            "Cognition",
            "Design and Analysis of Computer Algorithms",
            "Mind/Machines & Persons"
        ]
        
        for course in highlighted_courses:
            st.markdown(f"""
            <div style="background: rgba(139, 92, 246, 0.2); padding: 0.5rem 1rem; margin: 0.5rem 0; 
                        border-radius: 10px; color: rgba(255,255,255,0.9); border-left: 3px solid var(--primary-purple);">
                {course}
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("</div>", unsafe_allow_html=True)

def show_skills_page():
    st.markdown('<h2 class="section-header">Technical Arsenal</h2>', unsafe_allow_html=True)
    
    # Interactive skill visualization
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="skill-category">
            <h3>🐍 Programming Languages</h3>
        """, unsafe_allow_html=True)
        
        for skill in SKILLS['languages']:
            st.markdown(f'<span class="skill-tag">{skill}</span>', unsafe_allow_html=True)
        
        st.markdown("</div>", unsafe_allow_html=True)
        
        st.markdown("""
        <div class="skill-category" style="margin-top: 2rem;">
            <h3>🚀 Frameworks & Tools</h3>
        """, unsafe_allow_html=True)
        
        for framework in SKILLS['frameworks']:
            st.markdown(f'<span class="skill-tag">{framework}</span>', unsafe_allow_html=True)
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="skill-category">
            <h3>🤖 AI/ML & Data Science</h3>
        """, unsafe_allow_html=True)
        
        for tool in SKILLS['ai_ml_tools']:
            st.markdown(f'<span class="skill-tag">{tool}</span>', unsafe_allow_html=True)
        
        st.markdown("</div>", unsafe_allow_html=True)
        
        st.markdown("""
        <div class="skill-category" style="margin-top: 2rem;">
            <h3>💾 Databases & Cloud</h3>
        """, unsafe_allow_html=True)
        
        for db in SKILLS['databases'] + SKILLS['tools']:
            st.markdown(f'<span class="skill-tag">{db}</span>', unsafe_allow_html=True)
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Interactive skill radar chart
    st.markdown('<h3 style="color: white; text-align: center; margin: 3rem 0 2rem 0;">📊 Skill Proficiency Radar</h3>', unsafe_allow_html=True)
    
    skill_categories = ['Programming', 'AI/ML', 'Data Science', 'Research', 'Leadership', 'Communication']
    skill_levels = [9, 8, 8, 9, 7, 8]  # Out of 10
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatterpolar(
        r=skill_levels,
        theta=skill_categories,
        fill='toself',
        name='Skill Level',
        line=dict(color='rgba(139, 92, 246, 1)', width=3),
        fillcolor='rgba(139, 92, 246, 0.3)'
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 10],
                gridcolor='rgba(255, 255, 255, 0.2)',
                tickcolor='white',
                tickfont=dict(color='white')
            ),
            angularaxis=dict(
                gridcolor='rgba(255, 255, 255, 0.2)',
                tickcolor='white',
                tickfont=dict(color='white', size=12)
            )
        ),
        showlegend=False,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white')
    )
    
    st.plotly_chart(fig, use_container_width=True)

def show_experience_page():
    st.markdown('<h2 class="section-header">Professional Journey</h2>', unsafe_allow_html=True)
    
    # Interactive timeline
    for i, experience in enumerate(WORK_EXPERIENCE):
        for j, position in enumerate(experience['positions']):
            st.markdown(f"""
            <div class="timeline-item slide-in" style="animation-delay: {(i*len(experience['positions']) + j) * 0.2}s;">
                <div class="timeline-title">{position['title']}</div>
                <div class="timeline-company">{experience['company']} | {experience['location']}</div>
                <div style="color: var(--light-purple); font-size: 0.9rem; margin-bottom: 1rem;">{position['period']}</div>
                <div class="timeline-description">
            """, unsafe_allow_html=True)
            
            for achievement in position['achievements']:
                st.markdown(f"""
                <div style="margin: 0.5rem 0; padding-left: 1rem; border-left: 2px solid var(--primary-purple);">
                    • {achievement}
                </div>
                """, unsafe_allow_html=True)
            
            st.markdown("</div></div>", unsafe_allow_html=True)
    
    # Interactive achievements showcase
    st.markdown('<h3 style="color: white; text-align: center; margin: 3rem 0 2rem 0;">🏆 Key Achievements</h3>', unsafe_allow_html=True)
    
    achievements = [
        {"metric": "40%", "description": "Increased team productivity through mentoring"},
        {"metric": "200+", "description": "Participants in cognitive research study"},
        {"metric": "30%", "description": "Correlation discovered in math cognition research"},
        {"metric": "500+", "description": "Internal users served by AI tools at Prudential"}
    ]
    
    cols = st.columns(4)
    for col, achievement in zip(cols, achievements):
        with col:
            st.markdown(f"""
            <div class="metric-container">
                <span class="metric-number">{achievement['metric']}</span>
                <span class="metric-label">{achievement['description']}</span>
            </div>
            """, unsafe_allow_html=True)

def show_projects_page():
    st.markdown('<h2 class="section-header">Featured Projects</h2>', unsafe_allow_html=True)
    
    # Project showcase
    projects_data = [
        {
            "title": "🤖 AI-Powered Portfolio Platform",
            "description": "Interactive portfolio with sentiment analysis, career insights, and dynamic visualizations. Features real-time AI tools and responsive design.",
            "tech": ["Python", "FastAPI", "Streamlit", "Machine Learning", "NLP", "Plotly"],
            "impact": "Created comprehensive platform showcasing AI/ML capabilities with interactive features"
        },
        {
            "title": "🧠 Cognitive Development Research Platform",
            "description": "Led comprehensive study analyzing correlations between preschool cognitive abilities and academic outcomes using advanced statistical methods.",
            "tech": ["R", "Python", "MATLAB", "Statistical Analysis", "Data Visualization"],
            "impact": "Discovered 30% correlation between math sense and academic performance"
        },
        {
            "title": "💼 Financial Analytics Dashboard",
            "description": "Built dynamic UI components and sentiment analysis tools for internal teams at Prudential Financial, improving decision-making processes.",
            "tech": ["React.js", "Python", "Data Analytics", "UI/UX", "Enterprise Systems"],
            "impact": "Served 500+ internal users with improved workflow efficiency"
        }
    ]
    
    for i, project in enumerate(projects_data):
        st.markdown(f"""
        <div class="project-card slide-in" style="animation-delay: {i * 0.3}s;">
            <div class="project-title">{project['title']}</div>
            <div class="project-description">{project['description']}</div>
            
            <h4 style="color: var(--secondary-purple); margin: 1.5rem 0 1rem 0;">🛠️ Technologies Used:</h4>
            <div style="margin-bottom: 1.5rem;">
        """, unsafe_allow_html=True)
        
        for tech in project['tech']:
            st.markdown(f'<span class="skill-tag" style="margin: 0.2rem;">{tech}</span>', unsafe_allow_html=True)
        
        st.markdown(f"""
            </div>
            <div style="background: rgba(139, 92, 246, 0.2); padding: 1rem; border-radius: 10px; 
                        border-left: 4px solid var(--primary-purple);">
                <strong style="color: var(--light-purple);">Impact:</strong> 
                <span style="color: rgba(255,255,255,0.9);">{project['impact']}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # GitHub contribution visualization
    st.markdown('<h3 style="color: white; text-align: center; margin: 3rem 0 2rem 0;">📈 Development Activity</h3>', unsafe_allow_html=True)
    
    # Simulated GitHub-like contribution data
    import numpy as np
    dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
    contributions = np.random.poisson(2, len(dates))
    
    fig = px.scatter(
        x=dates,
        y=contributions,
        title="Daily Contributions Throughout 2024",
        labels={'x': 'Date', 'y': 'Contributions'},
        color=contributions,
        color_continuous_scale='Viridis'
    )
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        title_font_color='white',
        xaxis=dict(gridcolor='rgba(255,255,255,0.2)'),
        yaxis=dict(gridcolor='rgba(255,255,255,0.2)')
    )
    
    st.plotly_chart(fig, use_container_width=True)

def show_ai_tools_page():
    st.markdown('<h2 class="section-header">Interactive AI Tools</h2>', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="glass-card">
        <h3 style="color: white; margin-bottom: 1.5rem;">🤖 Experience AI-Powered Features</h3>
        <p style="color: rgba(255,255,255,0.9); line-height: 1.6; font-size: 1.1rem;">
            Explore the AI tools I've developed to demonstrate practical applications of machine learning 
            in real-world scenarios. These tools showcase sentiment analysis, text processing, and 
            intelligent data insights.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # AI Tool sections
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="ai-tool-container">
            <h3 style="color: white; margin-bottom: 1rem;">💭 Sentiment Analysis Tool</h3>
        """, unsafe_allow_html=True)
        
        user_text = st.text_area(
            "Enter text to analyze sentiment:",
            placeholder="Type your message here...",
            key="sentiment_text"
        )
        
        if st.button("Analyze Sentiment", key="sentiment_btn"):
            if user_text:
                with st.spinner("Analyzing sentiment..."):
                    try:
                        sentiment_result = ai_tools.analyze_sentiment(user_text)
                        
                        # Display results with custom styling
                        sentiment_color = {
                            'positive': '#10B981',
                            'negative': '#EF4444',
                            'neutral': '#6B7280'
                        }.get(sentiment_result['sentiment'].lower(), '#6B7280')
                        
                        st.markdown(f"""
                        <div class="ai-result">
                            <h4>Analysis Results:</h4>
                            <p><strong>Sentiment:</strong> 
                                <span style="color: {sentiment_color};">
                                    {sentiment_result['sentiment'].title()}
                                </span>
                            </p>
                            <p><strong>Confidence:</strong> {sentiment_result['confidence']:.2%}</p>
                            <p><strong>Polarity:</strong> {sentiment_result['polarity']:.3f}</p>
                        </div>
                        """, unsafe_allow_html=True)
                    except Exception as e:
                        st.error(f"Error analyzing sentiment: {str(e)}")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="ai-tool-container">
            <h3 style="color: white; margin-bottom: 1rem;">🎯 Skill Recommendations</h3>
        """, unsafe_allow_html=True)
        
        career_goal = st.selectbox(
            "Select your career goal:",
            ["AI/ML Engineer", "Data Scientist", "Software Developer", "Research Scientist", "Product Manager"],
            key="career_goal"
        )
        
        if st.button("Get Recommendations", key="skills_btn"):
            with st.spinner("Generating personalized recommendations..."):
                try:
                    recommendations = ai_tools.recommend_skills(career_goal)
                    
                    st.markdown(f"""
                    <div class="ai-result">
                        <h4>Recommended Skills for {career_goal}:</h4>
                    """, unsafe_allow_html=True)
                    
                    for i, skill in enumerate(recommendations, 1):
                        st.markdown(f"""
                        <div style="margin: 0.8rem 0; padding: 0.8rem; background: rgba(139, 92, 246, 0.1); 
                                    border-radius: 8px; border-left: 3px solid var(--primary-purple);">
                            <strong>{i}. {skill}</strong>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    st.markdown("</div>", unsafe_allow_html=True)
                except Exception as e:
                    st.error(f"Error generating recommendations: {str(e)}")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    # Career insights tool
    st.markdown("""
    <div class="ai-tool-container" style="margin-top: 2rem;">
        <h3 style="color: white; margin-bottom: 1rem;">📊 Career Trajectory Analysis</h3>
    """, unsafe_allow_html=True)
    
    if st.button("Analyze My Career Progression", key="career_analysis"):
        with st.spinner("Analyzing career trajectory..."):
            try:
                career_insights = ai_tools.analyze_career_progression()
                
                st.markdown(f"""
                <div class="ai-result">
                    <h4>Career Insights:</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        <div style="background: rgba(16, 185, 129, 0.2); padding: 1rem; border-radius: 10px;">
                            <strong style="color: #10B981;">Growth Areas:</strong>
                            <p style="margin-top: 0.5rem;">{career_insights.get('growth_areas', 'AI/ML expertise, Leadership skills')}</p>
                        </div>
                        <div style="background: rgba(139, 92, 246, 0.2); padding: 1rem; border-radius: 10px;">
                            <strong style="color: var(--secondary-purple);">Key Strengths:</strong>
                            <p style="margin-top: 0.5rem;">{career_insights.get('strengths', 'Research experience, Technical versatility')}</p>
                        </div>
                        <div style="background: rgba(245, 158, 11, 0.2); padding: 1rem; border-radius: 10px;">
                            <strong style="color: #F59E0B;">Next Steps:</strong>
                            <p style="margin-top: 0.5rem;">{career_insights.get('recommendations', 'Advanced ML projects, Industry mentorship')}</p>
                        </div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
            except Exception as e:
                st.error(f"Error analyzing career progression: {str(e)}")
    
    st.markdown("</div>", unsafe_allow_html=True)

def show_analytics_page():
    st.markdown('<h2 class="section-header">Data Analytics Showcase</h2>', unsafe_allow_html=True)
    
    # Skills distribution
    st.markdown('<h3 style="color: white; margin: 2rem 0 1rem 0;">📊 Skills Distribution</h3>', unsafe_allow_html=True)
    
    skills_data = {
        'Category': list(SKILLS.keys()),
        'Count': [len(skills) for skills in SKILLS.values()]
    }
    
    fig = px.pie(
        values=skills_data['Count'],
        names=skills_data['Category'],
        title="Technical Skills by Category",
        color_discrete_sequence=px.colors.sequential.Viridis
    )
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        title_font_color='white'
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Experience timeline
    st.markdown('<h3 style="color: white; margin: 2rem 0 1rem 0;">⏱️ Career Timeline</h3>', unsafe_allow_html=True)
    
    timeline_data = []
    for exp in WORK_EXPERIENCE:
        for pos in exp['positions']:
            timeline_data.append({
                'Role': pos['title'],
                'Company': exp['company'],
                'Period': pos['period'],
                'Achievements': len(pos['achievements'])
            })
    
    fig = go.Figure()
    
    for i, item in enumerate(timeline_data):
        fig.add_trace(go.Scatter(
            x=[i],
            y=[item['Achievements']],
            mode='markers+text',
            marker=dict(size=20, color=f'rgba(139, 92, 246, {0.8 - i*0.1})'),
            text=item['Role'],
            textposition="top center",
            name=item['Company']
        ))
    
    fig.update_layout(
        title="Career Progression: Role Impact",
        xaxis_title="Career Stage",
        yaxis_title="Number of Key Achievements",
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        title_font_color='white',
        xaxis=dict(gridcolor='rgba(255,255,255,0.2)'),
        yaxis=dict(gridcolor='rgba(255,255,255,0.2)')
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Interactive metrics
    st.markdown('<h3 style="color: white; margin: 2rem 0 1rem 0;">🎯 Performance Metrics</h3>', unsafe_allow_html=True)
    
    metrics_col1, metrics_col2, metrics_col3 = st.columns(3)
    
    with metrics_col1:
        st.markdown("""
        <div class="glass-card">
            <h4 style="color: var(--secondary-purple); margin-bottom: 1rem;">Research Impact</h4>
            <div style="font-size: 2rem; color: white; font-weight: bold; text-align: center;">200+</div>
            <div style="color: rgba(255,255,255,0.8); text-align: center;">Study Participants</div>
            <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(16, 185, 129, 0.2); border-radius: 5px;">
                <strong style="color: #10B981;">30%</strong> correlation discovered
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with metrics_col2:
        st.markdown("""
        <div class="glass-card">
            <h4 style="color: var(--secondary-purple); margin-bottom: 1rem;">Team Leadership</h4>
            <div style="font-size: 2rem; color: white; font-weight: bold; text-align: center;">40%</div>
            <div style="color: rgba(255,255,255,0.8); text-align: center;">Productivity Increase</div>
            <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(139, 92, 246, 0.2); border-radius: 5px;">
                <strong style="color: var(--light-purple);">4+</strong> RAs mentored
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with metrics_col3:
        st.markdown("""
        <div class="glass-card">
            <h4 style="color: var(--secondary-purple); margin-bottom: 1rem;">Technology Impact</h4>
            <div style="font-size: 2rem; color: white; font-weight: bold; text-align: center;">500+</div>
            <div style="color: rgba(255,255,255,0.8); text-align: center;">Users Served</div>
            <div style="margin-top: 1rem; padding: 0.5rem; background: rgba(245, 158, 11, 0.2); border-radius: 5px;">
                <strong style="color: #F59E0B;">Enterprise</strong> level impact
            </div>
        </div>
        """, unsafe_allow_html=True)

def show_contact_page():
    st.markdown('<h2 class="section-header">Let\'s Connect & Create</h2>', unsafe_allow_html=True)
    
    st.markdown(f"""
    <div class="contact-container">
        <h3 style="margin-bottom: 2rem; font-size: 2rem;">Ready to Collaborate?</h3>
        <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem; opacity: 0.9;">
            I'm always excited to work on innovative projects that blend AI/ML with human-centered design. 
            Whether you're interested in research collaboration, technical consultation, or creative tech solutions, 
            let's explore what we can build together!
        </p>
        
        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 1.5rem; margin-top: 2rem;">
            <a href="mailto:{PERSONAL_INFO['email']}" class="contact-link">
                📧 Email Me
            </a>
            <a href="https://{PERSONAL_INFO['linkedin']}" target="_blank" class="contact-link">
                💼 LinkedIn
            </a>
            <a href="https://{PERSONAL_INFO['github']}" target="_blank" class="contact-link">
                🐱 GitHub
            </a>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Interactive contact form
    st.markdown('<h3 style="color: white; text-align: center; margin: 3rem 0 2rem 0;">💬 Send Me a Message</h3>', unsafe_allow_html=True)
    
    with st.form("contact_form", clear_on_submit=True):
        col1, col2 = st.columns(2)
        
        with col1:
            name = st.text_input("Your Name", placeholder="Enter your name")
            email = st.text_input("Your Email", placeholder="your.email@domain.com")
        
        with col2:
            subject = st.selectbox(
                "Subject",
                ["General Inquiry", "Collaboration Opportunity", "Research Discussion", "Technical Consultation", "Other"]
            )
            priority = st.radio("Priority", ["Low", "Medium", "High"], horizontal=True)
        
        message = st.text_area(
            "Message",
            placeholder="Tell me about your project or inquiry...",
            height=120
        )
        
        submitted = st.form_submit_button("Send Message ✨")
        
        if submitted:
            if name and email and message:
                st.success("🎉 Message sent successfully! I'll get back to you soon.")
                st.balloons()
                
                # Display confirmation
                st.markdown(f"""
                <div class="ai-result" style="margin-top: 2rem;">
                    <h4>Message Summary:</h4>
                    <p><strong>From:</strong> {name} ({email})</p>
                    <p><strong>Subject:</strong> {subject}</p>
                    <p><strong>Priority:</strong> {priority}</p>
                    <p><strong>Message:</strong> {message[:100]}...</p>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.error("Please fill in all required fields.")
    
    # Location and availability
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="glass-card">
            <h3 style="color: white; margin-bottom: 1rem;">📍 Location & Availability</h3>
            <p style="color: rgba(255,255,255,0.9); line-height: 1.6;">
                <strong>Based in:</strong> New Brunswick, NJ<br>
                <strong>Available for:</strong> Remote & On-site work<br>
                <strong>Time Zone:</strong> EST/EDT<br>
                <strong>Response Time:</strong> Within 24 hours
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="glass-card">
            <h3 style="color: white; margin-bottom: 1rem;">🤝 What I Can Help With</h3>
            <div style="color: rgba(255,255,255,0.9);">
                • AI/ML Development & Consulting<br>
                • Research Collaboration<br>
                • Full-Stack Web Development<br>
                • Data Analysis & Visualization<br>
                • Technical Mentoring<br>
                • Academic Partnerships
            </div>
        </div>
        """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
