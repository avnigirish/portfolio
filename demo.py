#!/usr/bin/env python3
"""
Portfolio Demo Script
Showcases the new AI-powered features
"""

from utils.ai_tools import AITools
from data.resume_data import PERSONAL_INFO, SKILLS, WORK_EXPERIENCE
import time

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f"🎭 {title}")
    print("="*60)

def print_section(title):
    """Print a formatted section header"""
    print(f"\n🚀 {title}")
    print("-" * 40)

def demo_sentiment_analysis(ai_tools):
    """Demo the sentiment analysis feature"""
    print_section("Sentiment Analysis Demo")
    
    test_texts = [
        "I absolutely love working with AI and machine learning!",
        "This project is terrible and frustrating to work with.",
        "The weather is nice today, nothing special.",
        "Amazing breakthrough in cognitive science research! So excited!"
    ]
    
    for i, text in enumerate(test_texts, 1):
        print(f"\n{i}. Analyzing: \"{text}\"")
        result = ai_tools.analyze_sentiment(text)
        
        sentiment_emoji = {
            'positive': '😊',
            'negative': '😞', 
            'neutral': '😐'
        }
        
        print(f"   Result: {sentiment_emoji[result['sentiment']]} {result['sentiment'].title()}")
        print(f"   Confidence: {result['confidence']:.1%}")
        print(f"   Polarity: {result['polarity']:.3f}")
        time.sleep(0.5)

def demo_skill_recommendations(ai_tools):
    """Demo the skill recommendation feature"""
    print_section("Skill Recommendations Demo")
    
    career_goals = ["AI/ML Engineer", "Data Scientist", "Software Developer", "Research Scientist"]
    
    for goal in career_goals:
        print(f"\n🎯 Career Goal: {goal}")
        recommendations = ai_tools.recommend_skills(goal)
        
        print("   Top Recommended Skills:")
        for i, skill in enumerate(recommendations[:4], 1):
            print(f"   {i}. {skill}")
        time.sleep(1)

def demo_career_analysis(ai_tools):
    """Demo the career progression analysis"""
    print_section("Career Progression Analysis Demo")
    
    print("🔍 Analyzing career trajectory...")
    time.sleep(1)
    
    insights = ai_tools.analyze_career_progression()
    
    print(f"\n📊 Career Progression Score: {insights['progression_score']}/100")
    print(f"\n💪 Key Strengths:")
    print(f"   {insights['strengths']}")
    
    print(f"\n🌱 Growth Areas:")
    print(f"   {insights['growth_areas']}")
    
    print(f"\n🎯 Recommendations:")
    print(f"   {insights['recommendations']}")
    
    print(f"\n🚀 Career Trajectory:")
    trajectory = insights['career_trajectory']
    print(f"   Current: {trajectory['current_level']}")
    print(f"   Next: {trajectory['next_level']}")
    print(f"   Long-term: {trajectory['long_term_goal']}")

def demo_portfolio_stats():
    """Demo portfolio statistics"""
    print_section("Portfolio Statistics")
    
    print(f"👤 Name: {PERSONAL_INFO['name']}")
    print(f"📍 Location: {PERSONAL_INFO['location']}")
    print(f"📧 Email: {PERSONAL_INFO['email']}")
    
    print(f"\n📊 Skills Overview:")
    for category, skills in SKILLS.items():
        print(f"   {category.title()}: {len(skills)} skills")
    
    total_skills = sum(len(skills) for skills in SKILLS.values())
    print(f"   Total Skills: {total_skills}")
    
    print(f"\n💼 Experience Overview:")
    total_positions = sum(len(exp['positions']) for exp in WORK_EXPERIENCE)
    print(f"   Companies: {len(WORK_EXPERIENCE)}")
    print(f"   Positions: {total_positions}")

def interactive_demo():
    """Run an interactive demo"""
    print_section("Interactive Demo")
    
    ai_tools = AITools()
    
    print("Try the sentiment analysis tool!")
    while True:
        user_input = input("\nEnter text to analyze (or 'quit' to exit): ").strip()
        
        if user_input.lower() in ['quit', 'exit', 'q']:
            break
        
        if user_input:
            result = ai_tools.analyze_sentiment(user_input)
            sentiment_emoji = {'positive': '😊', 'negative': '😞', 'neutral': '😐'}
            
            print(f"Result: {sentiment_emoji[result['sentiment']]} {result['sentiment'].title()} "
                  f"(Confidence: {result['confidence']:.1%})")
        else:
            print("Please enter some text to analyze.")

def main():
    """Main demo function"""
    print_header("AVNI GIRISH - PORTFOLIO AI FEATURES DEMO")
    
    print("🎨 Welcome to the AI-powered portfolio demonstration!")
    print("This demo showcases the intelligent features of the new portfolio.")
    
    # Initialize AI tools
    print("\n🤖 Initializing AI tools...")
    ai_tools = AITools()
    print("✅ AI tools ready!")
    
    # Run demos
    demo_portfolio_stats()
    demo_sentiment_analysis(ai_tools)
    demo_skill_recommendations(ai_tools)
    demo_career_analysis(ai_tools)
    
    # Interactive portion
    print_section("Interactive Session")
    choice = input("Would you like to try the interactive sentiment analysis? (y/n): ").lower()
    
    if choice in ['y', 'yes']:
        interactive_demo()
    
    print_header("DEMO COMPLETE")
    print("🎉 Thank you for exploring the AI features!")
    print("🚀 Launch the full portfolio with: python launch_portfolio.py")
    print("🌐 Or open modern_portfolio.html in your browser")

if __name__ == "__main__":
    main()
