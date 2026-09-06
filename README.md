# 🌐 Politaria

> **"A collection, archive, or systematic repository of political, civic, or institutional data."**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?logo=postgresql&logoColor=white)
![Three.js / Globe.gl](https://img.shields.io/badge/3D%20Globe-Globe.gl-black?logo=three.dot.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview

**Politaria** is an open-source civic technology and political intelligence platform designed to systematically archive, explore, and visualize global governance data. 

Through an interactive, hardware-accelerated 3D political globe, structured leadership directories, political party profiles, and comprehensive institutional breakdowns, Politaria provides citizens, researchers, and students with an accessible, unbiased repository of world politics.

---

## ✨ Key Features

- 🌍 **Interactive 3D Political Globe:**
  - Built with **Globe.gl** and **Three.js** using local polygon boundary datasets.
  - Dynamic nation highlighting, custom tooltip cards, and smooth camera fly-to animations.
  - Optimized rendering with hardware acceleration, throttled raycasting, and off-screen auto-pause.
- 🏛️ **Country & Governance Profiles:**
  - In-depth institutional data: system of government, head of state, head of government, and legislative structures.
  - Political spectrum distribution and election timelines.
- 👥 **Leadership & Political Party Directory:**
  - Track current and historical leaders with portrait archives, term lengths, and bios.
  - Detailed profiles of political parties, ideologies, founding dates, and seat distributions.
- 📰 **Civic Analysis & Editorial Repository:**
  - Curated articles, case studies, and institutional analyses of democratic and civic systems.
- 🔍 **Real-Time Search & Filtering:**
  - Instant lookup of countries, governance models, ideologies, and key political figures.
- 🎨 **Modern Dark Glassmorphism UI:**
  - Clean, responsive design built with high accessibility, legible typography, and seamless transitions.

---

## 🛠️ Tech Stack

- **Backend:** Python 3, Django 5.x
- **Database:** PostgreSQL (with `psycopg2` & `dj-database-url`)
- **Frontend:** HTML5, Modern Vanilla JavaScript, CSS3 / Custom Glassmorphism System
- **Visualization:** Globe.gl, Three.js, TopoJSON / GeoJSON geometries
- **GIS / Geometry Tools:** Shapely, Django Countries

---

## 📂 Project Structure

```text
Politics/
├── core/                   # Core configuration and shared utilities
├── countries/              # Country models, views, and data endpoints
├── parties/                # Political party & leadership data
├── articles/               # Civic analysis & publication modules
├── static/
│   ├── css/                # Custom stylesheets & glassmorphism theme
│   ├── js/
│   │   ├── globe.gl.min.js # Local 3D globe visualization engine
│   │   ├── world_globe.js  # Main landing 3D globe controller
│   │   ├── detail_globe.js # Country-specific focused globe
│   │   └── countries_data.js# Geographic polygon & ISO mapping cache
│   └── data/               # GeoJSON datasets (boundaries, coordinates)
├── media/                  # Uploaded leader portraits & party logos
├── templates/              # Django HTML templates
├── manage.py
├── requirements.txt
└── .gitignore



📄 License
This project is open-source and licensed under the 
MIT License.
