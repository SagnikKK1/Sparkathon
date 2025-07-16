# Sparkathon

A full-stack platform for scraping, analyzing, and visualizing real user opinions about products from Reddit and YouTube, featuring advanced NLP, dashboards, and a RAG-powered chatbot.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Repository Structure](#repository-structure)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Folder & File Descriptions](#folder--file-descriptions)
- [Additional Notes](#additional-notes)

---

## Project Overview

**Sparkathon** is a data pipeline and dashboard platform that:
- Scrapes user-generated reviews from Reddit and YouTube for any product.
- Uses advanced NLP (NER, clustering, sentiment analysis) to extract insights.
- Visualizes results in a modern dashboard and generates detailed reports.
- Features an interactive RAG-powered chatbot for Q&A on product reputation.

---

## Repository Structure

```
.
├── backend/           # Node.js/Express API server, user auth, pipeline triggers, DB
├── frontend/          # React app for dashboard, chatbot, and user flows
├── NER_and_Dashboard/ # Python pipeline: scraping, NER, clustering, metrics
├── SparKaRag/         # Advanced RAG pipeline, report generation, Q&A
├── requirements.txt   # Python dependencies
├── README.md          # (You are here)
└── ...
```

---

## Setup & Installation

### Prerequisites
- **Python 3.12** (do NOT use 3.13; some wheels may be missing)
- **Node.js** (recommended: v14+ for frontend, v16+ for backend)
- **npm** (Node package manager)
- **PostgreSQL** (for backend database)

### 1. Python Virtual Environment
- In the project root, create a virtual environment named **.venv** (must be named exactly `.venv`):
  ```sh
  python3.12 -m venv .venv
  ```
- Activate the virtual environment:
  - **Windows:**
    ```sh
    .venv\Scripts\activate
    ```
  - **macOS/Linux:**
    ```sh
    source .venv/bin/activate
    ```
- Install Python dependencies:
  ```sh
  pip install -r requirements.txt
  ```

### 2. Backend Setup
- Activate the virtual environment (see above).
- Navigate to the backend folder:
  ```sh
  cd backend
  npm install
  npx prisma generate
  npx prisma db pull
  npm run dev
  ```

### 3. Frontend Setup
- In a new terminal, navigate to the frontend folder:
  ```sh
  cd frontend
  npm install
  npm run dev
  ```

---

## Running the Project

1. **Start the Python virtual environment** in the root directory.
2. **Start the backend server:**
   - `cd backend`
   - `npm run dev`
3. **Start the frontend app:**
   - `cd frontend`
   - `npm run dev`

---

## Folder & File Descriptions

### backend/
- **Purpose:** Node.js/Express API for authentication, user management, pipeline orchestration, and DB access.
- **Key Folders/Files:**
  - `src/index.ts` — Main server entrypoint, sets up routes and middleware.
  - `src/controllers/` — Business logic for auth, user, cards, chatbot, pipeline, etc.
  - `src/routes/` — Express route definitions for each API endpoint.
  - `src/middlewares/auth.ts` — JWT authentication middleware.
  - `prisma/schema.prisma` — Prisma ORM schema for PostgreSQL models.

### frontend/
- **Purpose:** React app for user interface, dashboard, chatbot, login/signup, and data visualization.
- **Key Folders/Files:**
  - `src/pages/` — Main pages: Home, Dashboard, Chatbot, Login, Signup, Loading, About Us.
  - `src/components/` — UI components for dashboard, chatbot, forms, etc.
  - `src/assets/` — Images, Lottie animations, fonts.
  - `src/utils/auth.ts` — Auth utility functions for login/signup/logout.

### NER_and_Dashboard/
- **Purpose:** Python pipeline for scraping, NER, clustering, sentiment analysis, and feature extraction.
- **Key Folders/Files:**
  - `src/scrape_reddit.py` — Scrapes Reddit comments for a product.
  - `src/scrape_youtube.py` — Scrapes YouTube comments for a product.
  - `src/ft1.py` — Clusters noun phrases, scores sentiment, classifies clusters with LLM.
  - `src/card1.py`, `src/card2.py`, `src/card4.py`, `src/card6.py` — Generate dashboard cards (summary, pie, sentiment over time, heatmap).
  - `src/run_all.py` — Orchestrates the full pipeline: scraping, clustering, card generation.
  - `src/feature_entity_utils.py` — Shared NLP and clustering utilities.
  - `json_dumps/` — Output JSONs: clusters, features, entities, etc.
  - `txt_dumps/` — Output raw text dumps from scraping.

### SparKaRag/
- **Purpose:** Advanced RAG (Retrieval-Augmented Generation) pipeline for report generation and chatbot Q&A.
- **Key Folders/Files:**
  - `RAG/` — Main RAG pipeline code:
    - `tasks.py` — Orchestrates the RAG pipeline steps.
    - `topical_chunking.py` — Clusters comments into topics.
    - `summarization.py` — Summarizes topics and builds FAISS index.
    - `inject_context.py` — Adds NER/sentiment context.
    - `report.py` — Generates and cleans product reports.
    - `query.py` — Handles chatbot Q&A using the FAISS index and OpenRouter API.
    - `my_agents.py`, `my_workflow.py` — Agent and workflow logic for report generation.
  - `clusters/` — Topic cluster text files.
  - `extra_context/` — Additional context for RAG (NER, sentiment).
  - `product_report.txt` — Example output report.

---

## Additional Notes

- **.venv must be named exactly `.venv`** in the root directory for the backend to detect and use it.
- **Python 3.12 is required**; do not use 3.13.
- **Database:** Ensure PostgreSQL is running and credentials are set in your environment variables or `.env` files.
- **API Keys:** Some scripts require API keys (Reddit, YouTube, OpenRouter, etc.) in your environment.
- **Troubleshooting:**
  - If you see errors about missing wheels, double-check your Python version and run `pip install -r requirements.txt` again.
  - If the backend cannot find the virtual environment, ensure `.venv` exists in the root and is activated before running backend commands.

---

## License

MIT (or specify your license here)
