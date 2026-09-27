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

  cityRows.forEach(row => {
    row.addEventListener('click', () => {
      cityRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const key = row.getAttribute('data-city-key');
      const data = CITIES_DATA[key];
      if (!data) return;

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
        if (window.lucide) lucide.createIcons();
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   11. CERA-AI SUITE (SMART-TWIN, RIDE-SCRIBE, ECO-IMPACT HEATMAP)
   ═══════════════════════════════════════════════════════════════ */
function initCeraAI() {
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
  let currentDay = 'mon';

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
      routinePills.forEach(p => p.classList.remove('routine-pill--active'));
      pill.classList.add('routine-pill--active');
      const day = pill.dataset.day || 'mon';
      currentDay = day;
      const data = routines[day];
      if (!data) return;

      if (twinText) twinText.innerHTML = `"${data.quote}"`;

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

  // Mic dictation simulation
  function simulateVoice(inputElem, micElem, callback) {
    if (!micElem) return;
    micElem.classList.add('is-listening');
    if (inputElem) {
      inputElem.value = 'Listening... (Speak your commute destination)';
    }

    setTimeout(() => {
      const sample = "Find me a ride to office tomorrow around 8:30 AM, split the fuel via UPI, and apply my metro pass discount.";
      if (inputElem) inputElem.value = sample;
      micElem.classList.remove('is-listening');
      const parsed = parseNaturalLanguage(sample);
      renderDockOutput(parsed);
      renderSectionOutput(parsed);
      if (callback) callback();
    }, 1200);
  }

  if (dockMicBtn) {
    dockMicBtn.addEventListener('click', () => simulateVoice(dockInput, dockMicBtn));
  }
  if (secMicBtn) {
    secMicBtn.addEventListener('click', () => simulateVoice(secInput, secMicBtn));
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

