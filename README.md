# 🚀 AI Resume Analyzer — Full MERN Stack SaaS App

A production-ready, full-stack web application that lets users upload their resume (PDF/DOCX) and get an instant **AI-powered ATS score**, skills gap analysis, strengths/weaknesses, job-description matching, and improvement suggestions — built with **MongoDB, Express, React, Node.js** and **Google Gemini AI**.

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── backend/                 # Node.js + Express REST API
│   ├── config/
│   ├── controllers/         # Business logic (auth, resume, admin)
│   ├── middleware/          # JWT auth, file upload (multer)
│   ├── models/               # Mongoose schemas (User, ResumeAnalysis)
│   ├── routes/                # Express routers
│   ├── utils/                  # AI service (Gemini), text extractor
│   ├── uploads/                # Temp file storage (auto-cleared)
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js               # App entry point
│
└── frontend/                  # React + Tailwind CSS SPA
    ├── public/
    └── src/
        ├── components/
        │   └── common/          # Navbar, Footer, ScoreCircle, ProgressBar, Spinner
        ├── context/              # AuthContext (global auth state)
        ├── pages/                 # Home, Login, Register, Dashboard, Upload, ATSResult,
        │                           # JobMatch, History, Profile, AdminDashboard, About, Contact
        ├── services/               # Axios API instance
        ├── App.js                   # Routes
        ├── index.js
        └── index.css                # Tailwind directives + custom styles
```

---

## 🧩 Tech Stack

| Layer          | Technology                                   |
|----------------|-----------------------------------------------|
| Frontend       | React 18, React Router v6, Tailwind CSS       |
| Backend        | Node.js, Express.js                            |
| Database       | MongoDB (Mongoose ODM)                         |
| Authentication | JWT (jsonwebtoken) + bcryptjs                  |
| AI             | Google Gemini API (`gemini-1.5-flash`)          |
| File Parsing   | `pdf-parse` (PDF), `mammoth` (DOCX)             |
| File Upload    | Multer                                          |
| Charts         | Recharts (Radar + Bar charts)                   |
| UX             | react-hot-toast, react-dropzone, react-icons    |

---

## ✅ Prerequisites

Install these before you start:

1. **Node.js** v18+ — [nodejs.org](https://nodejs.org)
2. **MongoDB** — either:
   - Local install ([MongoDB Community](https://www.mongodb.com/try/download/community)), or
   - Free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)
3. **Gemini API Key** (free) — [Google AI Studio](https://makersuite.google.com/app/apikey)
   - *(Alternative: OpenAI API key from [platform.openai.com](https://platform.openai.com) — see AI Setup section below)*

---

## ⚙️ Step 1 — Backend Setup

```bash
cd backend
npm install
```

### Configure `.env`

The backend `.env` file is already created with placeholders. Open `backend/.env` and fill in real values:

```env
PORT=5000
NODE_ENV=development

# MongoDB — paste your connection string here
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/ai-resume-analyzer?retryWrites=true&w=majority

# JWT — use any long random string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
AI_PROVIDER=gemini

# OR use OpenAI instead — set AI_PROVIDER=openai and fill this:
OPENAI_API_KEY=your_openai_api_key_here

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
FRONTEND_URL=http://localhost:3000

# First user to register with this email auto-becomes admin
ADMIN_EMAIL=admin@resumeai.com
ADMIN_PASSWORD=Admin@123456
```

### MongoDB Setup (Atlas — recommended, free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → create a free account
2. Create a free **M0 cluster**
3. Click **Database Access** → add a new database user (username + password)
4. Click **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) for development
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<username>`, `<password>`, and add your database name (`ai-resume-analyzer`) into `MONGODB_URI`

### Gemini API Setup

1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with Google → click **Create API Key**
3. Copy the key into `GEMINI_API_KEY` in `.env`
4. Keep `AI_PROVIDER=gemini`

> 💡 Gemini's free tier is generous and works great for this project. If you'd rather use OpenAI, set `AI_PROVIDER=openai` and add your `OPENAI_API_KEY` — the code in `utils/aiService.js` already supports both.

### Run the backend

```bash
npm run dev      # development (nodemon, auto-restart)
# or
npm start        # production
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

Test it: open `http://localhost:5000/api/health` → should return `{"success":true,"message":"AI Resume Analyzer API is running"}`

---

## ⚙️ Step 2 — Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
```

### Configure `.env`

Already created at `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=AI Resume Analyzer
REACT_APP_VERSION=1.0.0
```
(Change `REACT_APP_API_URL` only when deploying — see Deployment section.)

### Run the frontend

```bash
npm start
```

Opens automatically at `http://localhost:3000` 🎉

---

## 👤 Creating an Admin Account

The first user who registers with the email matching `ADMIN_EMAIL` in the backend `.env` (default `admin@resumeai.com`) is automatically assigned the `admin` role. Simply:

1. Go to `/register`
2. Sign up using `admin@resumeai.com` (or whatever you set as `ADMIN_EMAIL`) with any password
3. Log in → you'll see an **Admin Panel** link in the navbar dropdown

All other registrations default to the `user` role.

---

## 🔌 API Reference

| Method | Endpoint                          | Auth        | Description                          |
|--------|------------------------------------|-------------|----------------------------------------|
| POST   | `/api/auth/register`               | Public      | Create account                          |
| POST   | `/api/auth/login`                  | Public      | Login, returns JWT                      |
| GET    | `/api/auth/profile`                | Bearer JWT  | Get current user                        |
| PUT    | `/api/auth/profile`                | Bearer JWT  | Update profile (name, phone, bio, etc.) |
| PUT    | `/api/auth/change-password`        | Bearer JWT  | Change password                         |
| POST   | `/api/resume/upload`               | Bearer JWT  | Upload resume (multipart `resume` field) → extracts text |
| POST   | `/api/resume/analyze`              | Bearer JWT  | Run Gemini AI analysis on uploaded resume |
| POST   | `/api/resume/match-jd`             | Bearer JWT  | Match resume against a pasted job description |
| GET    | `/api/resume/history`              | Bearer JWT  | Paginated list of past analyses         |
| GET    | `/api/resume/analysis/:id`         | Bearer JWT  | Get one full analysis record            |
| DELETE | `/api/resume/analysis/:id`         | Bearer JWT  | Delete an analysis                      |
| GET    | `/api/admin/users`                 | Admin only  | List/search all users                   |
| GET    | `/api/admin/reports`               | Admin only  | Platform stats, charts, recent activity |
| PUT    | `/api/admin/users/:id/toggle`      | Admin only  | Activate/deactivate a user              |
| DELETE | `/api/admin/users/:id`             | Admin only  | Delete a user + their data               |

All protected routes require header: `Authorization: Bearer <token>`

---

## 🖥️ Pages

| Route               | Description                                  |
|----------------------|-----------------------------------------------|
| `/`                  | Landing page (hero, features, testimonials)   |
| `/about`             | About the product                              |
| `/contact`           | Contact form                                   |
| `/login`             | Login                                          |
| `/register`          | Sign up                                        |
| `/dashboard`         | User dashboard (stats + recent analyses)       |
| `/upload`            | Upload & analyze a resume (step progress UI)   |
| `/results/:id`       | Full ATS result — score, radar chart, skills, suggestions |
| `/job-match/:id`     | Paste JD → get match % + missing skills        |
| `/history`           | All past analyses, searchable, deletable        |
| `/profile`           | Edit profile, change password                   |
| `/admin`             | Admin-only: users table, platform analytics      |

---

## 🛠️ How the AI Analysis Works

1. User uploads PDF/DOCX → `multer` saves it temporarily → `pdf-parse` / `mammoth` extracts raw text → file is deleted, text is stored in MongoDB (`ResumeAnalysis.rawText`).
2. `/api/resume/analyze` sends the raw text to Gemini with a structured prompt requesting strict JSON output: ATS score, skills found/missing, strengths, weaknesses, education/experience/project breakdowns, keyword analysis, and 6-8 suggestions.
3. The parsed JSON is saved back to the same `ResumeAnalysis` document and rendered in `/results/:id` with charts, progress bars, and tag clouds.
4. `/api/resume/match-jd` runs a second Gemini prompt comparing the same resume text against a pasted job description, returning a match percentage, matched/missing skills, and tailored suggestions.

---

## 🚀 Deployment

### Deploy Backend to Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service** → connect your repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or Starter for always-on)
4. Add Environment Variables (same as your `.env`, but:
   - `FRONTEND_URL` → your Vercel frontend URL (e.g. `https://your-app.vercel.app`)
   - `MONGODB_URI` → your Atlas connection string
   - `GEMINI_API_KEY`, `JWT_SECRET`, etc.
5. Deploy. Render gives you a URL like `https://ai-resume-analyzer-api.onrender.com`.

> ⚠️ Render's free tier has an ephemeral filesystem — that's fine here since uploaded files are deleted immediately after text extraction and never need to persist.

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import the same GitHub repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
3. Add Environment Variable:
   - `REACT_APP_API_URL` → `https://ai-resume-analyzer-api.onrender.com/api` (your Render backend URL + `/api`)
4. Deploy. Vercel gives you a URL like `https://ai-resume-analyzer.vercel.app`.

### Final step — connect the two

Go back to your **Render** backend environment variables and set:
```
FRONTEND_URL=https://ai-resume-analyzer.vercel.app
```
Redeploy the backend so CORS allows requests from your live frontend.

---

## 🧪 Local Quick Start (TL;DR)

```bash
# Terminal 1 — backend
cd backend
npm install
# edit .env with your MongoDB URI + Gemini API key
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm start
```

Visit `http://localhost:3000`, register an account, upload a resume, and watch the AI analyze it in real time.

---

## 🔐 Security Notes

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens expire after 7 days (configurable)
- Rate limiting on all `/api/*` routes (100 req / 15 min per IP)
- Helmet.js sets secure HTTP headers
- File upload restricted to PDF/DOCX, max 5MB
- Uploaded files are deleted from disk immediately after text extraction — never stored long-term

---

## 📦 Key NPM Packages

**Backend:** express, mongoose, bcryptjs, jsonwebtoken, multer, pdf-parse, mammoth, @google/generative-ai, helmet, cors, morgan, express-rate-limit

**Frontend:** react, react-router-dom, axios, react-hot-toast, recharts, react-dropzone, react-icons

---

Built with ❤️ as a complete, beginner-friendly, production-ready MERN + AI SaaS reference project.
