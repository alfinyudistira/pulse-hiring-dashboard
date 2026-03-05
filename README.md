# 🎯 Pulse Digital — Hiring Assistant App

> AI-powered candidate evaluation dashboard based on the T-Shaped Marketer model & Schmidt-Hunter methodology.

![Tech](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **8-Competency Weighted Scoring** — based on T-Shaped Marketer framework
- **Non-Compensatory Logic** — Analytics & Paid Ads as critical hurdles (cannot be offset)
- **Radar Chart** — candidate vs ideal profile visualization
- **Salary Analyzer** — IDR market benchmarking vs company budget
- **Auto-Generated Report** — hiring committee summary with strengths/dev areas
- **4 Tabs**: Overview · Competencies · Salary · Report

---

## 🚀 Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open http://localhost:5173
```

---

## 🌐 Deploy to GitHub Pages

### Step 1 — Add homepage to package.json
Open `package.json` and add this line (replace `YOUR_USERNAME` and `YOUR_REPO`):
```json
"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO"
```

### Step 2 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Pulse Digital Hiring Assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3 — Deploy
```bash
npm run deploy
```

### Step 4 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from branch** → branch: `gh-pages`
3. Save → your app is live at `https://YOUR_USERNAME.github.io/YOUR_REPO` 🎉

---

## 🌐 Deploy to Vercel (even easier)

```bash
npm install -g vercel
vercel
```
Done. Vercel auto-detects Vite and gives you a live URL instantly.

---

## 🌐 Deploy to Netlify

```bash
npm run build
# Drag & drop the 'dist' folder to netlify.com/drop
```

---

## 📁 Project Structure

```
pulse-hiring/
├── public/
├── src/
│   ├── App.jsx        ← Main dashboard
│   └── main.jsx       ← Entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 📊 Scoring Logic

| Score | Decision |
|-------|----------|
| 4.0+ | STRONG HIRE |
| 3.5–3.9 | HIRE |
| 3.0–3.4 | MAYBE |
| < 3.0 | REJECT |

**Critical Hurdles** (non-negotiable):
- Data Analytics ≥ 3.5
- Paid Advertising ≥ 3.5
- No single competency below 3.0

---

## 📚 Methodology

Based on:
- Schmidt, F. & Hunter, J. (2016) — structured interviews 26% more predictive
- T-Shaped Marketer model — deep vertical + broad horizontal skills
- Pulse Digital 8-Competency Framework (Q1 2025)

---

*Built for Pulse Digital Talent Acquisition · v2.1*
