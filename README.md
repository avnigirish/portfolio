# Avni Girish - Interactive AI/ML Portfolio

An interactive portfolio website showcasing Avni Girish's background in Computer Science and Cognitive Science, built with FastAPI and Streamlit. The portfolio features AI/ML tools, interactive visualizations, and animated components.

## 🌟 Features

- **Interactive AI Tools**: Sentiment analysis, skill recommendations, and career insights
- **Dynamic Visualizations**: Radar charts, timelines, and interactive graphs using Plotly
- **Responsive Design**: Modern UI with CSS animations and smooth transitions
- **FastAPI Backend**: RESTful API endpoints for data management
- **Streamlit Frontend**: Interactive web interface with multiple pages
- **Real-time Analytics**: Career progression analysis and project insights

## 🛠️ Technologies Used

- **Backend**: FastAPI, Python
- **Frontend**: Streamlit
- **AI/ML**: TextBlob, scikit-learn, transformers
- **Visualization**: Plotly, Matplotlib, Seaborn
- **Data Processing**: Pandas, NumPy
- **Styling**: Custom CSS with animations

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/avnigirish/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

#### Option 1: Streamlit Only (Recommended for demo)
```bash
streamlit run streamlit_app.py
```

#### Option 2: FastAPI + Streamlit (Full functionality)

1. Start the FastAPI backend:
```bash
python main.py
```

2. In a new terminal, start the Streamlit frontend:
```bash
streamlit run streamlit_app.py
```

The FastAPI backend will be available at `http://localhost:8000`
The Streamlit frontend will be available at `http://localhost:8501`

## 📱 Portfolio Sections

### 🏠 Home
- Personal introduction and key statistics
- Quick overview of skills and achievements

### 👨‍🎓 Education
- Rutgers University degree information
- Relevant coursework and organizations

### 💼 Experience
- Detailed work experience timeline
- Achievements and impact metrics

### 🚀 Projects
- Showcase of major projects including MoodSync+ and Automated Car Simulation
- Technology stacks and project descriptions

### 🧠 AI Tools
- **Sentiment Analysis**: Real-time text sentiment analysis with NLP
- **Skill Recommendations**: AI-powered career guidance
- **Career Insights**: Progression analysis and scoring

### 📊 Analytics
- Interactive skill distribution radar charts
- Project technology analysis
- Portfolio statistics and insights

### 📞 Contact
- Contact form with sentiment analysis
- Social media and professional links

## 🤖 AI/ML Features

### Sentiment Analysis
- Real-time sentiment analysis using TextBlob
- Polarity and subjectivity scoring
- Interactive gauge visualization

### Skill Recommendations
- AI-powered skill gap analysis
- Role-specific recommendations (Data Scientist, Software Engineer, AI Engineer)
- Skills matching percentage calculation

### Career Progression Analysis
- Keyword-based achievement analysis
- Leadership, impact, and innovation scoring
- Radar chart visualization of career progression

### Interactive Visualizations
- Skills distribution radar charts
- Technology usage analysis
- Career timeline visualization

## 🎨 Design Features

- **Smooth Animations**: CSS keyframe animations for engaging user experience
- **Responsive Layout**: Adapts to different screen sizes
- **Modern Color Scheme**: Professional gradient backgrounds and clean typography
- **Interactive Elements**: Hover effects and smooth transitions

## 📊 API Endpoints (FastAPI)

- `GET /api/personal-info` - Personal information
- `GET /api/education` - Education details
- `GET /api/skills` - Skills data
- `GET /api/work-experience` - Work experience
- `GET /api/projects` - Projects information
- `POST /api/sentiment-analysis` - Sentiment analysis tool
- `POST /api/skill-recommendations` - Skill recommendations
- `GET /api/career-progression` - Career progression analysis

## 🔧 Customization

To customize this portfolio for your own use:

1. Update `data/resume_data.py` with your personal information
2. Modify the AI tools in `utils/ai_tools.py` as needed
3. Customize styling in the CSS section of `streamlit_app.py`
4. Add your own projects and experiences

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contact

- **Email**: avni123.girish@gmail.com
- **LinkedIn**: [linkedin.com/in/avni-girish](https://linkedin.com/in/avni-girish)
- **GitHub**: [github.com/avnigirish](https://github.com/avnigirish)