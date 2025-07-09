# Sparkathon Project

A project for sentiment analysis and feature/entity extraction using Reddit and YouTube data.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd sparkathon
```

### 2. Create and Activate a Virtual Environment
```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix/MacOS
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Download spaCy Model
```bash
python -m spacy download en_core_web_sm
```

### 5. Set Up Environment Variables
Create a `.env` file in the root directory with the following content:
```
PROJECT_NAME=Sparkathon
ENVIRONMENT=development
COMMENTS_FILE_PATH=iphone15_comments.txt
OUTPUT_FILE_PATH=Cluster_sentiment.jsonl
SIMILARITY_THRESHOLD=0.75
```

---

## Usage

### Run Sentiment Analysis
```bash
python ft1.py
```

### Scrape Reddit Data
```bash
python scrape_reddit.py
```

### Scrape YouTube Data
```bash
python scrape_youtube.py
```

### Run All (if you want to run all steps in sequence)
```bash
python run_all.py
```

---

## Git Workflow

### Check Current Branch
```bash
git branch
```

### Create a New Branch
```bash
git checkout -b <branch-name>
```

### Stage, Commit, and Push Changes
```bash
git add .
git commit -m "Your commit message"
git push origin <branch-name>
```

### Pull Latest Changes from Main
```bash
git checkout main
git pull origin main
```

### Merge Main into Your Branch
```bash
git checkout <your-branch>
git merge main
```

---

## Project Structure
- `ft1.py`: Main script for sentiment analysis
- `feature_entity_utils.py`: Utility functions for feature/entity extraction
- `reddit_api.py`: Reddit API integration
- `scrape_reddit.py`: Script to scrape Reddit data
- `scrape_youtube.py`: Script to scrape YouTube data
- `run_all.py`: Run all main steps in sequence
- `requirements.txt`: Project dependencies
- `.env`: Environment variables (not tracked in git)
- `venv/`: Virtual environment directory (not tracked in git)

---

## Notes
- Make sure to add the following to your `.gitignore`:
  ```
  venv/
  .env
  __pycache__/
  *.pyc
  ```
- For any issues, ensure your Python version matches the one used in the project (Python 3.8+ recommended).
- If you encounter line ending warnings (LF/CRLF), see the Git documentation for handling line endings on Windows. 