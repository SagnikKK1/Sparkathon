# Sparkathon Project

## Setup Instructions

1. Create and activate virtual environment:
```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix/MacOS
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

4. Create a `.env` file in the root directory with the following variables:
```
PROJECT_NAME=Sparkathon
ENVIRONMENT=development
COMMENTS_FILE_PATH=iphone15_comments.txt
OUTPUT_FILE_PATH=Cluster_sentiment.jsonl
SIMILARITY_THRESHOLD=0.75
```

## Project Structure
- `ft1.py`: Main script for sentiment analysis
- `requirements.txt`: Project dependencies
- `.env`: Environment variables (not tracked in git)
- `venv/`: Virtual environment directory (not tracked in git)

## Note
Make sure to add the following to your `.gitignore`:
```
venv/
.env
__pycache__/
*.pyc
``` 