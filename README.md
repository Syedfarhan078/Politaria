# 🌐 Politaria

> **"A collection, archive, or systematic repository of political, civic, or institutional data."**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon.tech-4169E1?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Serverless-black?logo=vercel&logoColor=white)
![Three.js / Globe.gl](https://img.shields.io/badge/3D%20Globe-Globe.gl-black?logo=three.dot.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 💡 The Mission: Why Politaria Exists

For millions of people worldwide—including our own families, brothers, sisters, and friends—politics often feels intimidating, distant, and unnecessarily complicated. It is frequently buried under heavy bureaucratic jargon, sensationalized news cycles, and partisan bias. As a result, countless people feel disconnected from the very systems and leadership that govern their daily lives.

**Politaria was created to solve this problem.**

The core purpose of this project is to **bridge the political knowledge gap**:
- **Demystify Governance for Beginners:** Designed from the ground up for people who have little to no prior background in politics, presenting sovereign data clearly, calmly, and objectively.
- **The Complete Story (History + Facts):** Understanding a country's current political climate is impossible without understanding its roots. Politaria integrates constitutional histories, foundational milestones, and fascinating national facts alongside modern government structures.
- **An Open Civic Resource for Everyone:** Whether you are an everyday citizen wanting to understand world news, a student researching international relations, or someone wanting clean, structured facts without propaganda, Politaria is your open civic repository.

---

## ✨ Key Features

- 🌍 **Interactive 3D Political Globe:**
  - Built with **Globe.gl** and **Three.js** using local polygon boundary datasets.
  - Smooth nation hover highlights, interactive click-to-dossier routing, and camera fly-to controls.
  - Optimized with clamped pixel ratios, throttled raycasting, and off-screen auto-pause.
- 📜 **Constitutional & Sovereign Histories:**
  - Chronological narratives detailing how each nation's political identity, constitution, and independence evolved over time.
- 💡 **Fascinating National Facts & Trivia:**
  - Curated civic trivia and unique geopolitical insights that make exploring global governance engaging and memorable.
- 🏛️ **Country & Governance Profiles:**
  - Clear institutional breakdowns: constitutional forms, head of state, head of government, and legislative structures.
  - Interactive SVG parliament hemicycles and multi-year election trend charts.
- 👥 **Executive Succession & Party Directory:**
  - Historical timelines of national leaders with portraits, biographies, and terms in office.
  - Profiles of registered political parties, ideologies, founding dates, and seat distributions.
- ⚡ **Ultra-Fast Performance & Edge Caching:**
  - Serverless PostgreSQL connection pooling via Neon.
  - Global Vercel Edge caching (`@cache_control`) and instant page pre-fetching (`instant.page`) for near 0ms navigation.
  - Native image lazy-loading (`loading="lazy"`) and optimized mobile-first responsiveness.
- 🔍 **SEO & Search Console Ready:**
  - Dynamic `sitemap.xml` automatically indexing all sovereign dossiers.
  - Standard `robots.txt` and custom browser favicons.

---

## 🛠️ Tech Stack

- **Backend:** Python 3.10+, Django 5.x
- **Database:** PostgreSQL (Hosted on Neon.tech with Connection Pooling)
- **Deployment:** Vercel (Python Serverless Functions with Edge CDN)
- **Frontend:** HTML5, Modern Vanilla JavaScript, CSS3 / Custom Dark Glassmorphism Design
- **3D Graphics:** Globe.gl, Three.js, TopoJSON / GeoJSON geometries
- **Static Assets & Media:** WhiteNoise, Django Storage Handlers

---

## 📂 Project Structure

```text
Politics/
├── core/
├── politics_site/          # Django project settings, WSGI entrypoint, and root URLs
│   ├── settings.py         # Database pooling, WhiteNoise, and edge cache configs
│   ├── urls.py             # Root routing (robots.txt, sitemap.xml, favicon, views)
│   └── wsgi.py             # Serverless WSGI application handler
├── world_politics/         # Core application
│   ├── models.py           # Country, Profile, Leader, Party, Election models
│   ├── views.py            # Optimized views with prefetch_related, caching & sitemaps
│   ├── templates/          # Responsive HTML templates & XML sitemap
│   └── static/             # 3D globe scripts, boundary GeoJSON, and brand assets
├── staticfiles/            # Pre-collected production assets
├── media/                  # Country flags, leader portraits, and party logos
├── vercel.json             # Vercel serverless deployment & region configuration
├── manage.py
├── requirements.txt
└── LICENSE
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Python 3.10+**
- **PostgreSQL** (or SQLite for quick local experimentation)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/Politaria.git
   cd Politaria
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables (`.env`):**
   Create a `.env` file in the project root:
   ```env


5. **Run Migrations & Collect Static Files:**
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

6. **Start the Development Server:**
   ```bash
   python manage.py runserver
   ```
   Open `http://127.0.0.1:8000/` in your browser.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
