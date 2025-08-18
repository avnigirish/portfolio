#!/usr/bin/env python3
"""
Portfolio Launcher
A unified launcher for Avni Girish's modern portfolio
"""

import subprocess
import sys
import os
import webbrowser
import time
from pathlib import Path

def check_requirements():
    """Check if required packages are installed"""
    required_packages = [
        'streamlit', 'fastapi', 'uvicorn', 'pandas', 
        'plotly', 'textblob', 'scikit-learn'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        subprocess.run([sys.executable, '-m', 'pip', 'install'] + missing_packages)
    else:
        print("✅ All required packages are installed")

def launch_visual_portfolio():
    """Launch the visual Streamlit portfolio"""
    print("🎨 Launching Visual Interactive Portfolio...")
    try:
        # Change to the portfolio directory
        os.chdir(Path(__file__).parent)
        
        # Run the visual portfolio
        subprocess.run([
            sys.executable, '-m', 'streamlit', 'run', 
            'visual_portfolio.py',
            '--server.port=8501',
            '--browser.gatherUsageStats=false'
        ])
    except KeyboardInterrupt:
        print("\n👋 Visual portfolio stopped")
    except Exception as e:
        print(f"❌ Error launching visual portfolio: {e}")

def launch_streamlit_app():
    """Launch the modern Streamlit app"""
    print("🚀 Launching Modern Streamlit Portfolio...")
    try:
        # Change to the portfolio directory
        os.chdir(Path(__file__).parent)
        
        # Run the modern Streamlit app
        subprocess.run([
            sys.executable, '-m', 'streamlit', 'run', 
            'modern_streamlit_app.py',
            '--server.port=8502',
            '--browser.gatherUsageStats=false'
        ])
    except KeyboardInterrupt:
        print("\n👋 Streamlit app stopped")
    except Exception as e:
        print(f"❌ Error launching Streamlit app: {e}")

def launch_html_portfolio():
    """Open the modern HTML portfolio in browser"""
    print("🌐 Opening Modern HTML Portfolio...")
    try:
        html_path = Path(__file__).parent / 'modern_portfolio.html'
        webbrowser.open(f'file://{html_path.absolute()}')
        print(f"✅ Portfolio opened at: file://{html_path.absolute()}")
    except Exception as e:
        print(f"❌ Error opening HTML portfolio: {e}")

def show_menu():
    """Show the main menu"""
    print("\n" + "="*60)
    print("🎨 AVNI GIRISH - MODERN PORTFOLIO LAUNCHER")
    print("="*60)
    print("Choose your experience:")
    print()
    print("1. 🎨 Visual Interactive Portfolio (NEW - Project Demos, 3D Charts)")
    print("2. 🌐 Modern HTML Portfolio (Single Page, 3D Models, Animations)")
    print("3. 🚀 Classic Streamlit App (AI Tools, Analytics)")
    print("4. 📱 All Experiences")
    print("5. 🛠️  Check Requirements")
    print("6. 🎮 Run Demo")
    print("7. ❌ Exit")
    print()

def run_demo():
    """Run the portfolio demo"""
    print("🎮 Starting Portfolio Demo...")
    try:
        os.chdir(Path(__file__).parent)
        subprocess.run([sys.executable, 'demo.py'])
    except Exception as e:
        print(f"❌ Error running demo: {e}")

def main():
    """Main launcher function"""
    print("🎭 Welcome to Avni's Modern Portfolio Experience!")
    
    while True:
        show_menu()
        
        try:
            choice = input("Enter your choice (1-7): ").strip()
            
            if choice == '1':
                launch_visual_portfolio()
                
            elif choice == '2':
                launch_html_portfolio()
                input("\nPress Enter to return to menu...")
                
            elif choice == '3':
                launch_streamlit_app()
                
            elif choice == '4':
                print("🎊 Launching all experiences...")
                launch_html_portfolio()
                time.sleep(2)
                print("Starting Visual Portfolio...")
                launch_visual_portfolio()
                
            elif choice == '5':
                check_requirements()
                input("\nPress Enter to return to menu...")
                
            elif choice == '6':
                run_demo()
                input("\nPress Enter to return to menu...")
                
            elif choice == '7':
                print("👋 Thanks for visiting! See you soon!")
                break
                
            else:
                print("❌ Invalid choice. Please enter 1-7.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
