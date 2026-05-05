# Project Omnia

## Deployment & CI/CD

This project uses GitHub Actions to deploy to Google Cloud Run. On every push to `main`, the workflow in `.github/workflows/deploy.yml` will:
- Install dependencies for backend and frontend
- Build the frontend
- Deploy to Cloud Run using secrets

### Required GitHub Secrets
- `GCP_SA_KEY`: Google Cloud service account key (JSON)
- `GCP_PROJECT_ID`: GCP project ID
- `GCP_REGION`: GCP region (e.g., us-central1)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret for authentication


### Local Development
1. Copy `.env.example` to `.env` and fill in your values.
2. Install dependencies:
	- In `backend`: `npm install`
	- In `frontend`: `npm install`
3. Start the backend server:
	- `cd backend`
	- `node index.js` (or `npm start` if you add a start script)
4. Start the frontend dev server:
	- `cd frontend`
	- `npm run dev`
5. Visit [http://localhost:5173/](http://localhost:5173/) in your browser.

### Deployment
1. Push your code to the `main` branch on GitHub.
2. The GitHub Actions workflow will build and deploy your app to Google Cloud Run automatically.
3. Make sure all required secrets are set in your GitHub repo settings.

---

## Diagrams

### Entity Relationship Diagram (ERD)
_Insert your ERD here (e.g., export from dbdiagram.io or draw.io)_

### JWT Authentication Sequence Diagram
_Insert your sequence diagram here (e.g., export from sequence diagram tool)_

---

## AI Log & Critique

### AI Log
_Attach your AI prompt/response log as a PDF or text file._

### Critique
_Write a brief critique highlighting at least two instances where the AI generated flawed, insecure, or inefficient code, and explain how you identified and fixed those issues._

---
