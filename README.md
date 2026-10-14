# CERA — CleanAir & Resilience Application

> An open-source, civic urban carpooling and climate resilience platform designed to combat severe PM2.5 corridor pollution across Delhi NCR and Indian transit arteries through verified high-occupancy vehicle matching, personalized commuter personas, and direct municipal rebates.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-green.svg)](#-cross-platform-compatibility)
[![Status](https://img.shields.io/badge/Status-Active%20Open%20Source-teal.svg)](#)
[![Theme: Strict 3-Shade](https://img.shields.io/badge/Theme-Navy%20%26%20Champagne-0D1C42.svg)](#-strict-three-shade-design-system)

---

## 🌟 Overview

**CERA** (CleanAir & Resilience Application) addresses urban gridlock and winter smog across major Indian transit corridors. By uniting corporate commuters, verified municipal carpool pods, dynamic commuter personas, and intelligent route clustering, CERA shifts urban transit toward low-emission, high-occupancy mobility with measurable carbon offsets and civic rewards.

### Key Capabilities

- 🤖 **CERA-AI Mobility Intelligence Suite:**
  - **The "Smart-Twin" Commute Predictor (Proactive AI):** Anticipates weekly commute patterns and pre-clusters high-alignment rides with 1-tap instant lock-in and bonus Green Credits.
  - **Natural Language "Ride-Scribe" Bar (Conversational UI):** Omnipresent conversational command bar that extracts destination, time, UPI split, and transit pass rebates from natural spoken or typed text without tedious forms.
  - **Visual "Eco-Impact Heatmap" (Data Intelligence):** Interactive live Delhi NCR vector map visualizing PM2.5 dispersion, traffic congestion hotspots, and glowing green clean corridors with real-time carbon avoidance telemetry.
- 👤 **Dynamic Commuter Persona Engine (`CeraUserManager`):**
  - Switch between 5 distinct civic commuter identities with real-time state synchronization across all widgets, navigation badges, and routine forecasts.
- 🧮 **Personal Carbon & Fuel ROI Calculator:**
  - Interactive slider-driven emissions and rupee savings engine calculating yearly fuel reduction, PM2.5 mitigation, and municipal Green Credit tier rollups.
- 🚗 **High-Occupancy Carpool Pod Matcher & Booking:**
  - Route corridor filtering (Cyber City, Ring Road, Noida Expressway, Outer Ring, Shaheed Path), driver credibility scoring, EV powertrain tagging, and one-click seat reservation modal.
- 🎟️ **DigiLocker Civic Voucher Engine:**
  - Live Green Credit redemption for 100% NHAI FASTag waivers, DMRC metro top-ups, and EV charging credits with persistent balance deduction.
- 🩺 **Dynamic Commuter Health Advisory:**
  - Real-time AQI hazard classification with proactive in-cabin HEPA filtration alerts and personalized guidance for each commuter's route.
- ⚡ **Floating Quick-Action Navigation Dock:**
  - Glassmorphic rapid-access dock for jumping directly between AI Smart-Twin, ROI Calculator, Carpool Pods, Civic Vouchers, and page-top.
- 🌓 **Dual-Theme & Strict 3-Shade Architecture:**
  - Calibrated for night commutes and high ambient light with strict contrast and WCAG AA accessibility compliance.

---

## 🎨 Strict Three-Shade Design System

CERA adheres to a disciplined 3-shade dark palette engineered for deep ocular comfort during dawn and dusk commutes:

| Palette Role | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Canvas & Base** | `#0D1C42` | Deep midnight navy background, root canvas, and contrast text base |
| **Surfaces & Borders** | `#22396F` | Royal steel navy card panels, modal backdrops, dialogs, and dividers |
| **Text, Accents & Buttons** | `#FCF1D0` | Warm champagne cream typography, high-contrast buttons, and badges |

Light theme automatically transitions to an editorial newsprint cream palette (`#FDFBF7`, `#F2EFE9`, `#2C2824`) with smooth CSS transitions.

---

## 👥 Commuter Persona Engine (`CeraUserManager`)

CERA includes an integrated multi-persona commuter engine simulating realistic transit profiles across Delhi NCR. Commuter selection instantly cascades into the Hero Greeting, Smart-Twin predictor, Carbon Calculator, and Route Brief:

1. **Adesh Sharma** (`user-adesh`)
   - **Role:** Senior Urban Tech Architect @ DLF Cyber City
   - **Commute:** Rohini Sec 14 ⇄ DLF Cyber City (28 km)
   - **Vehicle:** Tata Nexon EV Max (EV Sedan)
   - **Green Credits:** 420 GC · Tier: Gold
2. **Ananya Roy** (`user-ananya`)
   - **Role:** Climate Policy Analyst @ India Habitat Centre
   - **Commute:** Mayur Vihar Phase 1 ⇄ Lodhi Road (16 km)
   - **Vehicle:** Honda City e:HEV (Hybrid)
   - **Green Credits:** 680 GC · Tier: Platinum
3. **Dr. Rohan Sen** (`user-rohan`)
   - **Role:** AIIMS Resident Pulmonologist @ Ring Road
   - **Commute:** Vasant Kunj ⇄ AIIMS Ansari Nagar (14 km)
   - **Vehicle:** Hyundai Ioniq 5 (EV Crossover)
   - **Green Credits:** 890 GC · Tier: Diamond
4. **Vikram Malhotra** (`user-vikram`)
   - **Role:** Senior VP CleanTech @ Barakhamba Rd
   - **Commute:** Noida Sec 62 ⇄ Connaught Place (22 km)
   - **Vehicle:** MG ZS EV (Electric SUV)
   - **Green Credits:** 310 GC · Tier: Silver
5. **Sneha Kapur** (`user-sneha`)
   - **Role:** Creative Director & Urban Cyclist @ Saket
   - **Commute:** Hauz Khas Enclave ⇄ Saket District Centre (9 km)
   - **Vehicle:** Mahindra XUV400 (EV Compact)
   - **Green Credits:** 550 GC · Tier: Gold

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
├── index.html         # Semantic dashboard layout, modals & ARIA markup
├── styles.css         # 3-shade design system, responsive grids & GPU micro-interactions
├── app.js             # Persona manager, reactive state, carbon calc & CERA-AI engine
├── README.md          # Project documentation and architectural guide
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

## 💻 Cross-Platform & Accessibility Standards

- **WCAG AA Compliance:** Dedicated skip-to-content links, explicit ARIA radiogroups, accessible modal dialogs, and high-contrast keyboard focus indicators (`:focus-visible`).
- **Responsive Viewports:** Fluid flexbox and CSS grid layouts optimized from mobile screens (360px) up to 4K displays.
- **Hardware Acceleration:** Hardware-accelerated CSS animations with `@media (prefers-reduced-motion: reduce)` fallbacks.
- **Cross-Platform Verification:** macOS (Safari, Chrome, Arc), Windows 10/11 (Chrome, Edge, Firefox), Linux (Chrome, Firefox), and iOS/Android mobile browsers.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for academic, personal, and commercial open-source usage.
