# CERA — CleanAir & Resilience Application

> An open-source, civic urban carpooling and climate resilience platform designed to combat severe PM2.5 corridor pollution across Delhi NCR and Indian transit arteries through verified high-occupancy vehicle matching and direct municipal rebates.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-green.svg)](#-cross-platform-compatibility)
[![Status](https://img.shields.io/badge/Status-Active%20Open%20Source-teal.svg)](#)

---

## 🌟 Overview

**CERA** (CleanAir & Resilience Application) addresses urban gridlock and winter smog across major Indian transit corridors. By uniting corporate commuters, verified municipal carpool pods, and intelligent route clustering, CERA shifts urban transit toward low-emission, high-occupancy mobility with measurable carbon offsets.

### Key Capabilities
- 🤖 **CERA-AI Mobility Intelligence Suite:**
  - **The "Smart-Twin" Commute Predictor (Proactive AI):** Anticipates weekly commute patterns and pre-clusters high-alignment rides with 1-tap instant lock-in and bonus Green Credits.
  - **Natural Language "Ride-Scribe" Bar (Conversational UI):** Omnipresent conversational command bar that extracts destination, time, UPI split, and transit pass rebates from natural spoken or typed text without tedious forms.
  - **Visual "Eco-Impact Heatmap" (Data Intelligence):** Interactive live Delhi NCR vector map visualizing PM2.5 dispersion, traffic congestion hotspots, and glowing green clean corridors with real-time carbon avoidance telemetry.
- 💨 **Live Real-Time AQI Visualizer:** Frameless, high-contrast air quality monitor featuring a continuous spectrum gradient (Good → Moderate → Poor → Severe) and instant station inspection for Delhi NCR, Lucknow, Patna, Mumbai, and Bengaluru.
- 🚗 **High-Occupancy Commute Pods:** Verified corporate and municipal carpool routes along primary expressways (Outer Ring Road, Shaheed Path, Western Express Highway).
- 🏷️ **Civic Vouchers & FASTag Rebates:** Automated toll discounts, metro transit top-ups, and municipal tax incentives for registered green carpools.
- ⚡ **120 FPS Performance:** Engineered with pure CSS hardware-accelerated transforms (`will-change: transform`) and zero main-thread layout thrashing.
- 🌓 **Dual-Theme Design System:** Complete dark and light theme palettes calibrated for maximum readability in high ambient light and night driving conditions.

---

## 🚀 Quick Start (VS Code Live Server)

CERA is built with pure, modern web standards (**HTML5, CSS3, ES6 JavaScript**). There are no build tools, npm packages, or bundlers required. It runs identically across **Windows**, **macOS**, and **Linux**.

### Running Locally with VS Code

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/tanmay119-pera/CERA.git
   cd CERA
   ```

2. **Open in Visual Studio Code:**
   ```bash
   code .
   ```

3. **Launch with Live Server:**
   - Install the **Live Server** extension (by Ritwick Dey) in VS Code if you haven't already.
   - Right-click `index.html` in the VS Code file explorer.
   - Click **"Open with Live Server"** (or click the **"Go Live"** button in the bottom status bar).
   - Your default browser will launch at `http://127.0.0.1:5500/index.html`.

### Alternative: Python Simple Server
If you prefer running via terminal:
```bash
# macOS / Linux / Windows (PowerShell)
python3 -m http.server 3000
# or
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

---

## 📁 Repository Structure

```
CERA/
├── index.html         # Main application markup & semantic layout
├── styles.css         # Dual-theme design system, typography & GPU transforms
├── app.js             # High-performance event loop, theme toggle & AQI logic
├── README.md          # Project documentation and setup guide
├── LICENSE            # MIT Open Source License
├── .gitignore         # OS and IDE ignore rules
└── images/            # High-resolution transit, vehicle & infrastructure assets
    ├── clean_carpool.jpg
    ├── charging_plaza.jpg
    ├── ev_corridor.jpg
    ├── fastag_toll.jpg
    ├── metro_hub.jpg
    ├── driver_rajesh.jpg
    ├── driver_priya.jpg
    ├── hero.jpg
    ├── civic.jpg
    ├── app.jpg
    ├── earth_night.jpg
    ├── earth_day.jpg
    ├── india_night.png
    └── carpool.jpg
```

---

## 💻 Cross-Platform Compatibility

CERA has been thoroughly verified on:
- **Windows 10 / 11** (Google Chrome, Microsoft Edge, Mozilla Firefox)
- **macOS (Intel & Apple Silicon)** (Safari, Chrome, Arc, Brave)
- **Linux** (Chrome, Firefox)
- **Mobile Browsers** (iOS Safari, Android Chrome)

All asset references use forward-slash relative paths (`images/...`), ensuring cross-platform stability without pathname capitalization or separator conflicts.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for academic, personal, and commercial open-source usage.
