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
