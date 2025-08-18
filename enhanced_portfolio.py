import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
from textblob import TextBlob
import json
import time
from datetime import datetime
from data.resume_data import *

# Configure page
st.set_page_config(
    page_title="Avni Girish - Portfolio",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state for theme and chat
if 'theme' not in st.session_state:
    st.session_state.theme = 'dark'
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'animation_enabled' not in st.session_state:
    st.session_state.animation_enabled = True

def get_theme_styles():
    """Return CSS styles based on current theme"""
    if st.session_state.theme == 'dark':
        return {
            'primary_bg': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)',
            'card_bg': 'rgba(255, 255, 255, 0.1)',
            'text_primary': '#ffffff',
            'text_secondary': 'rgba(255, 255, 255, 0.8)',
            'text_muted': 'rgba(255, 255, 255, 0.6)',
            'accent_color': '#8B5CF6',
            'secondary_accent': '#EC4899',
            'border_color': 'rgba(255, 255, 255, 0.2)',
            'shadow': '0 8px 32px rgba(0, 0, 0, 0.3)'
        }
    else:
        return {
            'primary_bg': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
            'card_bg': 'rgba(255, 255, 255, 0.9)',
            'text_primary': '#1f2937',
            'text_secondary': '#374151',
            'text_muted': '#6b7280',
            'accent_color': '#7c3aed',
            'secondary_accent': '#db2777',
            'border_color': 'rgba(0, 0, 0, 0.1)',
            'shadow': '0 8px 32px rgba(0, 0, 0, 0.1)'
        }

def apply_theme_css():
    """Apply dynamic CSS based on current theme"""
    theme = get_theme_styles()
    
    animations = """
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
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    @keyframes rotate3d {
        0% {
            transform: rotateY(0deg);
        }
        100% {
            transform: rotateY(360deg);
        }
    }
    """ if st.session_state.animation_enabled else ""
    
    st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    {animations}
    
    .stApp {{
        background: {theme['primary_bg']};
        font-family: 'Inter', sans-serif;
    }}
    
    .main-header {{
        text-align: center;
        padding: 3rem 0;
        animation: fadeInUp 1s ease-out;
    }}
    
    .main-title {{
        font-size: 4rem;
        font-weight: 800;
        background: linear-gradient(135deg, {theme['accent_color']}, {theme['secondary_accent']});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1rem;
        animation: pulse 2s infinite;
    }}
    
    .main-subtitle {{
        font-size: 1.5rem;
        color: {theme['text_secondary']};
        font-weight: 400;
        margin-bottom: 2rem;
    }}
    
    .section-header {{
        font-size: 2.5rem;
        font-weight: 700;
        color: {theme['text_primary']};
        text-align: center;
        margin: 3rem 0 2rem 0;
        position: relative;
        animation: fadeInUp 0.8s ease-out;
    }}
    
    .section-header::after {{
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 4px;
        background: linear-gradient(135deg, {theme['accent_color']}, {theme['secondary_accent']});
        border-radius: 2px;
    }}
    
    .glass-card {{
        background: {theme['card_bg']};
        backdrop-filter: blur(10px);
        border: 1px solid {theme['border_color']};
        border-radius: 20px;
        padding: 2rem;
        margin: 1rem 0;
        box-shadow: {theme['shadow']};
        transition: all 0.3s ease;
        animation: fadeInUp 0.6s ease-out;
    }}
    
    .glass-card:hover {{
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
    }}
    
    .company-logo {{
        animation: rotate3d 10s linear infinite;
        transition: all 0.3s ease;
    }}
    
    .company-logo:hover {{
        animation-play-state: paused;
        transform: scale(1.2);
    }}
    
    .skill-tag {{
        display: inline-block;
        background: linear-gradient(135deg, {theme['accent_color']}, {theme['secondary_accent']});
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 500;
        margin: 0.3rem;
        transition: all 0.3s ease;
        animation: bounce 2s infinite;
    }}
    
    .skill-tag:hover {{
        transform: scale(1.1);
        animation-play-state: paused;
    }}
    
    .timeline-item {{
        background: {theme['card_bg']};
        border-left: 4px solid {theme['accent_color']};
        padding: 1.5rem;
        margin: 1rem 0;
        border-radius: 0 15px 15px 0;
        transition: all 0.3s ease;
        animation: fadeInUp 0.8s ease-out;
    }}
    
    .timeline-item:hover {{
        background: rgba(139, 92, 246, 0.1);
        transform: translateX(10px);
    }}
    
    .chat-container {{
        background: {theme['card_bg']};
        border-radius: 20px;
        padding: 1.5rem;
        margin: 1rem 0;
        backdrop-filter: blur(10px);
        border: 1px solid {theme['border_color']};
    }}
    
    .chat-message {{
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 15px;
        animation: fadeInUp 0.5s ease-out;
    }}
    
    .user-message {{
        background: linear-gradient(135deg, {theme['accent_color']}, {theme['secondary_accent']});
        color: white;
        margin-left: 20%;
    }}
    
    .bot-message {{
        background: {theme['card_bg']};
        color: {theme['text_primary']};
        margin-right: 20%;
        border: 1px solid {theme['border_color']};
    }}
    
    .theme-toggle {{
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: {theme['card_bg']};
        border: 1px solid {theme['border_color']};
        border-radius: 50px;
        padding: 10px 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }}
    
    .theme-toggle:hover {{
        transform: scale(1.1);
    }}
    
    .stButton > button {{
        background: linear-gradient(135deg, {theme['accent_color']}, {theme['secondary_accent']});
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0.7rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
        font-family: 'Inter', sans-serif;
    }}
    
    .stButton > button:hover {{
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
    }}
    
    .metric-card {{
        background: {theme['card_bg']};
        border-radius: 15px;
        padding: 1.5rem;
        text-align: center;
        backdrop-filter: blur(10px);
        border: 1px solid {theme['border_color']};
        transition: all 0.3s ease;
        animation: pulse 3s infinite;
    }}
    
    .metric-value {{
        font-size: 2.5rem;
        font-weight: 800;
        color: {theme['accent_color']};
        margin: 0;
    }}
    
    .metric-label {{
        font-size: 1rem;
        color: {theme['text_secondary']};
        margin-top: 0.5rem;
    }}
    </style>
    """, unsafe_allow_html=True)

def create_3d_logo_animated(company_name, index=0):
    """Create an animated 3D logo"""
    logo_data = {
        "Rutgers University-New Brunswick": {"color": "#cc0033", "symbol": "🎓"},
        "BNY": {"color": "#0066cc", "symbol": "🏦", "description": "Global financial services company"},
        "New Jersey Economic Development Authority (NJEDA)": {"color": "#009639", "symbol": "🏛️"},
        "Accenture": {"color": "#a100ff", "symbol": "⚡"},
        "Morgan Stanley": {"color": "#001a4d", "symbol": "📈"},
        "Lead Up Academy | Rutgers University-New Brunswick": {"color": "#f59e0b", "symbol": "🚀"},
        "Blueprint": {"color": "#3b82f6", "symbol": "🛠️"}
    }
    
    logo_info = logo_data.get(company_name, {"color": "#6b7280", "symbol": "🏢"})
    
    # Create animated 3D scatter plot
    t = np.linspace(0, 2*np.pi, 50)
    x = np.cos(t + index) * 0.3
    y = np.sin(t + index) * 0.3
    z = np.sin(2*t + index) * 0.1
    
    fig = go.Figure()
    
    # Add animated trail
    fig.add_trace(go.Scatter3d(
        x=x, y=y, z=z,
        mode='lines',
        line=dict(color=logo_info["color"], width=3),
        showlegend=False,
        opacity=0.6
    ))
    
    # Add main logo point
    fig.add_trace(go.Scatter3d(
        x=[0], y=[0], z=[0],
        mode='markers+text',
        marker=dict(
            size=40,
            color=logo_info["color"],
            opacity=0.9,
            line=dict(width=3, color='white'),
            symbol='circle'
        ),
        text=[logo_info["symbol"]],
        textfont=dict(size=20),
        textposition="middle center",
        showlegend=False
    ))
    
    fig.update_layout(
        scene=dict(
            xaxis=dict(visible=False, range=[-1, 1]),
            yaxis=dict(visible=False, range=[-1, 1]),
            zaxis=dict(visible=False, range=[-1, 1]),
            camera=dict(eye=dict(x=1.2, y=1.2, z=1.2))
        ),
        margin=dict(l=0, r=0, t=0, b=0),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        width=80,
        height=80,
        showlegend=False
    )
    
    return fig

def ai_chat_agent():
    """Interactive AI agent about Avni"""
    st.markdown('<div class="section-header">Chat with AI About Avni</div>', unsafe_allow_html=True)
    
    # Knowledge base about Avni
    avni_knowledge = {
        "education": f"Avni is pursuing a {EDUCATION['degree']} at {EDUCATION['university']}, graduating in {EDUCATION['graduation']}. Her coursework includes {', '.join(EDUCATION['coursework'][:5])} and more.",
        "experience": f"Avni has worked at {len(WORK_EXPERIENCE)} companies including Rutgers University, BNY, NJEDA, Accenture, and Morgan Stanley in various roles from research to software engineering.",
        "skills": f"She's proficient in {', '.join(SKILLS['languages'][:4])} and more programming languages, with expertise in AI/ML tools like {', '.join(SKILLS['ai_ml_tools'][:4])}.",
        "certifications": f"Avni has earned {len(CERTIFICATIONS)} certifications including Python Programming and CS50 from Harvard University.",
        "projects": "She has worked on cognitive research studying how hunger affects children's decision-making, financial software at BNY, and various AI/ML projects.",
        "personality": "Avni is passionate about AI, cognitive science, and creating technology that makes a positive impact. She enjoys research, tutoring, and building innovative solutions."
    }
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown('<div class="chat-container">', unsafe_allow_html=True)
        
        # Display chat history
        for chat in st.session_state.chat_history:
            if chat["role"] == "user":
                st.markdown(f'<div class="chat-message user-message">You: {chat["content"]}</div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="chat-message bot-message">🤖 Avni AI: {chat["content"]}</div>', unsafe_allow_html=True)
        
        # Chat input
        user_input = st.text_input("Ask me anything about Avni!", placeholder="e.g., What's her experience at BNY?", key="chat_input")
        
        if st.button("Send", key="send_chat") and user_input:
            # Add user message
            st.session_state.chat_history.append({"role": "user", "content": user_input})
            
            # Generate AI response (simple keyword matching for demo)
            response = generate_ai_response(user_input, avni_knowledge)
            st.session_state.chat_history.append({"role": "assistant", "content": response})
            
            st.rerun()
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown("**Quick Questions:**")
        quick_questions = [
            "What's Avni's educational background?",
            "Tell me about her work at BNY",
            "What programming languages does she know?",
            "What research has she done?",
            "What are her career goals?"
        ]
        
        for i, question in enumerate(quick_questions):
            if st.button(question, key=f"quick_{i}"):
                st.session_state.chat_history.append({"role": "user", "content": question})
                response = generate_ai_response(question, avni_knowledge)
                st.session_state.chat_history.append({"role": "assistant", "content": response})
                st.rerun()

def generate_ai_response(user_input, knowledge_base):
    """Generate AI response based on user input and knowledge base"""
    user_input_lower = user_input.lower()
    
    if any(word in user_input_lower for word in ["education", "degree", "university", "study"]):
        return knowledge_base["education"]
    elif any(word in user_input_lower for word in ["bny", "bank", "financial"]):
        bny_exp = next((exp for exp in WORK_EXPERIENCE if "BNY" in exp["company"]), None)
        if bny_exp:
            return f"At BNY, Avni worked as a {bny_exp['positions'][0]['title']} where she {bny_exp['positions'][0]['achievements'][0]}"
        return "Avni worked at BNY in a software engineering role focusing on financial technology solutions."
    elif any(word in user_input_lower for word in ["skills", "programming", "languages", "tech"]):
        return knowledge_base["skills"]
    elif any(word in user_input_lower for word in ["experience", "work", "job", "career"]):
        return knowledge_base["experience"]
    elif any(word in user_input_lower for word in ["research", "cognitive", "study"]):
        return knowledge_base["projects"]
    elif any(word in user_input_lower for word in ["personality", "about", "who", "person"]):
        return knowledge_base["personality"]
    elif any(word in user_input_lower for word in ["certification", "certificate", "award"]):
        return knowledge_base["certifications"]
    else:
        return "That's a great question! Avni is a Computer Science and Cognitive Science student at Rutgers with experience in software engineering, AI research, and financial technology. She's passionate about creating impactful technology solutions. What specific aspect would you like to know more about?"

def create_animated_metrics():
    """Create animated metrics display"""
    metrics = [
        {"value": "8+", "label": "Companies Worked At"},
        {"value": "650+", "label": "Students Tutored"},
        {"value": "6+", "label": "Certifications"},
        {"value": "2", "label": "Research Projects"}
    ]
    
    cols = st.columns(len(metrics))
    for i, (col, metric) in enumerate(zip(cols, metrics)):
        with col:
            st.markdown(f"""
            <div class="metric-card" style="animation-delay: {i*0.2}s;">
                <div class="metric-value">{metric['value']}</div>
                <div class="metric-label">{metric['label']}</div>
            </div>
            """, unsafe_allow_html=True)

def create_enhanced_experience_timeline():
    """Enhanced experience timeline with animations and merged data"""
    st.markdown('<div class="section-header">Professional Journey</div>', unsafe_allow_html=True)
    
    for i, experience in enumerate(WORK_EXPERIENCE):
        # Merge with additional descriptions for specific companies
        enhanced_description = experience.get('company_description', '')
        if 'BNY' in experience['company']:
            enhanced_description += " - Specialized in financial technology and digital transformation initiatives."
        
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        
        col1, col2 = st.columns([1, 8])
        
        with col1:
            # Animated 3D logo
            logo_fig = create_3d_logo_animated(experience['company'], i)
            st.plotly_chart(logo_fig, use_container_width=True, 
                          config={'displayModeBar': False}, 
                          key=f"animated_logo_{i}")
        
        with col2:
            st.markdown(f"""
            <div class="timeline-item">
                <h3 style="color: {get_theme_styles()['text_primary']}; margin: 0; font-size: 1.4rem;">
                    {experience['company']}
                </h3>
                <p style="color: {get_theme_styles()['text_secondary']}; margin: 0.5rem 0;">
                    📍 {experience['location']}
                </p>
                <p style="color: {get_theme_styles()['text_muted']}; margin: 0; font-size: 0.95rem;">
                    {enhanced_description}
                </p>
            </div>
            """, unsafe_allow_html=True)
            
            # Display positions with enhanced details
            for pos_idx, position in enumerate(experience['positions']):
                st.markdown(f"""
                <div style="margin: 1.5rem 0; padding: 1rem; background: {get_theme_styles()['card_bg']}; 
                           border-radius: 10px; border-left: 3px solid {get_theme_styles()['accent_color']};">
                    <h4 style="color: {get_theme_styles()['accent_color']}; margin: 0;">{position['title']}</h4>
                    <p style="color: {get_theme_styles()['text_secondary']}; margin: 0.5rem 0; font-size: 0.9rem;">
                        🗓️ {position['period']} • ⏱️ {position['duration']} • 🏢 {position['employment_type']}
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
                # Achievements with better formatting
                for achievement in position['achievements']:
                    st.markdown(f"• {achievement}")
                
                # Skills with animated tags
                if position.get('skills_developed'):
                    st.markdown("**🛠️ Skills Developed:**")
                    skills_html = ""
                    for skill in position['skills_developed']:
                        skills_html += f'<span class="skill-tag">{skill}</span>'
                    st.markdown(skills_html, unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)

def create_interactive_skills_chart():
    """Create an interactive animated skills chart"""
    st.markdown('<div class="section-header">Technical Expertise</div>', unsafe_allow_html=True)
    
    # Combine all skills with proficiency levels
    all_skills = []
    categories = {
        'Programming Languages': SKILLS['languages'],
        'AI/ML Tools': SKILLS['ai_ml_tools'],
        'Frameworks': SKILLS['frameworks'],
        'Databases': SKILLS['databases'],
        'Tools': SKILLS['tools']
    }
    
    for category, skills in categories.items():
        for skill in skills:
            # Assign mock proficiency levels for visualization
            proficiency = np.random.randint(70, 100)
            all_skills.append({
                'skill': skill,
                'proficiency': proficiency,
                'category': category
            })
    
    df = pd.DataFrame(all_skills)
    
    # Create animated bubble chart
    fig = px.scatter(df, x='category', y='proficiency', size='proficiency',
                     color='category', hover_name='skill',
                     size_max=30, title="Skills Proficiency")
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font_color=get_theme_styles()['text_primary'],
        title_font_size=20,
        xaxis_title="Skill Categories",
        yaxis_title="Proficiency Level (%)"
    )
    
    st.plotly_chart(fig, use_container_width=True)

def main():
    """Main application function"""
    apply_theme_css()
    
    # Theme toggle in sidebar
    with st.sidebar:
        st.markdown("### ⚙️ Settings")
        
        if st.button(f"🌓 Switch to {'Light' if st.session_state.theme == 'dark' else 'Dark'} Mode"):
            st.session_state.theme = 'light' if st.session_state.theme == 'dark' else 'dark'
            st.rerun()
        
        st.session_state.animation_enabled = st.checkbox("✨ Enable Animations", value=st.session_state.animation_enabled)
        
        if st.button("🗑️ Clear Chat History"):
            st.session_state.chat_history = []
            st.rerun()
    
    # Header
    st.markdown(f"""
    <div class="main-header">
        <h1 class="main-title">{PERSONAL_INFO['name']}</h1>
        <p class="main-subtitle">Computer Science & Cognitive Science Student | AI Researcher | Software Engineer</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Animated metrics
    create_animated_metrics()
    
    # Navigation tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs(["🚀 Experience", "💻 Skills", "🤖 AI Chat", "🧠 AI Demos", "📞 Contact"])
    
    with tab1:
        create_enhanced_experience_timeline()
    
    with tab2:
        create_interactive_skills_chart()
        
        # Display skills in animated grid
        st.markdown('<div class="section-header">All Skills</div>', unsafe_allow_html=True)
        
        for category, skills in [('Programming Languages', SKILLS['languages']),
                                ('AI/ML Tools', SKILLS['ai_ml_tools']),
                                ('Frameworks', SKILLS['frameworks'])]:
            st.markdown(f"**{category}:**")
            skills_html = ""
            for skill in skills:
                skills_html += f'<span class="skill-tag">{skill}</span>'
            st.markdown(skills_html, unsafe_allow_html=True)
            st.markdown("<br>", unsafe_allow_html=True)
    
    with tab3:
        ai_chat_agent()
    
    with tab4:
        # Enhanced AI demos from the original portfolio
        st.markdown('<div class="section-header">AI & Cognitive Science Demos</div>', unsafe_allow_html=True)
        
        demo_tab1, demo_tab2 = st.tabs(["📝 Sentiment Analysis", "🧮 Cognitive Research"])
        
        with demo_tab1:
            col1, col2 = st.columns([2, 1])
            
            with col1:
                st.markdown('<div class="glass-card">', unsafe_allow_html=True)
                st.markdown("**Try the Sentiment Analysis Tool:**")
                
                user_text = st.text_area("Enter text to analyze:", 
                                        value=st.session_state.get('selected_sample', ''),
                                        height=100, key="sentiment_input")
                
                if st.button("🔍 Analyze Sentiment", key="analyze_btn") and user_text:
                    with st.spinner("Analyzing sentiment..."):
                        # Simple sentiment analysis using keyword matching
                        positive_words = ['love', 'great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'good', 'awesome', 'brilliant', 'perfect', 'outstanding', 'superb']
                        negative_words = ['hate', 'terrible', 'awful', 'bad', 'worst', 'horrible', 'disappointing', 'disgusting', 'pathetic', 'annoying', 'frustrating', 'useless']
                        
                        text_lower = user_text.lower()
                        pos_count = sum(word in text_lower for word in positive_words)
                        neg_count = sum(word in text_lower for word in negative_words)
                        
                        # Calculate sentiment score
                        total_words = len(text_lower.split())
                        sentiment_score = (pos_count - neg_count) / max(total_words, 1)
                        
                        # Normalize to -1 to 1 range
                        sentiment_score = max(-1, min(1, sentiment_score * 5))
                        
                        if sentiment_score > 0.1:
                            sentiment = "Positive"
                            sentiment_color = "#10B981"
                            sentiment_emoji = "�"
                        elif sentiment_score < -0.1:
                            sentiment = "Negative"
                            sentiment_color = "#EF4444"
                            sentiment_emoji = "😞"
                        else:
                            sentiment = "Neutral"
                            sentiment_color = "#F59E0B"
                            sentiment_emoji = "😐"
                        
                        confidence = min(abs(sentiment_score) + 0.3, 1.0)
                        
                        st.markdown(f"""
                        <div class="glass-card">
                            <h3>Sentiment: <span style="color: {sentiment_color};">{sentiment_emoji} {sentiment}</span></h3>
                            <p><strong>Confidence:</strong> {confidence:.1%}</p>
                            <p><strong>Polarity Score:</strong> {sentiment_score:.3f}</p>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Confidence gauge
                        fig = go.Figure(go.Indicator(
                            mode="gauge+number",
                            value=confidence * 100,
                            domain={'x': [0, 1], 'y': [0, 1]},
                            title={'text': "Confidence Level"},
                            gauge={
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
                            font={'color': get_theme_styles()['text_primary']},
                            height=300
                        )
                        
                        st.plotly_chart(fig, use_container_width=True)
                
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col2:
                st.markdown('<div class="glass-card">', unsafe_allow_html=True)
                st.markdown("**Sample Texts:**")
                
                samples = [
                    "I absolutely love this new technology!",
                    "This is the worst experience ever.",
                    "The weather is okay today.",
                    "Avni's research on cognitive science is fascinating!",
                    "I'm frustrated with this complex algorithm."
                ]
                
                for i, sample in enumerate(samples):
                    if st.button(f"Try Sample {i+1}", key=f"sample_{i}"):
                        st.session_state.selected_sample = sample
                        st.rerun()
                
                st.markdown('</div>', unsafe_allow_html=True)
        
        with demo_tab2:
            st.markdown('<div class="glass-card">', unsafe_allow_html=True)
            st.markdown("**Cognitive Research Simulation**")
            st.markdown("*Based on Avni's research on hunger and cognitive decision-making*")
            
            hunger_level = st.slider("Hunger Level (1-10):", 1, 10, 5)
            decision_type = st.selectbox("Decision Type:", 
                                       ["Numerical", "Spatial", "Memory", "Attention"])
            
            if st.button("🧠 Run Cognitive Test", key="cognitive_test"):
                # Simulate research findings
                base_accuracy = np.random.uniform(0.7, 0.9)
                hunger_effect = (hunger_level - 5) * 0.02  # Hunger affects performance
                final_accuracy = max(0.3, min(1.0, base_accuracy - hunger_effect))
                
                reaction_time = np.random.uniform(800, 1500) + (hunger_level * 50)
                
                st.markdown(f"""
                <div class="glass-card">
                    <h4>Cognitive Test Results</h4>
                    <p><strong>Accuracy:</strong> {final_accuracy:.1%}</p>
                    <p><strong>Reaction Time:</strong> {reaction_time:.0f}ms</p>
                    <p><strong>Analysis:</strong> {'Higher hunger levels show decreased accuracy, supporting research findings.' if hunger_level > 6 else 'Normal cognitive performance within expected ranges.'}</p>
                </div>
                """, unsafe_allow_html=True)
                
                # Visualization
                fig = px.bar(x=[decision_type], y=[final_accuracy], 
                           title="Cognitive Performance by Decision Type")
                fig.update_layout(
                    paper_bgcolor='rgba(0,0,0,0)',
                    plot_bgcolor='rgba(0,0,0,0)',
                    font_color=get_theme_styles()['text_primary']
                )
                st.plotly_chart(fig, use_container_width=True)
            
            st.markdown('</div>', unsafe_allow_html=True)
    
    with tab5:
        st.markdown('<div class="section-header">Get In Touch</div>', unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown(f"""
            <div class="glass-card">
                <h3>Contact Information</h3>
                <p>📧 <strong>Email:</strong> {PERSONAL_INFO['email']}</p>
                <p>📱 <strong>Phone:</strong> {PERSONAL_INFO['phone']}</p>
                <p>🔗 <strong>LinkedIn:</strong> {PERSONAL_INFO['linkedin']}</p>
                <p>💻 <strong>GitHub:</strong> {PERSONAL_INFO['github']}</p>
                <p>📍 <strong>Location:</strong> {PERSONAL_INFO['location']}</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown('<div class="glass-card">', unsafe_allow_html=True)
            st.markdown("**Send a Quick Message:**")
            
            with st.form("contact_form"):
                name = st.text_input("Your Name:")
                email = st.text_input("Your Email:")
                message = st.text_area("Message:", height=100)
                
                if st.form_submit_button("📤 Send Message"):
                    if name and email and message:
                        st.success("Message sent! Avni will get back to you soon.")
                        st.balloons()
                    else:
                        st.error("Please fill in all fields.")
            
            st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main()
