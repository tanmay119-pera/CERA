/* ═══════════════════════════════════════════════════════════════
   CERA — Interactive 3D WebGL (Three.js) & Depth Engine
   3D Tilt Cards · Dynamic Glare · Theme Sync · Form Logic
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initialize all interactive modules
  init3DCardTilt();
  initThemeToggle();
  initMobileMenu();
  initAccordion();
  initCounterAnimations();
  initPodButtons();
  initVoucherButtons();
  initBriefForm();
  initHeroAQICard();
  initCeraAI();
  initCeraAIShortcuts();
  initCeraOmnibar();
});

/* ═══════════════════════════════════════════════════════════════
   1. REALISTIC 3D PERSPECTIVE CARD TILT & SPECULAR GLARE
   ═══════════════════════════════════════════════════════════════ */
function init3DCardTilt() {
  // Smooth GPU-accelerated CSS transforms handle card hover elevations
  // Eliminating JavaScript mousemove listeners removes all layout thrashing & scroll hitching
}

/* ═══════════════════════════════════════════════════════════════
   3. DUAL-THEME SWITCHER
   ═══════════════════════════════════════════════════════════════ */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Restore persisted theme
  const saved = localStorage.getItem('cera-theme');
  if (saved) {
    root.setAttribute('data-theme', saved);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('cera-theme', next);

      if (window.lucide) {
        lucide.createIcons();
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   4. MOBILE NAVIGATION DRAWER
   ═══════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('.mobile-nav-item').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ═══════════════════════════════════════════════════════════════
   5. ARCHITECTURE ACCORDION
   ═══════════════════════════════════════════════════════════════ */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('accordion-item--active');

      // Close all items
      items.forEach(i => {
        i.classList.remove('accordion-item--active');
        const state = i.querySelector('.accordion-state');
        if (state) state.textContent = '+';
      });

      // If clicked item wasn't open, open it
      if (!isActive) {
        item.classList.add('accordion-item--active');
        const state = item.querySelector('.accordion-state');
        if (state) state.textContent = '−';
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   6. INTERSECTION-OBSERVER ANIMATED STAT COUNTERS
   ═══════════════════════════════════════════════════════════════ */
function initCounterAnimations() {
  const counters = [
    { el: document.getElementById('co2-counter'), target: 42.5, prefix: '', decimals: 1 },
    { el: document.getElementById('cost-counter'), target: 1450, prefix: '₹', decimals: 0 },
    { el: document.getElementById('credits-counter'), target: 340, prefix: '', decimals: 0 },
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const cfg = counters.find(c => c.el === entry.target);
      if (cfg && !cfg.done) {
        cfg.done = true;
        animateNumber(cfg);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach(c => {
    if (c.el) observer.observe(c.el);
  });
}

function animateNumber({ el, target, prefix, decimals }) {
  const duration = 1400;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // Cubic ease out
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = ease * target;

    el.textContent = prefix + (decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString('en-IN'));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════════
   7. AI POD CARDS — "CONNECT & RIDE" BUTTONS
   ═══════════════════════════════════════════════════════════════ */
function initPodButtons() {
  document.querySelectorAll('.btn--tactile-ride').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pod-card');
      const driver = card ? card.querySelector('.driver-name').textContent : 'the driver';

      btn.innerHTML = '<span>✓ REQUEST DISPATCHED</span>';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'default';

      displayToast(`Carpool handshake sent to ${driver}. GPS Bluetooth handshake pending vehicle boarding.`);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   8. CIVIC BENEFIT REDEMPTION BUTTONS
   ═══════════════════════════════════════════════════════════════ */
function initVoucherButtons() {
  document.querySelectorAll('.btn--voucher-redeem').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.voucher-pass');
      const title = card ? card.querySelector('.voucher-pass__title').textContent : 'Civic Voucher';

      btn.textContent = '✓ CREDITED TO DIGILOCKER';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'default';

      displayToast(`"${title}" voucher cleared via DPI fast-path. Barcode added to your DigiLocker app.`);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   9. CORRIDOR BRIEF INQUIRY FORM
   ═══════════════════════════════════════════════════════════════ */
function initBriefForm() {
  const form = document.getElementById('commute-brief-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origin = document.getElementById('commute-origin').value;

    btn.textContent = 'TRANSMITTING BRIEF TO SPATIAL ENGINE...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ BRIEF ACCEPTED — CLUSTERING IN PROGRESS';
      btn.style.background = 'var(--green)';
      btn.style.color = '#FFFFFF';
      displayToast(`Corridor brief for "${origin}" logged! We will notify you with 3 verified ride matches within 24h.`);
    }, 900);
  });
}

/* ═══════════════════════════════════════════════════════════════
   10. FLOATING TOAST NOTIFICATION
   ═══════════════════════════════════════════════════════════════ */
function displayToast(msg) {
  let box = document.getElementById('cera-toast-wrap');
  if (!box) {
    box = document.createElement('div');
    box.id = 'cera-toast-wrap';
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      zIndex: '99999',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    });
    document.body.appendChild(box);
  }

  const toast = document.createElement('div');
  Object.assign(toast.style, {
    background: 'var(--bg-secondary)',
    color: 'var(--text-main)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '0.86rem',
    fontWeight: '600',
    fontFamily: "'Noto Sans', sans-serif",
    boxShadow: 'var(--shadow-heavy)',
    maxWidth: '420px',
    pointerEvents: 'auto',
    opacity: '0',
    transform: 'translateY(20px)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  });

  toast.textContent = msg;
  box.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 350);
  }, 4200);
}

/* ═══════════════════════════════════════════════════════════════
   9. INTERACTIVE HERO AQI BAR & CORRIDOR SWITCHER
   ═══════════════════════════════════════════════════════════════ */
function initHeroAQICard() {
  const cityRows = document.querySelectorAll('.city-bar-row');
  if (!cityRows.length) return;

  const CITIES_DATA = {
    delhi: {
      city: 'Delhi NCR',
      corridor: 'Anand Vihar & Ring Road Corridor',
      aqi: 284,
      status: 'Severe Air Quality',
      statusClass: 'status--severe',
      colorClass: 'text-red',
      barPct: 82,
      pm25: '184 µg/m³',
      pm10: '312 µg/m³',
      no2: '78 ppb',
      co2: '+38% Peak',
      tip: '<strong>Civic Advisory:</strong> High-occupancy carpools exempt from odd-even corridor penalties. 2.5× Green Credits active.'
    },
    lucknow: {
      city: 'Lucknow',
      corridor: 'Shaheed Path & Gomti Nagar Hub',
      aqi: 268,
      status: 'Severe Air Quality',
      statusClass: 'status--severe',
      colorClass: 'text-red',
      barPct: 76,
      pm25: '174 µg/m³',
      pm10: '288 µg/m³',
      no2: '64 ppb',
      co2: '+29% Peak',
      tip: '<strong>Winter Smog Advisory:</strong> Shared electric carpools earn double municipal tax rebates on daily commutes.'
    },
    patna: {
      city: 'Patna',
      corridor: 'Bailey Road & Ganga Pathway',
      aqi: 245,
      status: 'Severe Air Quality',
      statusClass: 'status--severe',
      colorClass: 'text-red',
      barPct: 71,
      pm25: '156 µg/m³',
      pm10: '265 µg/m³',
      no2: '58 ppb',
      co2: '+26% Peak',
      tip: '<strong>Clean Air Corridor:</strong> Priority transit corridor active. High-occupancy vehicles receive arterial clearance.'
    },
    mumbai: {
      city: 'Mumbai',
      corridor: 'Western Express & Coastal Road',
      aqi: 142,
      status: 'Moderate Air Quality',
      statusClass: 'status--moderate',
      colorClass: 'text-amber',
      barPct: 44,
      pm25: '64 µg/m³',
      pm10: '128 µg/m³',
      no2: '42 ppb',
      co2: '+18% Peak',
      tip: '<strong>Coastal Maritime Airflow:</strong> Coastal Road & Sea Link carpool toll waivers active for registered 3+ rides.'
    },
    bengaluru: {
      city: 'Bengaluru',
      corridor: 'Outer Ring Road (ORR) & Whitefield',
      aqi: 58,
      status: 'Good Air Quality',
      statusClass: 'status--good',
      colorClass: 'text-green',
      barPct: 19,
      pm25: '22 µg/m³',
      pm10: '48 µg/m³',
      no2: '21 ppb',
      co2: 'Normal',
      tip: '<strong>Clean Air Benchmark:</strong> Tech park shared transit maintains optimal city air standards.'
    }
  };

  const displayCity = document.getElementById('aqi-display-city');
  const displayCorridor = document.getElementById('aqi-display-corridor');
  const displayVal = document.getElementById('aqi-display-val');
  const displayBadge = document.getElementById('aqi-display-badge');
  const displayStatus = document.getElementById('aqi-display-status');
  const displayPointer = document.getElementById('aqi-pointer');
  const displayPm25 = document.getElementById('aqi-display-pm25');
  const displayPm10 = document.getElementById('aqi-display-pm10');
  const displayNo2 = document.getElementById('aqi-display-no2');
  const displayCo2 = document.getElementById('aqi-display-co2');
  const displayTip = document.getElementById('aqi-display-tip');

  // Navbar Capsule Elements
  const capsuleWrapper = document.getElementById('air-capsule-wrapper');
  const capsuleBtn = document.getElementById('air-capsule-btn');
  const capsuleCityName = document.getElementById('capsule-city-name');
  const capsuleAqiVal = document.getElementById('capsule-aqi-val');
  const capsuleBadge = document.getElementById('capsule-badge');
  const capsuleBadgeText = document.getElementById('capsule-badge-text');
  const capsuleRadarDot = document.getElementById('capsule-radar-dot');
  const capsuleCorridorTag = document.getElementById('capsule-corridor-tag');

  const popoverAqiVal = document.getElementById('popover-aqi-val');
  const popoverAqiStatus = document.getElementById('popover-aqi-status');
  const popoverPm25 = document.getElementById('popover-pm25');
  const popoverNo2 = document.getElementById('popover-no2');
  const popoverCityBtns = document.querySelectorAll('.popover-city-btn');
  const popoverCloseLink = document.getElementById('popover-close-link');

  function updateAirTelemetry(key) {
    const data = CITIES_DATA[key];
    if (!data) return;

    // 1. Update Hero Visualizer
    if (displayCity) displayCity.textContent = data.city;
    if (displayCorridor) displayCorridor.textContent = data.corridor;
    if (displayVal) {
      displayVal.textContent = data.aqi;
      displayVal.className = `aqi-val-massive ${data.colorClass}`;
    }
    if (displayBadge) {
      displayBadge.className = `aqi-badge-status ${data.statusClass}`;
    }
    if (displayStatus) {
      displayStatus.textContent = data.status;
      displayStatus.className = `aqi-severity-label ${data.colorClass}`;
    }
    if (displayPointer) {
      displayPointer.style.left = `${data.barPct}%`;
      const valElem = displayPointer.querySelector('.aqi-pointer__val');
      if (valElem) valElem.textContent = data.aqi;
    }
    if (displayPm25) displayPm25.textContent = data.pm25;
    if (displayPm10) displayPm10.textContent = data.pm10;
    if (displayNo2) displayNo2.textContent = data.no2;
    if (displayCo2) {
      displayCo2.textContent = data.co2;
      displayCo2.className = `pollutant-val ${data.colorClass}`;
    }
    if (displayTip) {
      displayTip.innerHTML = `<i data-lucide="info" class="icon icon--xs"></i> ${data.tip}`;
    }

    // 2. Update Navbar Telemetry Capsule
    if (capsuleCityName) capsuleCityName.textContent = data.city;
    if (capsuleAqiVal) capsuleAqiVal.textContent = data.aqi;

    let badgeCategory = 'severe';
    let badgeLabel = 'ALERT';
    if (data.aqi < 100) {
      badgeCategory = 'good';
      badgeLabel = 'GOOD';
    } else if (data.aqi < 200) {
      badgeCategory = 'moderate';
      badgeLabel = 'MODERATE';
    }

    if (capsuleBadge) {
      capsuleBadge.className = `capsule-badge capsule-badge--${badgeCategory}`;
    }
    if (capsuleBadgeText) {
      capsuleBadgeText.textContent = badgeLabel;
    }
    if (capsuleRadarDot) {
      capsuleRadarDot.className = `radar-core radar-core--${badgeCategory}`;
    }

    // 3. Update Popover
    if (popoverAqiVal) {
      popoverAqiVal.textContent = data.aqi;
      popoverAqiVal.className = `popover-aqi-val ${data.colorClass}`;
    }
    if (popoverAqiStatus) {
      popoverAqiStatus.textContent = data.status;
      popoverAqiStatus.className = `popover-status ${data.colorClass}`;
    }
    if (popoverPm25) popoverPm25.textContent = data.pm25;
    if (popoverNo2) popoverNo2.textContent = data.no2;
    if (capsuleCorridorTag) capsuleCorridorTag.textContent = data.corridor;

    // 4. Synchronize Active Buttons
    cityRows.forEach(r => {
      r.classList.toggle('active', r.getAttribute('data-city-key') === key);
    });
    popoverCityBtns.forEach(b => {
      b.classList.toggle('popover-city-btn--active', b.getAttribute('data-city') === key);
    });

    if (window.lucide) lucide.createIcons();
  }

  // Hero city bar clicks
  cityRows.forEach(row => {
    row.addEventListener('click', () => {
      const key = row.getAttribute('data-city-key');
      updateAirTelemetry(key);
    });
  });

  // Popover city button clicks
  popoverCityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.getAttribute('data-city');
      updateAirTelemetry(key);
    });
  });

  // Toggle Capsule Popover
  if (capsuleBtn && capsuleWrapper) {
    capsuleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = capsuleWrapper.classList.toggle('is-open');
      capsuleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!capsuleWrapper.contains(e.target)) {
        capsuleWrapper.classList.remove('is-open');
        capsuleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        capsuleWrapper.classList.remove('is-open');
        capsuleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (popoverCloseLink && capsuleWrapper) {
    popoverCloseLink.addEventListener('click', () => {
      capsuleWrapper.classList.remove('is-open');
      if (capsuleBtn) capsuleBtn.setAttribute('aria-expanded', 'false');
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   11. CERA-AI SUITE (SMART-TWIN, RIDE-SCRIBE, ECO-IMPACT HEATMAP)
   ═══════════════════════════════════════════════════════════════ */

// System & Contextual Intelligence Engine
const CeraAISystem = {
  detectUserSystem() {
    const ua = navigator.userAgent || '';
    const platform = navigator.userAgentData?.platform || navigator.platform || '';

    // OS Detection
    let os = 'Unknown OS';
    let osShort = 'OS';
    let osIcon = 'cpu';
    let shortcutKey = 'Ctrl';
    let shortcutSymbol = 'Ctrl+K';

    if (/Mac|iPhone|iPad|iPod/i.test(platform) || /Macintosh|Mac OS X/i.test(ua)) {
      os = 'macOS';
      osShort = 'Mac';
      osIcon = 'laptop';
      shortcutKey = 'Cmd';
      shortcutSymbol = '⌘K';
    } else if (/Win/i.test(platform) || /Windows/i.test(ua)) {
      os = 'Windows';
      osShort = 'Windows';
      osIcon = 'monitor';
      shortcutKey = 'Ctrl';
      shortcutSymbol = 'Ctrl+K';
    } else if (/Android/i.test(ua)) {
      os = 'Android';
      osShort = 'Android';
      osIcon = 'smartphone';
      shortcutKey = 'Tap';
      shortcutSymbol = 'Tap AI';
    } else if (/Linux/i.test(platform) || /Linux/i.test(ua)) {
      os = 'Linux';
      osShort = 'Linux';
      osIcon = 'terminal';
      shortcutKey = 'Ctrl';
      shortcutSymbol = 'Ctrl+K';
    }

    // Browser Detection
    let browser = 'Modern Browser';
    if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
    else if (/Chrome\//i.test(ua)) browser = 'Google Chrome';
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Apple Safari';
    else if (/Firefox\//i.test(ua)) browser = 'Mozilla Firefox';
    else if (/Arc\//i.test(ua)) browser = 'Arc Browser';

    // Display & Rendering Specs
    const dpr = window.devicePixelRatio || 1;
    const isRetina = dpr >= 2;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const displayInfo = isRetina ? `Retina @ ${dpr}x` : `${screenWidth}×${screenHeight}`;

    return {
      os,
      osShort,
      osIcon,
      shortcutKey,
      shortcutSymbol,
      browser,
      displayInfo,
      dpr,
      isRetina,
      isMobile: /Mobi|Android|iPhone/i.test(ua)
    };
  },

  getCommuteContext() {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday...

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[day];

    let timePeriod = 'Morning';
    let greetingPrefix = 'Good morning';
    let isRushHour = false;
    let commuteContext = 'Morning Workstation Transit';

    if (hours >= 5 && hours < 12) {
      timePeriod = 'Morning';
      greetingPrefix = 'Good morning';
      isRushHour = hours >= 8 && (hours < 10 || (hours === 10 && mins <= 30));
      commuteContext = isRushHour ? 'Peak Morning Rush Hour (Arterial Inflow)' : 'Morning Corridor Transit';
    } else if (hours >= 12 && hours < 17) {
      timePeriod = 'Afternoon';
      greetingPrefix = 'Good afternoon';
      isRushHour = false;
      commuteContext = 'Midday Solar EV Charging & Express Interchange';
    } else if (hours >= 17 && hours < 22) {
      timePeriod = 'Evening';
      greetingPrefix = 'Good evening';
      isRushHour = hours >= 17 && hours <= 20;
      commuteContext = isRushHour ? 'Evening Return Rush (Barapullah & Ring Road Congestion)' : 'Evening Civic Transit';
    } else {
      timePeriod = 'Night';
      greetingPrefix = 'Good night';
      isRushHour = false;
      commuteContext = 'Off-Peak Low-Emission Night Corridors';
    }

    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let routineDayKey = 'mon';
    if (day === 3 || day === 4) routineDayKey = 'wed';
    else if (day === 5 || day === 6 || day === 0) routineDayKey = 'fri';

    return {
      dayName,
      timePeriod,
      greetingPrefix,
      isRushHour,
      commuteContext,
      timeFormatted,
      routineDayKey,
      hours,
      mins
    };
  },

  getHardwareTelemetry() {
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Multi-Core CPU';
    const ram = navigator.deviceMemory ? `${navigator.deviceMemory}GB RAM` : 'Optimized RAM';
    
    let netType = 'High-Speed';
    if (navigator.connection) {
      const conn = navigator.connection;
      if (conn.effectiveType) {
        netType = conn.effectiveType.toUpperCase();
      } else if (conn.type) {
        netType = conn.type;
      }
    } else if (!navigator.onLine) {
      netType = 'Offline Sync';
    }

    return {
      cores,
      ram,
      netType,
      isOnline: navigator.onLine,
      telemetrySummary: `${cores} • ${ram} • ${netType}`
    };
  }
};

function initCeraAI() {
  // ─── SYSTEM ENVIRONMENT TELEMETRY POPULATION ───
  try {
    const sysInfo = CeraAISystem.getSystemInfo();
    const hwInfo = CeraAISystem.getHardwareTelemetry();
    const sysClientLabel = document.getElementById('ai-sys-client-label');
    const sysHwLabel = document.getElementById('ai-sys-hw-label');
    const dockKbdHint = document.getElementById('ai-dock-kbd-hint');

    if (sysClientLabel) {
      sysClientLabel.textContent = `Client: ${sysInfo.os} · ${sysInfo.browser}`;
    }
    if (sysHwLabel) {
      sysHwLabel.textContent = `(${sysInfo.displayInfo} • ${hwInfo.telemetrySummary})`;
    }
    if (dockKbdHint) {
      dockKbdHint.textContent = sysInfo.shortcutKey;
      dockKbdHint.title = `Global Omnibar (${sysInfo.shortcutKey})`;
    }
  } catch (err) {
    console.warn('CERA-AI System Telemetry initialization warning:', err);
  }

  // ─── A. THE "SMART-TWIN" COMMUTE PREDICTOR (PROACTIVE AI) ───
  const lockBtn = document.getElementById('smart-twin-lock-btn');
  const lockBtnText = document.getElementById('smart-twin-btn-text');
  const feedbackBanner = document.getElementById('smart-twin-feedback');
  const twinText = document.getElementById('smart-twin-text');
  const creditsCounter = document.getElementById('credits-counter');
  const co2Counter = document.getElementById('co2-counter');
  const routinePills = document.querySelectorAll('.routine-pill');

  const routines = {
    mon: {
      user: 'Adesh',
      dest: 'Connaught Place',
      driver: 'Priya M.',
      driverImg: 'images/driver_priya.jpg',
      driverMeta: '★ 4.9 · 87 verified trips · Tata Nexon EV (Zero Tailpipe PM2.5)',
      matchPct: '98%',
      startPoint: 'Sector Gate 4',
      startTime: '08:35 AM · 300m walk',
      corridor: '14.2 km · Clean Barapullah Route',
      endPoint: 'Connaught Place',
      endTime: '09:12 AM · Outer Circle',
      fare: '₹60',
      credits: '+50 Credits',
      co2: '-2.4 kg CO₂',
      quote: 'Hey <strong>Adesh</strong>! I noticed you usually head to <strong>Connaught Place</strong> on Mondays. I’ve pre-matched you with <strong>Priya</strong> (98% route alignment, EV Sedan). Tap to lock in your ride and claim your daily <strong>50 Green Credits</strong>.'
    },
    wed: {
      user: 'Adesh',
      dest: 'Cyber City Gurugram',
      driver: 'Rajesh K.',
      driverImg: 'images/driver_rajesh.jpg',
      driverMeta: '★ 4.8 · 112 verified trips · Tata Nexon EV (Clean Corridor Tagged)',
      matchPct: '94%',
      startPoint: 'Rohini Sector 11',
      startTime: '08:20 AM · 200m walk',
      corridor: '26.8 km · NH-48 EV Express Lane',
      endPoint: 'Cyber City DLF',
      endTime: '09:18 AM · Cyber Hub Gate 2',
      fare: '₹75',
      credits: '+60 Credits',
      co2: '-3.8 kg CO₂',
      quote: 'Good morning <strong>Adesh</strong>! For your Wednesday commute to <strong>Cyber City</strong>, I’ve pre-clustered a seat with <strong>Rajesh</strong> (94% route match, priority HOV lane). Tap to lock in and earn <strong>60 Green Credits</strong>.'
    },
    fri: {
      user: 'Adesh',
      dest: 'Noida Sector 62',
      driver: 'Vikram S.',
      driverImg: 'images/driver_rajesh.jpg',
      driverMeta: '★ 4.6 · 34 verified trips · MG ZS EV (Zero Emission)',
      matchPct: '91%',
      startPoint: 'Lajpat Nagar Ring Road',
      startTime: '08:45 AM · Metro Pillar 14',
      corridor: '18.4 km · DND Clean Flyway',
      endPoint: 'Noida Sector 62',
      endTime: '09:25 AM · Institutional Area',
      fare: '₹55',
      credits: '+45 Credits',
      co2: '-2.1 kg CO₂',
      quote: 'Heading to <strong>Noida Sector 62</strong> this Friday, <strong>Adesh</strong>? I’ve held seat #2 in <strong>Vikram’s</strong> MG ZS EV via DND Flyway (91% route alignment). Lock in now for <strong>45 Green Credits</strong>.'
    }
  };

  let isLocked = false;
  const commuteContext = CeraAISystem.getCommuteContext();
  let currentDay = commuteContext.routineDayKey || 'mon';

  function buildSystemGreeting(routine, sys, ctx) {
    const greeting = ctx.greetingPrefix;
    const timeStr = ctx.timeFormatted;
    const osName = sys.os;
    const rush = ctx.isRushHour ? ` <span class="ai-greeting-alert">⚡ ${ctx.commuteContext}</span>` : '';
    return `"${greeting}, <strong>${routine.user}</strong>! Connected from your <strong>${osName}</strong> system at ${timeStr}.${rush} For your <strong>${ctx.dayName}</strong> commute to <strong>${routine.dest}</strong>, I’ve pre-matched you with <strong>${routine.driver}</strong> (${routine.matchPct} route alignment, EV Sedan). Tap to lock in your ride and claim your daily <strong>50 Green Credits</strong>."`;
  }

  function applyRoutine(day) {
    currentDay = day;
    const data = routines[day];
    if (!data) return;

    routinePills.forEach(p => p.classList.toggle('routine-pill--active', p.dataset.day === day));

    if (twinText) twinText.innerHTML = buildSystemGreeting(data, sysInfo, commuteContext);

    const driverAvatar = document.querySelector('.twin-driver-avatar');
    if (driverAvatar) driverAvatar.src = data.driverImg;

    const driverName = document.querySelector('.twin-driver-name');
    if (driverName) driverName.textContent = data.driver;

    const driverMeta = document.querySelector('.twin-driver-meta');
    if (driverMeta) driverMeta.textContent = data.driverMeta;

    const matchPct = document.querySelector('.twin-match-pct');
    if (matchPct) matchPct.textContent = data.matchPct;

    const ptNames = document.querySelectorAll('.twin-point-name');
    if (ptNames[0]) ptNames[0].textContent = data.startPoint;
    if (ptNames[1]) ptNames[1].textContent = data.endPoint;

    const ptTimes = document.querySelectorAll('.twin-point-time');
    if (ptTimes[0]) ptTimes[0].textContent = data.startTime;
    if (ptTimes[1]) ptTimes[1].textContent = data.endTime;

    const corridorElem = document.querySelector('.twin-route-connector span');
    if (corridorElem) corridorElem.textContent = data.corridor;

    const perks = document.querySelectorAll('.twin-perk .perk-val');
    if (perks[0]) perks[0].textContent = data.fare;
    if (perks[1]) perks[1].textContent = data.credits;
    if (perks[2]) perks[2].textContent = data.co2;

    // Reset lock state on routine change
    isLocked = false;
    if (lockBtn) lockBtn.classList.remove('is-locked');
    if (lockBtnText) lockBtnText.textContent = `1-TAP LOCK IN RIDE (${data.credits})`;
    if (feedbackBanner) feedbackBanner.style.display = 'none';

    if (window.lucide) lucide.createIcons();
  }

  // Update routine clock sync indicator
  const clockSync = document.getElementById('ai-clock-sync');
  if (clockSync) {
    clockSync.innerHTML = `<i data-lucide="clock" class="icon icon--xs"></i> <span>${commuteContext.timeFormatted} · ${commuteContext.dayName} Routine Sync</span>`;
  }

  // Initial routine display
  applyRoutine(currentDay);

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      if (!isLocked) {
        isLocked = true;
        lockBtn.classList.add('is-locked');
        if (lockBtnText) {
          lockBtnText.innerHTML = `✓ LOCKED IN · CONFIRMED WITH ${routines[currentDay].driver.toUpperCase()}`;
        }
        if (feedbackBanner) {
          feedbackBanner.style.display = 'flex';
        }

        // Dynamically increment citizen's civic credit balance
        if (creditsCounter) {
          const currentCredits = parseInt(creditsCounter.textContent, 10) || 340;
          creditsCounter.textContent = currentCredits + 50;
        }
        if (co2Counter) {
          const currentCO2 = parseFloat(co2Counter.textContent) || 42.5;
          co2Counter.textContent = (currentCO2 + 2.4).toFixed(1);
        }

        if (window.lucide) lucide.createIcons();
      } else {
        // Toggle unlock
        isLocked = false;
        lockBtn.classList.remove('is-locked');
        if (lockBtnText) {
          lockBtnText.textContent = '1-TAP LOCK IN RIDE (+50 CREDITS)';
        }
        if (feedbackBanner) {
          feedbackBanner.style.display = 'none';
        }
      }
    });
  }

  // Routine Switcher
  routinePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const day = pill.dataset.day || 'mon';
      applyRoutine(day);
    });
  });

  // ─── B. NATURAL LANGUAGE "RIDE-SCRIBE" BAR (CONVERSATIONAL UI) ───
  const dockInput = document.getElementById('dock-scribe-input');
  const dockRunBtn = document.getElementById('dock-scribe-run');
  const dockMicBtn = document.getElementById('dock-scribe-mic');
  const dockOutput = document.getElementById('dock-scribe-output');
  const dockCloseBtn = document.getElementById('dock-scribe-close');
  const dockEntities = document.getElementById('dock-scribe-entities');
  const dockMatch = document.getElementById('dock-scribe-match');
  const dockChips = document.querySelectorAll('.ai-quick-chip');

  const secInput = document.getElementById('section-scribe-input');
  const secRunBtn = document.getElementById('section-scribe-btn');
  const secMicBtn = document.getElementById('section-scribe-mic');
  const secPills = document.querySelectorAll('.scribe-sample-pill');
  const secTagsGrid = document.getElementById('scribe-tags-grid');

  function parseNaturalLanguage(text) {
    if (!text || !text.trim()) {
      text = "Find me a ride to office tomorrow around 8:30 AM, split the fuel via UPI, and apply my metro pass discount.";
    }

    const lower = text.toLowerCase();

    // 1. Destination
    let destination = "Connaught Place (Office Hub)";
    if (lower.includes('cyber city') || lower.includes('gurugram')) destination = "Cyber City, Gurugram";
    else if (lower.includes('lajpat') || lower.includes('south')) destination = "Lajpat Nagar / South Ex";
    else if (lower.includes('noida')) destination = "Noida Sector 62";
    else if (lower.includes('rohini')) destination = "Rohini Sector 11";

    // 2. Time
    let time = "Tomorrow, 08:30 AM";
    if (lower.includes('9:00') || lower.includes('9 am')) time = "Tomorrow, 09:00 AM";
    else if (lower.includes('evening') || lower.includes('6:45') || lower.includes('night')) time = "Today, 06:45 PM";
    else if (lower.includes('8:00') || lower.includes('8 am')) time = "Tomorrow, 08:00 AM";

    // 3. Payment
    let payment = "UPI Dynamic Split";
    if (lower.includes('cashless')) payment = "Automated FASTag / NCMC";
    else if (lower.includes('fastag')) payment = "FASTag Toll Split";
    else if (lower.includes('upi')) payment = "UPI Split (Instant)";

    // 4. Discounts & Rebates
    let discount = "None specified";
    if (lower.includes('metro pass') || lower.includes('dmrc')) discount = "DMRC Metro Pass (-20% / ₹12 off)";
    else if (lower.includes('fastag rebate') || lower.includes('toll')) discount = "NHAI Toll Rebate (15% off)";
    else if (lower.includes('carbon') || lower.includes('green credits')) discount = "Civic Green Credits 2.5× Boost";

    // 5. Vehicle Preference
    let vehicle = "Verified EV Preferred";
    if (lower.includes('ev') || lower.includes('electric')) vehicle = "Zero-Emission EV Sedan";
    else if (lower.includes('hybrid')) vehicle = "Hybrid Clean Pod";
    else vehicle = "High-Occupancy Commuter Pod";

    // 6. Matched Pod Details
    let driver = "Priya M.";
    let driverCar = "Tata Nexon EV";
    let matchScore = "98%";
    let fare = "₹48";
    if (destination.includes('Cyber City')) {
      driver = "Rajesh K.";
      driverCar = "Tata Nexon EV";
      matchScore = "94%";
      fare = "₹60";
    } else if (destination.includes('Lajpat') || time.includes('06:45')) {
      driver = "Vikram S.";
      driverCar = "MG ZS EV";
      matchScore = "91%";
      fare = "₹44";
    }

    return {
      destination,
      time,
      payment,
      discount,
      vehicle,
      driver,
      driverCar,
      matchScore,
      fare
    };
  }

  function renderDockOutput(parsed) {
    if (!dockOutput) return;

    dockOutput.style.display = 'block';

    if (dockEntities) {
      dockEntities.innerHTML = `
        <div class="entity-pill">
          <span class="entity-k">📍 Destination</span>
          <span class="entity-v">${parsed.destination}</span>
        </div>
        <div class="entity-pill">
          <span class="entity-k">⏰ Time</span>
          <span class="entity-v">${parsed.time}</span>
        </div>
        <div class="entity-pill">
          <span class="entity-k">💳 Payment</span>
          <span class="entity-v">${parsed.payment}</span>
        </div>
        <div class="entity-pill">
          <span class="entity-k">🎟️ Pass Applied</span>
          <span class="entity-v">${parsed.discount}</span>
        </div>
        <div class="entity-pill">
          <span class="entity-k">⚡ Vehicle Filter</span>
          <span class="entity-v">${parsed.vehicle}</span>
        </div>
      `;
    }

    if (dockMatch) {
      dockMatch.innerHTML = `
        <div>
          <span class="preview-match-badge"><i data-lucide="shield-check" class="icon icon--xs"></i> ${parsed.matchScore} Route Match</span>
          <div style="margin-top: 4px; font-weight: 700; color: var(--text-main); font-size: 0.95rem;">
            ${parsed.driver} · ${parsed.driverCar}
          </div>
          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">
            Fare: <strong>${parsed.fare}</strong> · Departs ${parsed.time} · Direct Route
          </div>
        </div>
        <a href="#matcher" class="btn btn--preview-book" style="flex-shrink: 0;">LOCK IN RIDE &rarr;</a>
      `;
    }

    if (window.lucide) lucide.createIcons();
  }

  function renderSectionOutput(parsed) {
    if (secTagsGrid) {
      secTagsGrid.innerHTML = `
        <div class="entity-pill">
          <span class="entity-k">📍 Destination</span>
          <span class="entity-v">${parsed.destination}</span>
        </div>
        <div class="entity-pill">
          <span class="entity-k">⏰ Time</span>
          <span class="entity-v">${parsed.time}</span>
        </div>
        <div class="entity-pill">
          <span class="entity-k">💳 Payment Mode</span>
          <span class="entity-v">${parsed.payment}</span>
        </div>
        <div class="entity-pill">
          <span class="entity-k">🎟️ Pass Discount</span>
          <span class="entity-v">${parsed.discount}</span>
        </div>
        <div class="entity-pill">
          <span class="entity-k">⚡ Vehicle Filter</span>
          <span class="entity-v">${parsed.vehicle}</span>
        </div>
      `;
    }

    const previewHead = document.querySelector('.scribe-result-preview .preview-match-badge');
    const previewCost = document.querySelector('.scribe-result-preview .preview-cost');
    const previewStrong = document.querySelector('.scribe-result-preview .preview-body strong');
    const previewSub = document.querySelector('.scribe-result-preview .preview-body p');

    if (previewHead) previewHead.innerHTML = `<i data-lucide="check" class="icon icon--xs"></i> ${parsed.matchScore} Optimal Match Found`;
    if (previewCost) previewCost.textContent = `${parsed.fare} (with Metro Pass)`;
    if (previewStrong) previewStrong.textContent = `${parsed.driver} · ${parsed.driverCar}`;
    if (previewSub) previewSub.textContent = `Departs ${parsed.time} · 2 Co-riders confirmed · 50 Green Credits`;

    if (window.lucide) lucide.createIcons();
  }

  // Dock events
  if (dockRunBtn) {
    dockRunBtn.addEventListener('click', () => {
      const val = dockInput ? dockInput.value : '';
      const parsed = parseNaturalLanguage(val);
      renderDockOutput(parsed);
      renderSectionOutput(parsed);
      if (secInput) secInput.value = val;
    });
  }

  if (dockInput) {
    dockInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = dockInput.value;
        const parsed = parseNaturalLanguage(val);
        renderDockOutput(parsed);
        renderSectionOutput(parsed);
        if (secInput) secInput.value = val;
      }
    });
  }

  if (dockCloseBtn) {
    dockCloseBtn.addEventListener('click', () => {
      if (dockOutput) dockOutput.style.display = 'none';
    });
  }

  // Dock prompt chips
  dockChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt || '';
      if (dockInput) dockInput.value = prompt;
      if (secInput) secInput.value = prompt;
      const parsed = parseNaturalLanguage(prompt);
      renderDockOutput(parsed);
      renderSectionOutput(parsed);
    });
  });

  // Section NLP events
  if (secRunBtn) {
    secRunBtn.addEventListener('click', () => {
      const val = secInput ? secInput.value : '';
      const parsed = parseNaturalLanguage(val);
      renderSectionOutput(parsed);
      renderDockOutput(parsed);
      if (dockInput) dockInput.value = val;
    });
  }

  if (secInput) {
    secInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = secInput.value;
        const parsed = parseNaturalLanguage(val);
        renderSectionOutput(parsed);
        renderDockOutput(parsed);
        if (dockInput) dockInput.value = val;
      }
    });
  }

  // Section prompt sample pills
  secPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.dataset.query || '';
      if (secInput) secInput.value = query;
      if (dockInput) dockInput.value = query;
      const parsed = parseNaturalLanguage(query);
      renderSectionOutput(parsed);
      renderDockOutput(parsed);
    });
  });

  // Web Speech Recognition & Continuous Dictation Engine
  function activateVoiceDictation(inputElem, micElem, callback) {
    if (!micElem) return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = 'en-IN';
        recognition.interimResults = true;
        recognition.continuous = false;

        micElem.classList.add('is-listening');
        if (inputElem) {
          inputElem.value = '';
          inputElem.placeholder = '🎙️ Listening... Speak your commute destination now';
        }

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (inputElem) inputElem.value = transcript;
        };

        recognition.onend = () => {
          micElem.classList.remove('is-listening');
          if (inputElem && !inputElem.value) {
            inputElem.value = 'Find me a ride to office tomorrow around 8:30 AM, split the fuel via UPI, and apply my metro pass discount.';
          }
          if (inputElem && inputElem.value) {
            const parsed = parseNaturalLanguage(inputElem.value);
            renderDockOutput(parsed);
            renderSectionOutput(parsed);
            handleUserChatPrompt(inputElem.value);
          }
          if (callback) callback();
        };

        recognition.onerror = () => {
          micElem.classList.remove('is-listening');
          const sample = "Find me a ride to office tomorrow around 8:30 AM, split the fuel via UPI, and apply my metro pass discount.";
          if (inputElem) inputElem.value = sample;
          const parsed = parseNaturalLanguage(sample);
          renderDockOutput(parsed);
          renderSectionOutput(parsed);
          handleUserChatPrompt(sample);
          if (callback) callback();
        };

        recognition.start();
        return;
      } catch (err) {
        // Fallback to simulation if speech recognition blocked
      }
    }

    // High-Fidelity Simulation Fallback
    micElem.classList.add('is-listening');
    if (inputElem) {
      inputElem.value = '🎙️ Listening... (Voice Transit Dictation Stream)';
    }

    setTimeout(() => {
      const sample = "Carpool from Rohini to Cyber City Gurugram around 9:00 AM in an EV with FASTag rebate.";
      if (inputElem) inputElem.value = sample;
      micElem.classList.remove('is-listening');
      const parsed = parseNaturalLanguage(sample);
      renderDockOutput(parsed);
      renderSectionOutput(parsed);
      handleUserChatPrompt(sample);
      if (callback) callback();
    }, 1200);
  }

  if (dockMicBtn) {
    dockMicBtn.addEventListener('click', () => activateVoiceDictation(dockInput, dockMicBtn));
  }
  if (secMicBtn) {
    secMicBtn.addEventListener('click', () => activateVoiceDictation(secInput, secMicBtn));
  }

  // ─── B.2 CONVERSATIONAL CONCIERGE CHAT ENGINE ───
  const chatThread = document.getElementById('chat-messages-thread');
  const chatSysTag = document.getElementById('chat-sys-env-tag');

  if (chatSysTag) {
    const sys = CeraAISystem.getSystemInfo();
    chatSysTag.textContent = `${sys.os} Station · 18ms Latency`;
  }

  function generateCivicAIResponse(query) {
    const q = (query || '').toLowerCase();
    const sys = CeraAISystem.getSystemInfo();
    const ctx = CeraAISystem.getCommuteContext();

    if (/hello|hi|hey|namaste|morning|evening|greetings/i.test(q)) {
      return {
        text: `${ctx.greetingPrefix}! I'm CERA-AI calibrated for your <strong>${sys.os}</strong> workstation at ${ctx.timeFormatted}. During this ${ctx.commuteContext}, I can pre-match your seat, bypass severe PM2.5 corridors, or unlock municipal FASTag rebates. Where are you heading today?`,
        actionCard: null
      };
    }

    if (/fastag|toll|rebate|waiver|dnd|rfid/i.test(q)) {
      return {
        text: `Carpooling with 3+ passengers qualifies your vehicle for <strong>100% municipal FASTag toll waiver</strong> across DND Flyway and Barapullah corridors. RFID gates automatically confirm cabin occupancy and log +50 Green Credits directly into your municipal citizen wallet.`,
        actionCard: {
          title: 'Civic FASTag Rebate Active',
          meta: '100% Toll Reimbursement · +50 Green Credits',
          linkText: 'Redeem Municipal Vouchers →',
          linkHref: '#redemption'
        }
      };
    }

    if (/corridor|clean|air|aqi|pm2\.5|pollution|hotspot/i.test(q)) {
      return {
        text: `Live particulate telemetry flags elevated PM2.5 (342 AQI) near Vikas Marg. CERA-AI recommends routing co-riders through the <strong>Barapullah Clean Corridor</strong>, reducing inhalation exposure by 64% and granting 2.5× Green Credits.`,
        actionCard: {
          title: 'Barapullah Clean Corridor',
          meta: '64% Inhalation Reduction · 34 mins saved',
          linkText: 'Inspect Live Heatmap →',
          linkHref: '#heatmap-widget'
        }
      };
    }

    if (/ev|electric|carpool|ride|office|connaught|priya|nexon|book|match/i.test(q)) {
      return {
        text: `I’ve located a high-affinity EV carpool! <strong>Priya M.</strong> is departing Sector Gate 4 in a Tata Nexon EV with 98% route alignment to Connaught Place. Fare is ₹48 (with Metro Pass) and includes 50 Green Credits.`,
        actionCard: {
          title: 'Priya M. · Tata Nexon EV',
          meta: 'Departs 08:35 AM · 98% Match · ₹48 Fare',
          linkText: 'Lock In Ride Now →',
          linkHref: '#matcher'
        }
      };
    }

    if (/metro|dmrc|card|pass|discount|upi/i.test(q)) {
      return {
        text: `Linking your <strong>Delhi Metro (DMRC) Smart Card</strong> gives you an automatic 20% discount on all EV feeder carpools connecting to metro transit stations. Shared fares can be settled instantly via UPI split.`,
        actionCard: {
          title: 'DMRC Transit Integration',
          meta: '20% Feeder Discount · UPI Instant Split',
          linkText: 'View Transit Architecture →',
          linkHref: '#services'
        }
      };
    }

    return {
      text: `Understood! I've analyzed your transit brief for "${query}". CERA's civic dispatch algorithm has prioritized zero-emission EV corridors and high-occupancy vehicles along your travel corridor.`,
      actionCard: {
        title: 'Optimized Transit Match',
        meta: 'High-Occupancy Clean Corridor · 50 Credits',
        linkText: 'View in Carpool Matcher →',
        linkHref: '#matcher'
      }
    };
  }

  function appendUserMessage(text) {
    if (!chatThread) return;
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg chat-msg--user';
    msgEl.innerHTML = `
      <div class="chat-msg__bubble"><p>${text}</p></div>
      <div class="chat-msg__avatar">You</div>
    `;
    chatThread.appendChild(msgEl);
    chatThread.scrollTop = chatThread.scrollHeight;
  }

  // ─── AUDIO SYNTHESIS & CUE ENGINE ───
  function playCeraAudioCue(type = 'success') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'lock') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12);
      }

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // AudioContext policy fallback gracefully
    }
  }

  function speakCeraMessage(htmlText, btn) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = htmlText.replace(/<[^>]*>?/gm, '');
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    utter.pitch = 1.05;

    if (btn) btn.classList.add('is-speaking');

    utter.onend = () => {
      if (btn) btn.classList.remove('is-speaking');
    };
    utter.onerror = () => {
      if (btn) btn.classList.remove('is-speaking');
    };

    window.speechSynthesis.speak(utter);
  }

  function appendAssistantResponse(replyObj) {
    if (!chatThread) return;
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg chat-msg--assistant';
    let cardHTML = '';
    if (replyObj.actionCard) {
      cardHTML = `
        <div class="chat-action-card">
          <div class="chat-card-row">
            <span class="chat-card-title">${replyObj.actionCard.title}</span>
            <span class="chat-card-meta">${replyObj.actionCard.meta}</span>
          </div>
          <a href="${replyObj.actionCard.linkHref}" class="chat-card-btn">${replyObj.actionCard.linkText}</a>
        </div>
      `;
    }
    msgEl.innerHTML = `
      <div class="chat-msg__avatar"><i data-lucide="sparkles" class="icon icon--xs"></i></div>
      <div class="chat-msg__bubble">
        <p>
          ${replyObj.text}
          <button class="chat-audio-btn" title="Listen to CERA-AI Response" aria-label="Audio readout">
            <i data-lucide="volume-2" class="icon icon--xs"></i>
          </button>
        </p>
        ${cardHTML}
      </div>
    `;

    const audioBtn = msgEl.querySelector('.chat-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        speakCeraMessage(replyObj.text, audioBtn);
      });
    }

    chatThread.appendChild(msgEl);
    chatThread.scrollTop = chatThread.scrollHeight;
    playCeraAudioCue('success');
    if (window.lucide) lucide.createIcons();
  }

  function handleUserChatPrompt(prompt) {
    if (!prompt || !prompt.trim()) return;
    appendUserMessage(prompt);
    setTimeout(() => {
      const response = generateCivicAIResponse(prompt);
      appendAssistantResponse(response);
    }, 240);
  }

  // Personalize greeting intro
  const greetingIntro = document.getElementById('chat-greeting-intro');
  if (greetingIntro) {
    const sys = CeraAISystem.getSystemInfo();
    const ctx = CeraAISystem.getCommuteContext();
    greetingIntro.innerHTML = `Namaste! I'm CERA-AI calibrated for your <strong>${sys.os}</strong> system at ${ctx.timeFormatted} (<em>${ctx.commuteContext}</em>). Tell me where you need to commute, ask about clean air corridors, or tap any quick prompt below.`;
  }

  // Wire initial chat chips
  if (chatThread) {
    chatThread.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip');
      if (chip) {
        const ask = chip.dataset.chatAsk || chip.textContent.trim();
        handleUserChatPrompt(ask);
      }
    });
  }

  // ─── C. VISUAL "ECO-IMPACT HEATMAP" (DATA INTELLIGENCE) ───
  const layerCleanBtn = document.getElementById('layer-clean');
  const layerHotspotsBtn = document.getElementById('layer-hotspots');
  const layerAqiBtn = document.getElementById('layer-aqi');

  const cleanGroup = document.getElementById('layer-clean-group');
  const hotspotsGroup = document.getElementById('layer-hotspots-group');
  const aqiGroup = document.getElementById('layer-aqi-group');

  if (layerCleanBtn && cleanGroup) {
    layerCleanBtn.addEventListener('click', () => {
      layerCleanBtn.classList.toggle('layer-toggle-btn--active');
      cleanGroup.style.display = layerCleanBtn.classList.contains('layer-toggle-btn--active') ? 'block' : 'none';
    });
  }

  if (layerHotspotsBtn && hotspotsGroup) {
    layerHotspotsBtn.addEventListener('click', () => {
      layerHotspotsBtn.classList.toggle('layer-toggle-btn--active');
      hotspotsGroup.style.display = layerHotspotsBtn.classList.contains('layer-toggle-btn--active') ? 'block' : 'none';
    });
  }

  if (layerAqiBtn && aqiGroup) {
    layerAqiBtn.addEventListener('click', () => {
      layerAqiBtn.classList.toggle('layer-toggle-btn--active');
      aqiGroup.style.display = layerAqiBtn.classList.contains('layer-toggle-btn--active') ? 'block' : 'none';
    });
  }

  // Route selector in heatmap
  const routeBtns = document.querySelectorAll('.route-sel-btn');
  const markerA = document.getElementById('marker-a');
  const markerB = document.getElementById('marker-b');
  const markerAText = document.getElementById('marker-a-text');
  const markerBText = document.getElementById('marker-b-text');
  const corridorPath = document.getElementById('corridor-path-clean');
  const heatRouteTitle = document.getElementById('heatmap-route-title');
  const heatCo2Val = document.getElementById('heat-co2-val');
  const heatPm25Val = document.getElementById('heat-pm25-val');
  const heatTimeVal = document.getElementById('heat-time-val');
  const heatCreditsVal = document.getElementById('heat-credits-val');
  const heatAdviceText = document.getElementById('heat-advice-text');

  const heatRoutes = {
    'cp-barapullah': {
      title: 'Anand Vihar → Connaught Place',
      markerA: { x: 680, y: 180, label: 'Anand Vihar' },
      markerB: { x: 450, y: 240, label: 'Connaught Place' },
      d: 'M 680,180 C 580,260 520,310 450,240',
      co2: '4.2 kg CO₂',
      pm25: '-64% Inhalation',
      time: '34 mins saved',
      credits: '+50 Credits',
      advice: 'Routing co-riders through the Barapullah Elevated corridor circumvents the severe 342 AQI plume at Vikas Marg, granting co-riders 2.5× Green Credits and 100% FASTag toll reimbursement.'
    },
    'rohini-cybercity': {
      title: 'Rohini Sec 11 → Cyber City Gurugram',
      markerA: { x: 210, y: 110, label: 'Rohini Sec 11' },
      markerB: { x: 180, y: 410, label: 'Cyber City DLF' },
      d: 'M 210,110 C 260,200 240,320 180,410',
      co2: '5.8 kg CO₂',
      pm25: '-78% Inhalation',
      time: '48 mins saved',
      credits: '+75 Credits',
      advice: 'High-occupancy EV pods on NH-48 enjoy priority toll clearance and zero odd-even corridor restrictions, slashing commuter fuel expenditures by ₹120 per round trip.'
    },
    'noida-southex': {
      title: 'Noida Sec 62 → South Extension',
      markerA: { x: 720, y: 380, label: 'Noida Sec 62' },
      markerB: { x: 480, y: 290, label: 'South Extension' },
      d: 'M 720,380 C 620,340 540,310 480,290',
      co2: '3.6 kg CO₂',
      pm25: '-52% Inhalation',
      time: '26 mins saved',
      credits: '+40 Credits',
      advice: 'DND Flyway fast-track lane automatically verifies 3+ passenger cabin occupancy via RFID, instantly waiving municipal toll charges and recording verified green credits.'
    }
  };

  routeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      routeBtns.forEach(b => b.classList.remove('route-sel-btn--active'));
      btn.classList.add('route-sel-btn--active');

      const routeKey = btn.dataset.route || 'cp-barapullah';
      const r = heatRoutes[routeKey];
      if (!r) return;

      if (heatRouteTitle) heatRouteTitle.textContent = r.title;
      if (heatCo2Val) heatCo2Val.textContent = r.co2;
      if (heatPm25Val) heatPm25Val.textContent = r.pm25;
      if (heatTimeVal) heatTimeVal.textContent = r.time;
      if (heatCreditsVal) heatCreditsVal.textContent = r.credits;
      if (heatAdviceText) heatAdviceText.textContent = r.advice;

      if (markerA) {
        markerA.setAttribute('transform', `translate(${r.markerA.x}, ${r.markerA.y})`);
        if (markerAText) markerAText.textContent = r.markerA.label;
      }

      if (markerB) {
        markerB.setAttribute('transform', `translate(${r.markerB.x}, ${r.markerB.y})`);
        if (markerBText) markerBText.textContent = r.markerB.label;
      }

      if (corridorPath) {
        corridorPath.setAttribute('d', r.d);
      }
      const particleLine = document.querySelector('.corridor-particle-line');
      if (particleLine) {
        particleLine.setAttribute('d', r.d);
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   CERA-AI GLOBAL KEYBOARD SHORTCUT DISPATCHER (Cmd+K / Ctrl+K)
   ═══════════════════════════════════════════════════════════════ */
function initCeraAIShortcuts() {
  const sysInfo = CeraAISystem.getSystemInfo();
  const isMac = sysInfo.os.includes('macOS') || sysInfo.os.includes('iOS');

  window.addEventListener('keydown', (e) => {
    // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    const modifierActive = isMac ? e.metaKey : (e.ctrlKey || e.metaKey);
    if (modifierActive && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      
      const omnibarModal = document.getElementById('cera-omnibar-modal');
      if (omnibarModal) {
        if (typeof window.toggleCeraOmnibar === 'function') {
          window.toggleCeraOmnibar();
        } else {
          const isOpen = omnibarModal.classList.contains('is-active');
          if (isOpen) {
            omnibarModal.classList.remove('is-active');
          } else {
            omnibarModal.classList.add('is-active');
            const searchInp = document.getElementById('omnibar-input');
            if (searchInp) {
              searchInp.focus();
              searchInp.select();
            }
          }
        }
      } else {
        // Smooth scroll fallback to Ride-Scribe and focus input
        const scribeInput = document.getElementById('dock-scribe-input');
        const dock = document.getElementById('cera-ai-dock');
        if (dock) {
          dock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (scribeInput) {
          scribeInput.focus();
          scribeInput.select();
        }
      }
    } else if (e.key === 'Escape') {
      const omnibarModal = document.getElementById('cera-omnibar-modal');
      if (omnibarModal && omnibarModal.classList.contains('is-active')) {
        omnibarModal.classList.remove('is-active');
      }
      const dockOutput = document.getElementById('dock-scribe-output');
      if (dockOutput && dockOutput.style.display !== 'none') {
        dockOutput.style.display = 'none';
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   CERA-AI GLOBAL COMMAND PALETTE OMNIBAR CONTROLLER
   ═══════════════════════════════════════════════════════════════ */
function initCeraOmnibar() {
  const modal = document.getElementById('cera-omnibar-modal');
  const backdrop = document.getElementById('omnibar-backdrop');
  const closeBtn = document.getElementById('omnibar-close-btn');
  const input = document.getElementById('omnibar-input');
  const body = document.getElementById('omnibar-body');
  const kbdBadge = document.getElementById('omnibar-modal-kbd');
  const sysEnvText = document.getElementById('omnibar-sys-env-text');
  const timeCtxText = document.getElementById('omnibar-time-ctx-text');

  if (!modal || !input || !body) return;

  const actions = [
    {
      id: 'twin-lock',
      category: 'Proactive Commute',
      icon: 'sparkles',
      title: 'Lock In Smart-Twin Commute Ride',
      desc: 'Confirm pre-matched routine ride & credit +50 Green Points',
      badge: '+50 Credits',
      handler: () => {
        const btn = document.getElementById('smart-twin-lock-btn');
        if (btn) btn.click();
        const section = document.getElementById('cera-ai');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    {
      id: 'scribe-focus',
      category: 'Conversational Concierge',
      icon: 'message-square',
      title: 'Natural Language Ride-Scribe',
      desc: 'Type natural commute details (e.g. office tomorrow 8:30 AM)',
      badge: 'Natural NLP',
      handler: () => {
        const dock = document.getElementById('cera-ai-dock');
        const inp = document.getElementById('dock-scribe-input');
        if (dock) dock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (inp) { inp.focus(); inp.select(); }
      }
    },
    {
      id: 'voice-mic',
      category: 'Conversational Concierge',
      icon: 'mic',
      title: 'Dictate Route via Voice Input',
      desc: 'Simulate speech-to-text commute prompt with audio wave',
      badge: 'Voice AI',
      handler: () => {
        const mic = document.getElementById('dock-scribe-mic');
        if (mic) mic.click();
      }
    },
    {
      id: 'heatmap-view',
      category: 'Eco Intelligence',
      icon: 'map-pin',
      title: 'Inspect Eco-Impact Clean Corridors',
      desc: 'View Barapullah, NH-48 & DND low-pollution arterial corridors',
      badge: 'AQI Map',
      handler: () => {
        const hm = document.getElementById('heatmap-widget');
        if (hm) hm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    {
      id: 'air-telemetry',
      category: 'Eco Intelligence',
      icon: 'wind',
      title: 'Live Air Quality & PM2.5 Telemetry',
      desc: 'Real-time Delhi NCR monitoring stations & particulate exposure',
      badge: 'Live Data',
      handler: () => {
        const telem = document.getElementById('telemetry');
        if (telem) telem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    {
      id: 'matcher-view',
      category: 'Civic Carpool',
      icon: 'users',
      title: 'Open Verified Carpool Matcher',
      desc: 'Explore high-occupancy verified rides, EV cars & co-riders',
      badge: 'Verified',
      handler: () => {
        const m = document.getElementById('matcher');
        if (m) m.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    {
      id: 'vouchers-view',
      category: 'Civic Rewards',
      icon: 'ticket',
      title: 'Redeem Civic & FASTag Vouchers',
      desc: 'Apply your accumulated green credits to metro & toll rebates',
      badge: 'Rebates',
      handler: () => {
        const red = document.getElementById('redemption');
        if (red) red.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    {
      id: 'theme-toggle-action',
      category: 'System Environment',
      icon: 'sun-moon',
      title: 'Toggle Dark / Light Visual Theme',
      desc: 'Switch between High-Contrast Dark (#0D1C42) and Editorial Light',
      badge: 'Theme',
      handler: () => {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) toggle.click();
      }
    },
    {
      id: 'sys-info-alert',
      category: 'System Environment',
      icon: 'cpu',
      title: 'System Environment & Telemetry Diagnostics',
      desc: 'Review detected OS, browser engine, display DPR, and CPU cores',
      badge: 'Diagnostic',
      handler: () => {
        const sys = CeraAISystem.getSystemInfo();
        const hw = CeraAISystem.getHardwareTelemetry();
        alert(`CERA-AI System Telemetry Diagnostic:\n\n• OS: ${sys.os}\n• Browser: ${sys.browser}\n• Display: ${sys.displayInfo}\n• CPU Hardware: ${hw.cores}\n• Memory: ${hw.ram}\n• Network: ${hw.netType}`);
      }
    }
  ];

  let selectedIndex = 0;
  let filteredActions = [...actions];

  function openOmnibar() {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');

    const sys = CeraAISystem.getSystemInfo();
    const hw = CeraAISystem.getHardwareTelemetry();
    const ctx = CeraAISystem.getCommuteContext();

    if (kbdBadge) kbdBadge.textContent = sys.shortcutKey;
    if (sysEnvText) sysEnvText.textContent = `${sys.os} · ${sys.browser} · ${hw.cores}`;
    if (timeCtxText) timeCtxText.textContent = `${ctx.timeFormatted} · ${ctx.commuteContext}`;

    input.value = '';
    renderItems(actions);
    setTimeout(() => input.focus(), 60);
  }

  function closeOmnibar() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    input.blur();
  }

  function toggleOmnibar() {
    if (modal.classList.contains('is-active')) {
      closeOmnibar();
    } else {
      openOmnibar();
    }
  }

  window.toggleCeraOmnibar = toggleOmnibar;
  window.closeCeraOmnibar = closeOmnibar;

  if (backdrop) backdrop.addEventListener('click', closeOmnibar);
  if (closeBtn) closeBtn.addEventListener('click', closeOmnibar);

  function renderItems(items) {
    filteredActions = items;
    selectedIndex = 0;
    body.innerHTML = '';

    if (items.length === 0) {
      body.innerHTML = `
        <div class="omnibar-empty-state">
          <p>No matching commands or corridors found.</p>
          <span style="font-size: 0.78rem; opacity: 0.75;">Try typing "EV", "metro", "theme", "AQI", or "commute"</span>
        </div>
      `;
      return;
    }

    let currentCat = '';
    items.forEach((item, idx) => {
      if (item.category !== currentCat) {
        currentCat = item.category;
        const groupEl = document.createElement('div');
        groupEl.className = 'omnibar-group-title';
        groupEl.textContent = currentCat;
        body.appendChild(groupEl);
      }

      const itemEl = document.createElement('div');
      itemEl.className = `omnibar-item ${idx === selectedIndex ? 'is-selected' : ''}`;
      itemEl.dataset.index = idx;
      itemEl.innerHTML = `
        <div class="omnibar-item-left">
          <i data-lucide="${item.icon}" class="icon omnibar-item-icon"></i>
          <div class="omnibar-item-info">
            <span class="omnibar-item-title">${item.title}</span>
            <span class="omnibar-item-desc">${item.desc}</span>
          </div>
        </div>
        <span class="omnibar-item-badge">${item.badge}</span>
      `;

      itemEl.addEventListener('click', () => {
        executeItem(item);
      });

      itemEl.addEventListener('mouseenter', () => {
        selectedIndex = idx;
        updateSelection();
      });

      body.appendChild(itemEl);
    });

    if (window.lucide) lucide.createIcons();
  }

  function updateSelection() {
    const itemEls = body.querySelectorAll('.omnibar-item');
    itemEls.forEach((el, idx) => {
      el.classList.toggle('is-selected', idx === selectedIndex);
      if (idx === selectedIndex) {
        el.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function executeItem(item) {
    closeOmnibar();
    if (item && typeof item.handler === 'function') {
      setTimeout(() => item.handler(), 120);
    }
  }

  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderItems(actions);
      return;
    }

    const matches = actions.filter(act => {
      return act.title.toLowerCase().includes(q) ||
             act.desc.toLowerCase().includes(q) ||
             act.category.toLowerCase().includes(q) ||
             act.badge.toLowerCase().includes(q);
    });

    renderItems(matches);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredActions.length > 0) {
        selectedIndex = (selectedIndex + 1) % filteredActions.length;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredActions.length > 0) {
        selectedIndex = (selectedIndex - 1 + filteredActions.length) % filteredActions.length;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        executeItem(filteredActions[selectedIndex]);
      }
    }
  });
}

