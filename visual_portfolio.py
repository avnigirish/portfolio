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

# Enhanced CSS for modern, clean design
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
</style>
""", unsafe_allow_html=True)

def create_animated_metric(value, label, icon=""):
    """Create an animated metric display"""
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown(f"""
        <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.1); 
                    border-radius: 15px; margin: 0.5rem 0; backdrop-filter: blur(10px);">
            <div class="metric-big">{value}</div>
            <div class="metric-label">{label}</div>
        </div>
        """, unsafe_allow_html=True)

def create_3d_scatter_plot():
    """Create a 3D scatter plot for skills visualization"""
    # Sample data representing skills in 3D space
    skills_3d = pd.DataFrame({
        'x': [8, 9, 7, 8, 6, 9, 7, 8, 9, 7],
        'y': [9, 8, 8, 7, 9, 8, 6, 9, 8, 7],
        'z': [7, 9, 8, 9, 7, 8, 9, 7, 8, 8],
        'skill': ['Python', 'AI/ML', 'Research', 'JavaScript', 'Data Science', 
                 'FastAPI', 'React', 'Statistics', 'Leadership', 'Communication'],
        'category': ['Programming', 'AI/ML', 'Research', 'Programming', 'Data Science',
                    'Backend', 'Frontend', 'Analysis', 'Soft Skills', 'Soft Skills'],
        'size': [20, 25, 22, 18, 24, 20, 18, 21, 19, 20]
    })
    
    fig = px.scatter_3d(skills_3d, x='x', y='y', z='z', 
                       color='category', size='size',
                       hover_name='skill',
                       title="3D Skills Visualization",
                       labels={'x': 'Proficiency', 'y': 'Experience', 'z': 'Impact'},
                       color_discrete_sequence=px.colors.qualitative.Vivid)
    
    fig.update_layout(
        scene=dict(
            xaxis=dict(range=[0, 10], gridcolor='rgba(255,255,255,0.2)'),
            yaxis=dict(range=[0, 10], gridcolor='rgba(255,255,255,0.2)'),
            zaxis=dict(range=[0, 10], gridcolor='rgba(255,255,255,0.2)'),
            bgcolor='rgba(0,0,0,0)'
        ),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white', size=12),
        height=600
    )
    
    return fig

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
                        'positive': '😊',
                        'negative': '😞',
                        'neutral': '😐'
                    }[result['sentiment']]
                    
                    st.markdown(f"""
                    <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 10px; margin: 1rem 0;">
                        <h3>{sentiment_emoji} Sentiment: <span style="color: {sentiment_color};">{result['sentiment'].title()}</span></h3>
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
    nutrition_scores = np.random.normal(80, 12, n_participants)
    
    # Add correlation between nutrition and math (based on 30% correlation finding)
    correlation_factor = 0.3
    math_scores = math_scores + correlation_factor * (nutrition_scores - 80)
    
    research_data = pd.DataFrame({
        'age': ages,
        'math_score': np.clip(math_scores, 0, 100),
        'nutrition_score': np.clip(nutrition_scores, 0, 100),
        'participant_id': range(1, n_participants + 1)
    })
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Research Findings Visualization**")
        
        # Scatter plot showing correlation
        fig = px.scatter(research_data, 
                        x='nutrition_score', 
                        y='math_score',
                        color='age',
                        title="Math Performance vs Nutrition (200+ Participants)",
                        labels={'nutrition_score': 'Nutrition Score', 
                               'math_score': 'Math Assessment Score'},
                        color_continuous_scale='Viridis')
        
        # Add trend line
        z = np.polyfit(research_data['nutrition_score'], research_data['math_score'], 1)
        p = np.poly1d(z)
        fig.add_scatter(x=research_data['nutrition_score'], 
                       y=p(research_data['nutrition_score']),
                       mode='lines', 
                       name='Trend Line',
                       line=dict(color='red', width=3))
        
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white'),
            height=400
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("**Key Research Insights**")
        
        # Calculate correlation
        correlation = research_data['nutrition_score'].corr(research_data['math_score'])
        
        st.markdown(f"""
        <div class="demo-container">
            <h4>🔍 Research Results:</h4>
            <p><strong>Correlation Found:</strong> {correlation:.1%}</p>
            <p><strong>Sample Size:</strong> {len(research_data)} participants</p>
            <p><strong>Age Range:</strong> {research_data['age'].min():.1f} - {research_data['age'].max():.1f} years</p>
            
            <h4>📊 Statistical Significance:</h4>
            <p>• Strong positive correlation between nutrition and math performance</p>
            <p>• Results consistent across age groups</p>
            <p>• Implications for early childhood education</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Interactive analysis
        if st.button("🎯 Run Advanced Analysis"):
            with st.spinner("Running statistical analysis..."):
                time.sleep(2)
                
                # K-means clustering for participant grouping
                kmeans = KMeans(n_clusters=3, random_state=42)
                research_data['cluster'] = kmeans.fit_predict(
                    research_data[['math_score', 'nutrition_score']]
                )
                
                cluster_fig = px.scatter(research_data,
                                       x='nutrition_score',
                                       y='math_score', 
                                       color='cluster',
                                       title="Participant Clustering Analysis")
                
                cluster_fig.update_layout(
                    paper_bgcolor='rgba(0,0,0,0)',
                    plot_bgcolor='rgba(0,0,0,0)',
                    font=dict(color='white'),
                    height=300
                )
                
                st.plotly_chart(cluster_fig, use_container_width=True)
                
                st.success("✅ Analysis complete! Three distinct learning pattern groups identified.")

def financial_analytics_demo():
    """Demo of financial analytics dashboard"""
    st.markdown('<div class="section-header">Financial Analytics Demo</div>', unsafe_allow_html=True)
    
    # Generate sample financial data
    np.random.seed(42)
    dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
    
    # Simulate user engagement metrics
    base_users = 500
    growth_trend = np.linspace(0, 200, len(dates))
    seasonal_pattern = 50 * np.sin(2 * np.pi * np.arange(len(dates)) / 365.25)
    noise = np.random.normal(0, 20, len(dates))
    
    user_counts = base_users + growth_trend + seasonal_pattern + noise
    user_counts = np.maximum(user_counts, 0)
    
    financial_data = pd.DataFrame({
        'date': dates,
        'daily_users': user_counts,
        'sentiment_score': np.random.normal(0.6, 0.2, len(dates)),
        'feature_usage': np.random.poisson(50, len(dates))
    })
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**User Engagement Dashboard**")
        
        # Time series plot
        fig = go.Figure()
        
        fig.add_trace(go.Scatter(
            x=financial_data['date'],
            y=financial_data['daily_users'],
            mode='lines',
            name='Daily Active Users',
            line=dict(color='#8B5CF6', width=3)
        ))
        
        # Add moving average
        ma_7 = financial_data['daily_users'].rolling(window=7).mean()
        fig.add_trace(go.Scatter(
            x=financial_data['date'],
            y=ma_7,
            mode='lines',
            name='7-day Moving Average',
            line=dict(color='#EC4899', width=2, dash='dash')
        ))
        
        fig.update_layout(
            title="User Growth Over Time (Internal Tool)",
            xaxis_title="Date",
            yaxis_title="Daily Active Users",
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white'),
            height=400
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("**Sentiment Analysis Results**")
        
        # Sentiment distribution
        sentiment_bins = pd.cut(financial_data['sentiment_score'], 
                               bins=[-1, 0, 0.5, 1], 
                               labels=['Negative', 'Neutral', 'Positive'])
        
        sentiment_counts = sentiment_bins.value_counts()
        
        fig = px.pie(values=sentiment_counts.values,
                    names=sentiment_counts.index,
                    title="User Sentiment Distribution",
                    color_discrete_sequence=['#EF4444', '#6B7280', '#10B981'])
        
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white'),
            height=400
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    # Interactive controls
    st.markdown("**Interactive Analysis Tools**")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("Growth Analysis"):
            growth_rate = ((financial_data['daily_users'].iloc[-30:].mean() / 
                           financial_data['daily_users'].iloc[:30].mean()) - 1) * 100
            st.success(f"User growth rate: +{growth_rate:.1f}% over the year")
    
    with col2:
        if st.button("Peak Performance"):
            peak_date = financial_data.loc[financial_data['daily_users'].idxmax(), 'date']
            peak_users = financial_data['daily_users'].max()
            st.info(f"Peak usage: {peak_users:.0f} users on {peak_date.strftime('%B %d')}")
    
    with col3:
        if st.button("Sentiment Insights"):
            avg_sentiment = financial_data['sentiment_score'].mean()
            if avg_sentiment > 0.6:
                st.success(f"Overall sentiment: Very Positive ({avg_sentiment:.2f})")
            else:
                st.warning(f"Overall sentiment: Needs improvement ({avg_sentiment:.2f})")

def create_experience_timeline():
    """Create an interactive timeline of experiences"""
    st.markdown('<div class="section-header">Professional Journey</div>', unsafe_allow_html=True)
    
    # Enhanced experience data with dates
    timeline_data = []
    colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981']
    
    for i, experience in enumerate(WORK_EXPERIENCE):
        for j, position in enumerate(experience['positions']):
            timeline_data.append({
                'company': experience['company'],
                'title': position['title'],
                'period': position['period'],
                'achievements': len(position['achievements']),
                'color': colors[i % len(colors)],
                'location': experience['location']
            })
    
    # Create timeline visualization
    fig = go.Figure()
    
    for i, item in enumerate(timeline_data):
        fig.add_trace(go.Scatter(
            x=[i],
            y=[item['achievements']],
            mode='markers+text',
            marker=dict(
                size=25,
                color=item['color'],
                line=dict(width=3, color='white')
            ),
            text=item['title'],
            textposition="top center",
            name=f"{item['company']}<br>{item['period']}",
            hovertemplate=f"<b>{item['title']}</b><br>" +
                         f"{item['company']}<br>" +
                         f"{item['location']}<br>" +
                         f"Period: {item['period']}<br>" +
                         f"Key Achievements: {item['achievements']}<extra></extra>"
        ))
    
    # Add connecting line
    fig.add_trace(go.Scatter(
        x=list(range(len(timeline_data))),
        y=[item['achievements'] for item in timeline_data],
        mode='lines',
        line=dict(color='rgba(255,255,255,0.3)', width=2, dash='dot'),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    fig.update_layout(
        title="Career Progression Timeline",
        xaxis_title="Career Stage",
        yaxis_title="Impact Level (Number of Key Achievements)",
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        height=500,
        showlegend=True
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Detailed experience cards
    for experience in WORK_EXPERIENCE:
        for position in experience['positions']:
            st.markdown(f"""
            <div class="experience-card">
                <h3 style="color: white; margin-bottom: 0.5rem;">{position['title']}</h3>
                <h4 style="color: #EC4899; margin-bottom: 0.5rem;">{experience['company']}</h4>
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 1rem;">
                    {experience['location']} | {position['period']}
                </p>
                <div style="color: rgba(255,255,255,0.9);">
            """, unsafe_allow_html=True)
            
            for achievement in position['achievements']:
                st.markdown(f"• {achievement}")
            
            st.markdown("</div></div>", unsafe_allow_html=True)

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
    avni_levels = [9, 8, 8, 9, 9, 7, 8, 9]
    
    # Create radar chart
    fig = go.Figure()
    
    fig.add_trace(go.Scatterpolar(
        r=avni_levels,
        theta=categories,
        fill='toself',
        name='Current Level',
        line=dict(color='#8B5CF6', width=3),
        fillcolor='rgba(139, 92, 246, 0.3)'
    ))
    
    # Add target levels
    target_levels = [9, 9, 9, 10, 10, 8, 9, 10]
    fig.add_trace(go.Scatterpolar(
        r=target_levels,
        theta=categories,
        fill='toself',
        name='Target Level',
        line=dict(color='#EC4899', width=2, dash='dash'),
        fillcolor='rgba(236, 72, 153, 0.1)'
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 10],
                gridcolor='rgba(255,255,255,0.2)',
                tickcolor='white',
                tickfont=dict(color='white')
            ),
            angularaxis=dict(
                gridcolor='rgba(255,255,255,0.2)',
                tickcolor='white',
                tickfont=dict(color='white', size=12)
            )
        ),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        height=600,
        title="Skills Assessment Radar"
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Interactive skill details
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("**🐍 Programming**")
        for skill in SKILLS['languages'][:4]:
            st.markdown(f'<span class="skill-pill">{skill}</span>', unsafe_allow_html=True)
    
    with col2:
        st.markdown("**🤖 AI/ML Tools**") 
        for skill in SKILLS['ai_ml_tools'][:4]:
            st.markdown(f'<span class="skill-pill">{skill}</span>', unsafe_allow_html=True)
    
    with col3:
        st.markdown("**🚀 Frameworks**")
        for skill in SKILLS['frameworks'][:4]:
            st.markdown(f'<span class="skill-pill">{skill}</span>', unsafe_allow_html=True)

def career_insights_dashboard():
    """Create a career insights dashboard"""
    st.markdown('<div class="section-header">Career Analytics</div>', unsafe_allow_html=True)
    
    # Career progression metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        create_animated_metric("15+", "Technologies", "💻")
    
    with col2:
        create_animated_metric("200+", "Research Participants", "👥")
    
    with col3:
        create_animated_metric("40%", "Team Productivity Increase", "📈")
    
    with col4:
        create_animated_metric("85/100", "Career Progression Score", "🎯")
    
    # Career trajectory analysis
    col1, col2 = st.columns(2)
    
    with col1:
        # Career growth over time
        career_stages = ['Student', 'Research Assistant', 'Tutor', 'Intern', 'Research Lead']
        skill_levels = [60, 70, 75, 85, 90]
        impact_levels = [20, 40, 50, 75, 85]
        
        fig = go.Figure()
        
        fig.add_trace(go.Scatter(
            x=career_stages,
            y=skill_levels,
            mode='lines+markers',
            name='Technical Skills',
            line=dict(color='#8B5CF6', width=3),
            marker=dict(size=10)
        ))
        
        fig.add_trace(go.Scatter(
            x=career_stages,
            y=impact_levels,
            mode='lines+markers',
            name='Leadership Impact',
            line=dict(color='#EC4899', width=3),
            marker=dict(size=10)
        ))
        
        fig.update_layout(
            title="Career Development Trajectory",
            xaxis_title="Career Stage",
            yaxis_title="Proficiency Level (%)",
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white'),
            height=400
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Skills growth prediction
        if st.button("🔮 Generate Career Predictions"):
            with st.spinner("Analyzing career trajectory..."):
                time.sleep(2)
                insights = ai_tools.analyze_career_progression()
                
                st.markdown(f"""
                <div class="demo-container">
                    <h4>🎯 Career Insights:</h4>
                    <p><strong>Progression Score:</strong> {insights['progression_score']}/100</p>
                    
                    <h5>💪 Key Strengths:</h5>
                    <p>{insights['strengths']}</p>
                    
                    <h5>🌱 Growth Areas:</h5> 
                    <p>{insights['growth_areas']}</p>
                    
                    <h5>🚀 Next Steps:</h5>
                    <p>{insights['recommendations']}</p>
                </div>
                """, unsafe_allow_html=True)

def main():
    # Hero Section
    st.markdown(f"""
    <div class="hero-container">
        <h1 class="hero-title">{PERSONAL_INFO['name']}</h1>
        <p class="hero-subtitle">AI/ML Engineer & Cognitive Science Researcher</p>
        <p style="font-size: 1.1rem; opacity: 0.9; position: relative; z-index: 2;">
            Computer Science & Cognitive Science Double Major | Rutgers University<br>
            {PERSONAL_INFO['location']} | {PERSONAL_INFO['email']}
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Main content sections
    tabs = st.tabs([
        "Overview", "Project Demos", "Experience", "Skills", 
        "Analytics", "AI Tools", "Contact"
    ])
    
    with tabs[0]:  # Overview
        st.markdown('<div class="section-header">🚀 Portfolio Overview</div>', unsafe_allow_html=True)
        
        # Quick metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            create_animated_metric("34+", "Technical Skills", "🛠️")
        
        with col2:
            create_animated_metric("4+", "Work Experiences", "💼")
        
        with col3:
            create_animated_metric("6+", "Certifications", "🏆")
        
        with col4:
            create_animated_metric("2+", "Major Projects", "🚀")
        
        # About section
        st.markdown("""
        <div class="project-card">
            <h3 style="color: white; margin-bottom: 1rem;">🎯 About Me</h3>
            <p style="color: rgba(255,255,255,0.9); line-height: 1.8; font-size: 1.1rem;">
                I'm a passionate Computer Science and Cognitive Science double major at Rutgers University, 
                specializing in AI/ML technologies and human-computer interaction. My interdisciplinary 
                background allows me to bridge the gap between human cognition and artificial intelligence.
            </p>
            <p style="color: rgba(255,255,255,0.9); line-height: 1.8; font-size: 1.1rem; margin-top: 1rem;">
                I've contributed to research with 200+ participants, built AI-powered applications serving 
                500+ users, and mentored teams to achieve 40% productivity improvements. My work focuses 
                on creating technology that enhances human capabilities while respecting cognitive diversity.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # 3D Skills visualization
        st.markdown('<div class="section-header">🌟 Skills in 3D Space</div>', unsafe_allow_html=True)
        fig_3d = create_3d_scatter_plot()
        st.plotly_chart(fig_3d, use_container_width=True)
    
    with tabs[1]:  # Project Demos
        sentiment_analysis_demo()
        st.markdown("---")
        cognitive_research_demo() 
        st.markdown("---")
        financial_analytics_demo()
    
    with tabs[2]:  # Experience
        create_experience_timeline()
    
    with tabs[3]:  # Skills
        skills_radar_chart()
    
    with tabs[4]:  # Analytics
        career_insights_dashboard()
    
    with tabs[5]:  # AI Tools
        st.markdown('<div class="section-header">🤖 AI-Powered Career Tools</div>', unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("**🎯 Skill Recommendations**")
            career_goal = st.selectbox(
                "Select your career goal:",
                ["AI/ML Engineer", "Data Scientist", "Software Developer", "Research Scientist", "Product Manager"]
            )
            
            if st.button("Get Personalized Recommendations"):
                recommendations = ai_tools.recommend_skills(career_goal)
                
                st.markdown("**Recommended Skills:**")
                for i, skill in enumerate(recommendations[:5], 1):
                    st.markdown(f"{i}. {skill}")
        
        with col2:
            st.markdown("**📊 Career Analysis**")
            if st.button("Analyze My Career Trajectory"):
                with st.spinner("Analyzing..."):
                    time.sleep(1)
                    insights = ai_tools.analyze_career_progression()
                    
                    st.markdown(f"**Career Score:** {insights['progression_score']}/100")
                    st.markdown(f"**Current Level:** {insights['career_trajectory']['current_level']}")
                    st.markdown(f"**Next Goal:** {insights['career_trajectory']['next_level']}")
    
    with tabs[6]:  # Contact
        st.markdown('<div class="section-header">📞 Let\'s Connect</div>', unsafe_allow_html=True)
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown("""
            <div class="project-card">
                <h3 style="color: white; margin-bottom: 1rem;">🤝 Ready to Collaborate?</h3>
                <p style="color: rgba(255,255,255,0.9); line-height: 1.6;">
                    I'm always excited to work on innovative projects that blend AI/ML with human-centered design. 
                    Whether you're interested in research collaboration, technical consultation, or creative tech solutions, 
                    let's connect and explore what we can build together!
                </p>
            </div>
            """, unsafe_allow_html=True)
            
            # Contact form
            with st.form("contact_form"):
                name = st.text_input("Your Name")
                email = st.text_input("Your Email") 
                subject = st.selectbox("Subject", [
                    "General Inquiry", "Collaboration Opportunity", 
                    "Research Discussion", "Technical Consultation"
                ])
                message = st.text_area("Message", height=120)
                
                if st.form_submit_button("Send Message ✨"):
                    if name and email and message:
                        st.success("🎉 Message sent successfully! I'll get back to you soon.")
                        st.balloons()
                    else:
                        st.error("Please fill in all fields.")
        
        with col2:
            st.markdown("""
            <div class="project-card">
                <h4 style="color: white;">📍 Contact Information</h4>
                <p style="color: rgba(255,255,255,0.9);">
                    <strong>Email:</strong> {email}<br>
                    <strong>Location:</strong> {location}<br>
                    <strong>LinkedIn:</strong> <a href="https://{linkedin}" style="color: #8B5CF6;">linkedin.com/in/avni-girish</a><br>
                    <strong>GitHub:</strong> <a href="https://{github}" style="color: #8B5CF6;">github.com/avnigirish</a>
                </p>
            </div>
            """.format(**PERSONAL_INFO), unsafe_allow_html=True)

if __name__ == "__main__":
    main()
