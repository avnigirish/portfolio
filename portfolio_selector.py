import streamlit as st
import subprocess
import sys
import os

st.set_page_config(page_title="Portfolio Launcher", page_icon="🚀", layout="wide")

def launch_portfolio(script_name):
    """Launch a specific portfolio version"""
    try:
        # Stop any running Streamlit processes
        subprocess.run(["pkill", "-f", "streamlit"], capture_output=True, text=True)
        
        # Start the selected portfolio
        subprocess.Popen([sys.executable, "-m", "streamlit", "run", script_name, "--server.port=8502"])
        st.success(f"✅ Launching {script_name}...")
        st.info("🌐 Portfolio will be available at: http://localhost:8502")
        
    except Exception as e:
        st.error(f"❌ Error launching portfolio: {str(e)}")

def main():
    st.title("🚀 Avni's Portfolio Launcher")
    st.markdown("Choose which version of the portfolio you'd like to explore:")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        ### 🎨 Enhanced Portfolio
        **Latest Version with:**
        - 🌓 Dark/Light theme toggle
        - ✨ Smooth animations
        - 🤖 Interactive AI chat agent
        - 🔄 Animated 3D company logos
        - 📱 Modern responsive design
        - 🧠 Enhanced AI demos
        """)
        
        if st.button("🚀 Launch Enhanced Portfolio", key="enhanced", type="primary"):
            launch_portfolio("enhanced_portfolio.py")
    
    with col2:
        st.markdown("""
        ### 🛠️ Visual Portfolio (Fixed)
        **Stable Version with:**
        - 📊 Interactive visualizations
        - 🏢 3D company logos
        - 🧪 AI/ML demonstrations
        - 📈 Skills analytics
        - 🎯 Clean professional design
        """)
        
        if st.button("🎯 Launch Visual Portfolio", key="visual"):
            launch_portfolio("visual_portfolio_fixed.py")
    
    with col3:
        st.markdown("""
        ### 📝 Simple Portfolio
        **Streamlit Version:**
        - 📋 Basic information display
        - 🎓 Education & experience
        - 💼 Skills overview
        - 📞 Contact information
        - ⚡ Fast loading
        """)
        
        if st.button("⚡ Launch Simple Portfolio", key="simple"):
            launch_portfolio("streamlit_app.py")
    
    st.markdown("---")
    st.markdown("### 📋 Portfolio Features Comparison")
    
    comparison_data = {
        "Feature": ["Theme Toggle", "Animations", "AI Chat", "3D Logos", "Sentiment Analysis", "Cognitive Demos", "Response Time"],
        "Enhanced": ["✅", "✅", "✅", "✅", "✅", "✅", "Fast"],
        "Visual (Fixed)": ["❌", "❌", "❌", "✅", "✅", "✅", "Fast"],
        "Simple": ["❌", "❌", "❌", "❌", "❌", "❌", "Fastest"]
    }
    
    st.table(comparison_data)
    
    st.markdown("---")
    st.info("💡 **Tip:** The Enhanced Portfolio offers the most interactive experience with modern features!")

if __name__ == "__main__":
    main()
