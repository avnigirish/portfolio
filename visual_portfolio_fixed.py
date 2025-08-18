import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import sys
import os
import time
import random
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
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

# Initialize AI tools
@st.cache_resource
def init_ai_tools():
    return AITools()

ai_tools = init_ai_tools()

# Modern CSS for clean design
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
    
    .stApp {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .main .block-container {
        padding: 1rem;
        max-width: 1200px;
    }
    
    /* Hide default elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stDeployButton {display:none;}
    .stDecoration {display:none;}
    
    /* Clean hero section */
    .hero-container {
        background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%);
        border-radius: 16px;
        padding: 3rem 2rem;
        text-align: center;
        color: white;
        margin-bottom: 2rem;
        box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }
    
    .hero-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        letter-spacing: -0.02em;
    }
    
    .hero-subtitle {
        font-size: 1.2rem;
        font-weight: 400;
        opacity: 0.9;
        letter-spacing: 0.01em;
    }
    
    /* Section headers */
    .section-header {
        font-size: 2rem;
        font-weight: 600;
        color: white;
        margin: 2rem 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid rgba(255,255,255,0.2);
        letter-spacing: -0.01em;
    }
    
    /* Cards */
    .demo-container, .experience-card, .project-card {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }
    
    .demo-container:hover, .experience-card:hover, .project-card:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }
    
    /* Timeline */
    .timeline-item {
        background: rgba(255, 255, 255, 0.1);
        border-left: 3px solid #F59E0B;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1rem 0;
        backdrop-filter: blur(10px);
    }
    
    .company-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .company-logo {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        margin-right: 1rem;
        background: white;
        padding: 8px;
    }
    
    .position-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: white;
        margin-bottom: 0.25rem;
    }
    
    .position-period {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 1rem;
    }
    
    .skill-tag {
        display: inline-block;
        background: rgba(139, 92, 246, 0.8);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        margin: 0.2rem 0.2rem 0.2rem 0;
    }
    
    /* Clean buttons */
    .stButton > button {
        background: linear-gradient(135deg, #8B5CF6, #EC4899);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }
    
    /* Text areas and inputs */
    .stTextArea textarea {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: white;
    }
    
    /* Clean plotly charts */
    .js-plotly-plot {
        border-radius: 12px;
        overflow: hidden;
    }
</style>""", unsafe_allow_html=True)

def create_company_logo_3d(company_name):
    """Create a 3D visualization for company logos"""
    # Company logo data mapping
    logo_data = {
        "Rutgers University-New Brunswick": {"color": "#cc0033", "symbol": "R"},
        "BNY": {"color": "#0066cc", "symbol": "BNY"},
        "New Jersey Economic Development Authority (NJEDA)": {"color": "#009639", "symbol": "NJ"},
        "Accenture": {"color": "#a100ff", "symbol": "A"},
        "Rutgers University Programming Association": {"color": "#cc0033", "symbol": "R"},
        "Morgan Stanley": {"color": "#001a4d", "symbol": "MS"},
        "Lead Up Academy | Rutgers University-New Brunswick": {"color": "#f59e0b", "symbol": "L"},
        "Blueprint": {"color": "#3b82f6", "symbol": "B"}
    }
    
    logo_info = logo_data.get(company_name, {"color": "#6b7280", "symbol": "?"})
    
    # Create 3D scatter plot for logo
    fig = go.Figure(data=[go.Scatter3d(
        x=[0], y=[0], z=[0],
        mode='markers+text',
        marker=dict(
            size=30,
            color=logo_info["color"],
            opacity=0.8,
            line=dict(width=2, color='white')
        ),
        text=[logo_info["symbol"]],
        textfont=dict(size=16, color='white'),
        textposition="middle center",
        showlegend=False
    )])
    
    fig.update_layout(
        scene=dict(
            xaxis=dict(visible=False),
            yaxis=dict(visible=False),
            zaxis=dict(visible=False),
            camera=dict(eye=dict(x=0, y=0, z=1.5))
        ),
        margin=dict(l=0, r=0, t=0, b=0),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        width=60,
        height=60
    )
    
    return fig

def create_animated_metric(value, label):
    """Create an animated metric display"""
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown(f"""
        <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.1); 
                    border-radius: 15px; margin: 0.5rem 0; backdrop-filter: blur(10px);">
            <div style="font-size: 2.5rem; font-weight: 700; color: #F59E0B; margin: 0;">{value}</div>
            <div style="font-size: 1rem; color: rgba(255,255,255,0.8); margin-top: 0.5rem;">{label}</div>
        </div>
        """, unsafe_allow_html=True)

def sentiment_analysis_demo():
    """Interactive sentiment analysis demo"""
    st.markdown('<div class="section-header">AI Sentiment Analysis Demo</div>', unsafe_allow_html=True)
    
    # Sample texts
    sample_texts = [
        "I absolutely love working with artificial intelligence! It's fascinating!",
        "This project is really challenging and frustrating.",
        "The weather is okay today, nothing special.",
        "Excited about the breakthrough in cognitive science research!"
    ]
    
    # Initialize sample text in session state
    if 'selected_sample' not in st.session_state:
        st.session_state.selected_sample = ""
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown('<div class="demo-container">', unsafe_allow_html=True)
        st.markdown("**Try the sentiment analyzer with your own text:**")
        
        user_input = st.text_area(
            "Enter text to analyze:",
            value=st.session_state.selected_sample,
            placeholder="Type something here... (e.g., 'I love working with AI!')",
            height=100,
            key="sentiment_input"
        )
        
        if st.button("Analyze Sentiment", key="analyze_btn"):
            if user_input:
                with st.spinner("Analyzing sentiment..."):
                    time.sleep(1)  # Add some suspense
                    result = ai_tools.analyze_sentiment(user_input)
                    
                    # Create visual sentiment display
                    sentiment_color = {
                        'positive': '#10B981',
                        'negative': '#EF4444', 
                        'neutral': '#6B7280'
                    }[result['sentiment']]
                    
                    sentiment_emoji = {
                        'positive': 'Positive',
                        'negative': 'Negative',
                        'neutral': 'Neutral'
                    }[result['sentiment']]
                    
                    st.markdown(f"""
                    <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 10px; margin: 1rem 0;">
                        <h3>Sentiment: <span style="color: {sentiment_color};">{sentiment_emoji}</span></h3>
                        <p><strong>Confidence:</strong> {result['confidence']:.1%}</p>
                        <p><strong>Polarity Score:</strong> {result['polarity']:.3f}</p>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Add a confidence meter
                    fig = go.Figure(go.Indicator(
                        mode = "gauge+number",
                        value = result['confidence'] * 100,
                        domain = {'x': [0, 1], 'y': [0, 1]},
                        title = {'text': "Confidence Level"},
                        gauge = {
                            'axis': {'range': [None, 100]},
                            'bar': {'color': sentiment_color},
                            'steps': [
                                {'range': [0, 50], 'color': "lightgray"},
                                {'range': [50, 100], 'color': "gray"}
                            ],
                            'threshold': {
                                'line': {'color': "red", 'width': 4},
                                'thickness': 0.75,
                                'value': 90
                            }
                        }
                    ))
                    
                    fig.update_layout(
                        paper_bgcolor='rgba(0,0,0,0)',
                        plot_bgcolor='rgba(0,0,0,0)',
                        font={'color': "white"},
                        height=300
                    )
                    
                    st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("Please enter some text to analyze!")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="demo-container">', unsafe_allow_html=True)
        st.markdown("**Sample Texts to Try:**")
        
        for i, sample in enumerate(sample_texts, 1):
            if st.button(f"Try Sample {i}", key=f"sample_{i}"):
                st.session_state.selected_sample = sample
                st.rerun()
        
        st.markdown('</div>', unsafe_allow_html=True)

def cognitive_research_demo():
    """Demo of cognitive research analysis"""
    st.markdown('<div class="section-header">Cognitive Research Demo</div>', unsafe_allow_html=True)
    
    # Create sample research data
    np.random.seed(42)
    n_participants = 200
    
    # Generate synthetic data based on actual research
    ages = np.random.normal(4.5, 0.8, n_participants)  # Preschool age
    math_scores = np.random.normal(75, 15, n_participants)
    cognitive_scores = np.random.normal(80, 12, n_participants)
    
    # Add some correlation
    for i in range(n_participants):
        if ages[i] > 5:
            math_scores[i] += random.uniform(5, 15)
            cognitive_scores[i] += random.uniform(3, 12)
    
    research_data = pd.DataFrame({
        'age': ages,
        'math_score': math_scores,
        'cognitive_score': cognitive_scores,
        'group': np.random.choice(['Control', 'Intervention'], n_participants)
    })
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Age distribution
        fig_age = px.histogram(research_data, x='age', nbins=20,
                              title="Age Distribution of Participants",
                              color_discrete_sequence=['#8B5CF6'])
        fig_age.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white')
        )
        st.plotly_chart(fig_age, use_container_width=True)
        
    with col2:
        # Correlation analysis
        fig_corr = px.scatter(research_data, x='math_score', y='cognitive_score',
                             color='group', title="Math vs Cognitive Scores",
                             trendline="ols",
                             color_discrete_sequence=['#EC4899', '#F59E0B'])
        fig_corr.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white')
        )
        st.plotly_chart(fig_corr, use_container_width=True)
    
    # Summary statistics
    st.markdown("### Key Research Findings")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        correlation = research_data['math_score'].corr(research_data['cognitive_score'])
        create_animated_metric(f"{correlation:.2f}", "Math-Cognitive Correlation")
    
    with col2:
        effect_size = (research_data[research_data['group']=='Intervention']['math_score'].mean() - 
                      research_data[research_data['group']=='Control']['math_score'].mean()) / research_data['math_score'].std()
        create_animated_metric(f"{effect_size:.2f}", "Effect Size")
    
    with col3:
        create_animated_metric(f"{n_participants}", "Total Participants")

def create_experience_timeline():
    """Create an interactive timeline of experiences"""
    st.markdown('<div class="section-header">Professional Journey</div>', unsafe_allow_html=True)
    
    for i, experience in enumerate(WORK_EXPERIENCE):
        # Create company section with 3D logo
        col1, col2 = st.columns([1, 10])
        
        with col1:
            # Display 3D company logo with unique key
            logo_fig = create_company_logo_3d(experience['company'])
            st.plotly_chart(logo_fig, use_container_width=True, 
                          config={'displayModeBar': False}, 
                          key=f"company_logo_{i}")
        
        with col2:
            st.markdown(f"""
            <div class="timeline-item">
                <div class="company-header">
                    <div>
                        <h3 style="color: white; margin: 0; font-size: 1.3rem;">{experience['company']}</h3>
                        <p style="color: rgba(255,255,255,0.7); margin: 0.25rem 0;">{experience['location']}</p>
                        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 0.9rem;">{experience['company_description']}</p>
                    </div>
                </div>
            """, unsafe_allow_html=True)
            
            # Display all positions for this company
            for position in experience['positions']:
                st.markdown(f"""
                <div class="position-title">{position['title']}</div>
                <div class="position-period">{position['period']} • {position['duration']} • {position['employment_type']}</div>
                """, unsafe_allow_html=True)
                
                # Achievements
                for achievement in position['achievements']:
                    st.write(f"• {achievement}")
                
                # Skills developed
                if position['skills_developed']:
                    st.markdown("**Skills Developed:**")
                    for skill in position['skills_developed']:
                        st.markdown(f'<span class="skill-tag">{skill}</span>', unsafe_allow_html=True)
                
                st.markdown("<br>", unsafe_allow_html=True)
            
            st.markdown("</div>", unsafe_allow_html=True)

def skills_radar_chart():
    """Create an interactive skills radar chart"""
    st.markdown('<div class="section-header">Skills Proficiency</div>', unsafe_allow_html=True)
    
    # Define skill categories and levels
    categories = [
        'Programming Languages',
        'AI/ML Tools', 
        'Frameworks',
        'Data Science',
        'Research',
        'Leadership',
        'Communication',
        'Problem Solving'
    ]
    
    # Skill levels (0-10 scale)
    current_levels = [9, 8, 8, 9, 9, 7, 8, 9]
    
    # Create radar chart
    fig = go.Figure()
    
    fig.add_trace(go.Scatterpolar(
        r=current_levels,
        theta=categories,
        fill='toself',
        name='Current Level',
        line=dict(color='#8B5CF6', width=3),
        fillcolor='rgba(139, 92, 246, 0.3)'
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 10],
                gridcolor='rgba(255,255,255,0.3)',
                tickcolor='white'
            ),
            angularaxis=dict(
                gridcolor='rgba(255,255,255,0.3)',
                tickcolor='white'
            )
        ),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white', size=12),
        height=500,
        showlegend=True
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Skills breakdown
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("**Programming Languages**")
        for skill in SKILLS['languages']:
            st.markdown(f'<span class="skill-tag">{skill}</span>', unsafe_allow_html=True)
    
    with col2:
        st.markdown("**AI/ML Tools**")
        for skill in SKILLS['ai_ml_tools']:
            st.markdown(f'<span class="skill-tag">{skill}</span>', unsafe_allow_html=True)
    
    with col3:
        st.markdown("**Frameworks**")
        for skill in SKILLS['frameworks']:
            st.markdown(f'<span class="skill-tag">{skill}</span>', unsafe_allow_html=True)

def main():
    # Hero Section
    st.markdown(f"""
    <div class="hero-container">
        <h1 class="hero-title">{PERSONAL_INFO['name']}</h1>
        <p class="hero-subtitle">AI/ML Engineer & Cognitive Science Researcher</p>
        <p style="font-size: 1.1rem; opacity: 0.9;">
            Computer Science & Cognitive Science Double Major | Rutgers University<br>
            {PERSONAL_INFO['location']} | {PERSONAL_INFO['email']}
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Main content sections
    tabs = st.tabs([
        "Overview", "Project Demos", "Experience", "Skills", "Contact"
    ])
    
    with tabs[0]:  # Overview
        st.markdown("### Welcome to My Interactive Portfolio")
        
        col1, col2, col3 = st.columns(3)
        with col1:
            create_animated_metric("8+", "Programming Languages")
        with col2:
            create_animated_metric("15+", "AI/ML Tools")
        with col3:
            create_animated_metric("6+", "Frameworks")
        
        st.markdown("### About Me")
        st.write("""
        I'm a passionate AI/ML Engineer and Cognitive Science Researcher pursuing a double major 
        at Rutgers University. My work spans from developing AI-driven solutions at major financial 
        institutions to conducting groundbreaking research in cognitive development and learning processes.
        """)
        
        st.markdown("### Recent Projects")
        for project in PROJECTS:
            with st.expander(f"🚀 {project['name']}"):
                st.write(f"**Period:** {project['period']}")
                for desc in project['description']:
                    st.write(f"• {desc}")
                st.write("**Technologies:**", ", ".join(project['technologies']))
    
    with tabs[1]:  # Project Demos
        sentiment_analysis_demo()
        st.markdown("---")
        cognitive_research_demo()
    
    with tabs[2]:  # Experience
        create_experience_timeline()
    
    with tabs[3]:  # Skills
        skills_radar_chart()
    
    with tabs[4]:  # Contact
        st.markdown('<div class="section-header">Contact Information</div>', unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown(f"""
            **Email:** {PERSONAL_INFO['email']}  
            **Phone:** {PERSONAL_INFO['phone']}  
            **Location:** {PERSONAL_INFO['location']}
            """)
        
        with col2:
            st.markdown(f"""
            **LinkedIn:** [{PERSONAL_INFO['linkedin']}](https://{PERSONAL_INFO['linkedin']})  
            **GitHub:** [{PERSONAL_INFO['github']}](https://{PERSONAL_INFO['github']})
            """)
        
        st.markdown("### Let's Connect!")
        st.write("I'm always interested in discussing AI/ML projects, research opportunities, and innovative solutions. Feel free to reach out!")

if __name__ == "__main__":
    main()
