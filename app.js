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
  initMatcherFilters();
  initPodButtons();
  initVoucherButtons();
  initBriefForm();
  initHeroAQICard();
  initUserProfileNav();
  initPersonaModal();
  initCarbonCalculator();
  initCeraAI();
  initCeraAIShortcuts();
  initCeraOmnibar();
  initCeraDiagnostics();
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
  function rollUserStats(user) {
    if (!user) return;
    const co2Val = user.co2SavedKg || 48.6;
    const estSavings = Math.round((user.tripsCompleted || 34) * 142);

    const heroCo2 = document.getElementById('hero-stat-co2');
    const heroSavings = document.getElementById('hero-stat-savings');
    const ceraAiCo2 = document.getElementById('co2-counter');
    const ceraAiCredits = document.getElementById('credits-counter');

    if (heroCo2) animateNumber({ el: heroCo2, target: co2Val, suffix: ' kg', decimals: 1 });
    if (heroSavings) animateNumber({ el: heroSavings, target: estSavings, prefix: '₹', decimals: 0 });
    if (ceraAiCo2) animateNumber({ el: ceraAiCo2, target: co2Val, suffix: '', decimals: 1 });
    if (ceraAiCredits) animateNumber({ el: ceraAiCredits, target: user.credits || 420, suffix: '', decimals: 0 });
  }

  let animatedOnce = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedOnce) {
        animatedOnce = true;
        const u = typeof CeraUserManager !== 'undefined' ? CeraUserManager.getCurrentUser() : null;
        if (u) rollUserStats(u);
      }
    });
  }, { threshold: 0.2 });

  const ribbon = document.querySelector('.hero-clean__stats-ribbon');
  if (ribbon) observer.observe(ribbon);

  // Subscribe to persona switches
  if (typeof CeraUserManager !== 'undefined') {
    CeraUserManager.onUserChange(user => {
      rollUserStats(user);
    });
  }
}

function animateNumber({ el, target, prefix = '', suffix = '', decimals = 0 }) {
  if (!el) return;
  const duration = 1200;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = ease * target;

    const formatted = decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString('en-IN');

    el.textContent = `${prefix}${formatted}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════════
   6.8. CARPOOL MATCHER CORRIDOR FILTER TABS & LIVE SEARCH
   ═══════════════════════════════════════════════════════════════ */
function initMatcherFilters() {
  const tabs = document.querySelectorAll('.matcher-tab');
  const searchInput = document.getElementById('matcher-search-input');
  const cards = document.querySelectorAll('.pod-card');
  let activeCorridor = 'all';

  function applyFilters() {
    const query = (searchInput?.value || '').trim().toLowerCase();

    cards.forEach(card => {
      const cardCorridor = card.dataset.corridor || '';
      const driver = (card.dataset.driver || '').toLowerCase();
      const dest = (card.dataset.dest || '').toLowerCase();
      const hub = (card.dataset.hub || '').toLowerCase();
      const allText = card.textContent.toLowerCase();

      const matchesCorridor = (activeCorridor === 'all') || (cardCorridor === activeCorridor);
      const matchesSearch = !query || driver.includes(query) || dest.includes(query) || hub.includes(query) || allText.includes(query);

      if (matchesCorridor && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      activeCorridor = tab.dataset.corridor || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Update tabs when commuter persona switches
  if (typeof CeraUserManager !== 'undefined') {
    CeraUserManager.onUserChange(user => {
      if (user && user.corridor) {
        const corrLower = user.corridor.toLowerCase();
        let targetKey = 'all';
        if (corrLower.includes('barapullah')) targetKey = 'barapullah';
        else if (corrLower.includes('cyber') || corrLower.includes('nh-48')) targetKey = 'cybercity';
        else if (corrLower.includes('dnd') || corrLower.includes('noida')) targetKey = 'dnd';

        const matchingTab = Array.from(tabs).find(t => t.dataset.corridor === targetKey);
        if (matchingTab) {
          tabs.forEach(t => {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          matchingTab.classList.add('is-active');
          matchingTab.setAttribute('aria-selected', 'true');
          activeCorridor = targetKey;
          applyFilters();
        }
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   7. AI POD CARDS — "CONNECT & RIDE" BUTTONS
   ═══════════════════════════════════════════════════════════════ */
function initPodButtons() {
  const modal = document.getElementById('cera-booking-modal');
  const closeBtn = document.getElementById('booking-modal-close-btn');
  const cancelBtn = document.getElementById('booking-modal-cancel-btn');
  const confirmBtn = document.getElementById('booking-modal-confirm-btn');

  const avatarEl = document.getElementById('booking-driver-avatar');
  const nameEl = document.getElementById('booking-driver-name');
  const corridorEl = document.getElementById('booking-corridor-name');
  const fareEl = document.getElementById('booking-fare-val');
  const pickupEl = document.getElementById('booking-pickup-val');
  const destEl = document.getElementById('booking-dest-val');
  const co2El = document.getElementById('booking-co2-val');
  const commuterNameEl = document.getElementById('booking-commuter-name');
  const commuterTierEl = document.getElementById('booking-commuter-tier');

  let activeBtn = null;
  let activeDriver = '';

  function closeModal() {
    if (modal) {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  document.querySelectorAll('.btn--tactile-ride').forEach(btn => {
    btn.addEventListener('click', () => {
      activeBtn = btn;
      const card = btn.closest('.pod-card');
      const driver = btn.dataset.driver || (card ? card.querySelector('.driver-name')?.textContent : 'Verified Pilot');
      const corridor = btn.dataset.corridor || (card ? card.querySelector('.pod-card__sub-type')?.textContent : 'Delhi NCR Corridor');
      const fare = btn.dataset.fare || '₹45';
      const co2 = btn.dataset.co2 || '-2.0 kg';
      const dest = btn.dataset.dest || (card ? card.querySelectorAll('.stop-name')?.[1]?.textContent : 'Destination Hub');
      const hub = btn.dataset.hub || (card ? card.querySelectorAll('.stop-name')?.[0]?.textContent : 'Origin Station');
      const avatarSrc = card?.querySelector('.driver-avatar-photo')?.src || 'images/driver_rajesh.jpg';

      activeDriver = driver;

      if (avatarEl) avatarEl.src = avatarSrc;
      if (nameEl) nameEl.textContent = driver;
      if (corridorEl) corridorEl.textContent = corridor;
      if (fareEl) fareEl.textContent = fare;
      if (co2El) co2El.textContent = co2 + ' CO₂';
      if (pickupEl) pickupEl.textContent = hub;
      if (destEl) destEl.textContent = dest;

      const user = typeof CeraUserManager !== 'undefined' ? CeraUserManager.getCurrentUser() : null;
      if (user) {
        if (commuterNameEl) commuterNameEl.textContent = user.name;
        if (commuterTierEl) commuterTierEl.textContent = user.badge;
      }

      if (modal) {
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
      }
      if (window.lucide) lucide.createIcons();
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      closeModal();
      if (activeBtn) {
        activeBtn.innerHTML = '<span>✓ SEAT RESERVED</span>';
        activeBtn.disabled = true;
        activeBtn.style.opacity = '0.7';
        activeBtn.style.cursor = 'default';
      }
      if (typeof CeraUserManager !== 'undefined') {
        CeraUserManager.addCredits(50);
      }
      displayToast(`Carpool pod reserved with ${activeDriver}! +50 Green Credits added to your civic balance.`);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   8. CIVIC BENEFIT REDEMPTION BUTTONS & DYNAMIC BALANCE ENGINE
   ═══════════════════════════════════════════════════════════════ */
function initVoucherButtons() {
  const balanceVal = document.getElementById('voucher-user-balance');
  const userAvatar = document.getElementById('voucher-user-avatar');
  const userLabel = document.getElementById('voucher-user-label');
  const tierTag = document.getElementById('voucher-tier-tag');
  const buttons = document.querySelectorAll('.btn--voucher-redeem');

  function syncVoucherUser(user) {
    if (!user) return;
    if (balanceVal) balanceVal.textContent = user.credits;
    if (userAvatar) {
      userAvatar.src = user.avatar;
      userAvatar.alt = user.name;
    }
    if (userLabel) userLabel.textContent = `${user.name}'s Verified Civic Balance`;
    if (tierTag) {
      tierTag.innerHTML = `<i data-lucide="badge-check" class="icon icon--xs"></i> DPI Certified · ${user.badge}`;
    }

    // Refresh button affordability states
    buttons.forEach(btn => {
      const cost = Number(btn.dataset.cost) || 100;
      if (btn.classList.contains('is-redeemed')) return;

      if (user.credits < cost) {
        btn.textContent = `NEED ${cost} GC (HAVE ${user.credits})`;
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
      } else {
        btn.textContent = 'REDEEM VOUCHER';
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      }
    });

    if (window.lucide) lucide.createIcons();
  }

  // Initial user sync
  if (typeof CeraUserManager !== 'undefined') {
    syncVoucherUser(CeraUserManager.getCurrentUser());
    CeraUserManager.onUserChange(user => {
      syncVoucherUser(user);
    });
  }

  // Button clicks
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.voucher-pass');
      const title = card ? card.querySelector('.voucher-pass__title').textContent.trim() : 'Civic Voucher';
      const cost = Number(btn.dataset.cost) || 100;
      const user = typeof CeraUserManager !== 'undefined' ? CeraUserManager.getCurrentUser() : null;

      if (user && user.credits < cost) {
        if (typeof CeraToast !== 'undefined') {
          CeraToast.show(`Insufficient Green Credits. You have ${user.credits} GC, but this voucher requires ${cost} GC. Complete 1 carpool to earn 50 GC!`, {
            title: 'Credit Balance Alert',
            type: 'warning'
          });
        }
        return;
      }

      let success = true;
      if (typeof CeraUserManager !== 'undefined') {
        success = CeraUserManager.deductCredits(cost);
      }

      if (success) {
        btn.classList.add('is-redeemed');
        btn.innerHTML = `<i data-lucide="check" class="icon icon--xxs"></i> REDEEMED (-${cost} GC)`;
        btn.disabled = true;
        btn.style.opacity = '0.8';
        btn.style.cursor = 'default';

        if (typeof CeraToast !== 'undefined') {
          CeraToast.show(`"${title}" voucher cleared via DPI fast-path for ${user ? user.name : 'you'}. 15-minute barcode added to DigiLocker. Balance: ${user ? user.credits : 'updated'} GC.`, {
            title: 'Voucher Issued to DigiLocker',
            type: 'success'
          });
        } else if (typeof displayToast === 'function') {
          displayToast(`"${title}" voucher cleared via DPI fast-path. Barcode added to your DigiLocker app.`);
        }

        if (window.lucide) lucide.createIcons();
      }
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
   10. ACCESSIBLE FLOATING TOAST NOTIFICATION ENGINE
   ═══════════════════════════════════════════════════════════════ */
const CeraToast = {
  getContainer() {
    let box = document.getElementById('cera-toast-wrap');
    if (!box) {
      box = document.createElement('div');
      box.id = 'cera-toast-wrap';
      box.className = 'cera-toast-wrap';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    return box;
  },

  show(msg, options = {}) {
    const box = this.getContainer();
    const duration = options.duration || 4500;
    const title = options.title || 'CERA Notification';
    const type = options.type || 'success';

    let iconName = 'check-circle-2';
    if (type === 'credit') iconName = 'leaf';
    else if (type === 'info') iconName = 'sparkles';
    else if (type === 'warning') iconName = 'alert-triangle';

    const toast = document.createElement('div');
    toast.className = `cera-toast cera-toast--${type}`;
    toast.innerHTML = `
      <div class="cera-toast__icon">
        <i data-lucide="${iconName}" class="icon icon--xs"></i>
      </div>
      <div class="cera-toast__body">
        <span class="cera-toast__title">${title}</span>
        <span class="cera-toast__msg">${msg}</span>
      </div>
      <button type="button" class="cera-toast__close" aria-label="Dismiss notification">&times;</button>
      <div class="cera-toast__bar" style="animation-duration: ${duration}ms;"></div>
    `;

    box.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    let dismissTimer = setTimeout(() => dismiss(), duration);

    function dismiss() {
      clearTimeout(dismissTimer);
      toast.classList.remove('is-visible');
      toast.classList.add('is-leaving');
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 300);
    }

    const closeBtn = toast.querySelector('.cera-toast__close');
    if (closeBtn) closeBtn.addEventListener('click', dismiss);

    return toast;
  }
};

function displayToast(msg) {
  const isCredit = msg.includes('Credit') || msg.includes('GC') || msg.includes('earned');
  const isAlert = msg.includes('caution') || msg.includes('severe') || msg.includes('Warning');
  CeraToast.show(msg, {
    title: isCredit ? 'Green Credits Earned' : (isAlert ? 'Corridor Advisory' : 'Civic Update'),
    type: isCredit ? 'credit' : (isAlert ? 'warning' : 'success')
  });
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
      tip: '<strong>Civic Advisory:</strong> High-occupancy carpools exempt from odd-even corridor penalties. 2.5× Green Credits active.',
      healthBadge: 'Severe Health Advisory · N95 Mask Essential',
      maskDesc: 'Strictly required for all outdoor movement',
      cabinDesc: 'HEPA scrub active in all verified EV pods',
      multiplierDesc: '2.5× Green Credits active during GRAP IV',
      personaNotes: {
        adesh: 'Your Barapullah EV carpool reduces direct inhalable PM2.5 exposure by 74% compared to two-wheeler transit.',
        ananya: 'NH-48 express corridor experiences morning smog peaks. Sealed EV cabins with HEPA filters protect lungs.',
        rohan: 'Epidemiological Note: Ambient PM2.5 at 184 µg/m³ exceeds WHO limits by 12×. EV carpools strongly indicated.',
        vikram: 'DND HOV corridor has 32% lower ground-level particulates due to elevated breeze. Keep windows sealed.',
        sneha: 'Central Vista corridor sealed EV transit cuts tailpipe soot exposure by 82% vs walking.',
        default: 'High fine particulate load. Seal cabin air intake and travel exclusively in verified EV carpool pods.'
      }
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
      tip: '<strong>Winter Smog Advisory:</strong> Shared electric carpools earn double municipal tax rebates on daily commutes.',
      healthBadge: 'Severe Smog Advisory · Limit Outdoor Exertion',
      maskDesc: 'N95 advised during Gomti Nagar morning peak',
      cabinDesc: 'EV cabin filtration keeps indoor AQI < 45',
      multiplierDesc: '2.0× Municipal Green Credits active',
      personaNotes: {
        adesh: 'Shaheed Path transit cluster active. Carpool in sealed EV pods to minimize fine soot inhalation.',
        ananya: 'Express transit corridor offers continuous velocity, cutting engine idling exposure by 60%.',
        rohan: 'Severe atmospheric stagnation over Gomti basin. Advise carpoolers to avoid open auto-rickshaws.',
        vikram: 'Inter-hub commuter pods recommended. Shared electric transit mitigates 2.8 kg CO2 per commute.',
        sneha: 'Urban center travel protected via sealed EV cabins with active air recirculation.',
        default: 'Shaheed Path transit cluster active. Carpool in sealed EV pods to minimize fine soot inhalation.'
      }
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
      tip: '<strong>Clean Air Corridor:</strong> Priority transit corridor active. High-occupancy vehicles receive arterial clearance.',
      healthBadge: 'Severe Inversion Advisory · High Particulate',
      maskDesc: 'Recommended during morning and evening rush',
      cabinDesc: 'Shared electric transit recommended',
      multiplierDesc: '2.0× Clean Air Credits active',
      personaNotes: {
        adesh: 'Ganga Pathway corridor offers faster transit with reduced stationary idling emissions.',
        ananya: 'Rapid arterial link bypasses high congestion zones, lowering respiratory stress.',
        rohan: 'Riverine basin particulate buildup. Shared EV pods provide the safest transit modality.',
        vikram: 'High-occupancy arterial lanes operational. Fastag toll concessions active.',
        sneha: 'Air quality advisory: travel before 08:30 AM in closed electric vehicles for clean breathing.',
        default: 'Ganga Pathway corridor offers faster transit with reduced stationary idling emissions.'
      }
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
      tip: '<strong>Coastal Maritime Airflow:</strong> Coastal Road & Sea Link carpool toll waivers active for registered 3+ rides.',
      healthBadge: 'Moderate Air Quality · Standard Maritime Flow',
      maskDesc: 'Optional for healthy commuters; advised for sensitive groups',
      cabinDesc: 'Fresh air mode acceptable; AC recommended during bottleneck rush',
      multiplierDesc: '1.5× Transit Credits active',
      personaNotes: {
        adesh: 'Coastal corridor benefits from maritime breeze dispersion. Carpool to relieve Western Express bottleneck.',
        ananya: 'Sea Link carpool lanes operational with zero congestion hold-ups.',
        rohan: 'Particulate density moderate. Standard cabin filtration sufficient for routine daily transit.',
        vikram: 'Coastal bypass HOV lanes verified. Toll exemptions logged via automated FASTag.',
        sneha: 'Clean transit corridor active with stable offshore winds.',
        default: 'Coastal corridor benefits from sea breeze dispersion. Carpool to relieve Western Express bottleneck.'
      }
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
      tip: '<strong>Clean Air Benchmark:</strong> Tech park shared transit maintains optimal city air standards.',
      healthBadge: 'Good Air Quality · Clean Corridor Benchmark',
      maskDesc: 'Not required; outdoor activity safe and healthy',
      cabinDesc: 'Zero tailpipe shared transit keeps Whitefield clean and fluent',
      multiplierDesc: '1.0× Baseline Green Credits',
      personaNotes: {
        adesh: 'Outer Ring Road clean air index optimal. Carpooling keeps suburban Bengaluru traffic fluent.',
        ananya: 'Tech park commuter pods running on schedule with 100% green fleet compliance.',
        rohan: 'Cleanest urban air among national metros. Ambient PM2.5 within WHO guideline benchmarks.',
        vikram: 'ORR high-occupancy vehicle lanes operating smoothly. Green transit rewards credited.',
        sneha: 'Ideal atmospheric conditions for early morning intermodal commuting.',
        default: 'Outer Ring Road clean air index optimal. Carpooling keeps suburban Bengaluru traffic fluent.'
      }
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
    // 5. Update Commuter Health Advisory Banner
    const healthBadgeText = document.getElementById('aqi-health-level-text');
    const maskDesc = document.getElementById('guide-mask-desc');
    const cabinDesc = document.getElementById('guide-cabin-desc');
    const multDesc = document.getElementById('guide-multiplier-desc');
    const advAvatar = document.getElementById('aqi-advisory-avatar');
    const advUserName = document.getElementById('aqi-advisory-user-name');
    const advNote = document.getElementById('aqi-advisory-note');

    if (healthBadgeText && data.healthBadge) healthBadgeText.textContent = data.healthBadge;
    if (maskDesc && data.maskDesc) maskDesc.textContent = data.maskDesc;
    if (cabinDesc && data.cabinDesc) cabinDesc.textContent = data.cabinDesc;
    if (multDesc && data.multiplierDesc) multDesc.textContent = data.multiplierDesc;

    const user = typeof CeraUserManager !== 'undefined' ? CeraUserManager.getCurrentUser() : null;
    if (user) {
      if (advAvatar) {
        advAvatar.src = user.avatar;
        advAvatar.alt = user.name;
      }
      if (advUserName) {
        advUserName.textContent = `Advisory for ${user.name}:`;
      }
      if (advNote) {
        advNote.textContent = (data.personaNotes && data.personaNotes[user.id]) ||
          (data.personaNotes && data.personaNotes.default) ||
          data.tip.replace(/<[^>]+>/g, '');
      }
    }

    if (window.lucide) lucide.createIcons();
  }

  // Subscribe to user persona switches for real-time advisory personalization
  if (typeof CeraUserManager !== 'undefined') {
    CeraUserManager.onUserChange(() => {
      const activeKey = document.querySelector('.city-bar-row.active')?.getAttribute('data-city-key') || 'delhi';
      updateAirTelemetry(activeKey);
    });
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

/* ═══════════════════════════════════════════════════════════════
   5.5. CERA COMMUTER PERSONA & USER MANAGEMENT ENGINE
   Dynamic user profiles, credits ledger, routine habits & persistence
   ═══════════════════════════════════════════════════════════════ */
const CeraUserManager = {
  STORAGE_KEY: 'cera_active_user_v2',
  CUSTOM_DATA_KEY: 'cera_users_data_v2',

  PERSONAS: {
    adesh: {
      id: 'adesh',
      name: 'Adesh Sharma',
      shortName: 'Adesh',
      role: 'Civic Commuter',
      badge: 'Tier 2 Green Commuter',
      avatar: 'images/driver_rajesh.jpg',
      avatarColor: '#22396F',
      initials: 'AS',
      credits: 420,
      co2SavedKg: 48.6,
      tripsCompleted: 34,
      corridor: 'Barapullah & Ring Road Corridor',
      primaryHub: 'Navin Shahdara',
      destination: 'Connaught Place',
      vehiclePref: 'Tata Nexon EV / Electric Sedan',
      habitualDays: 'Mondays & Thursdays (08:30 AM)',
      streak: 12,
      prompts: [
        { icon: 'building-2', label: 'Office tomorrow 8:30 AM · UPI Split · Metro Pass', prompt: 'Find me a ride to office tomorrow around 8:30 AM, split the fuel via UPI, and apply my metro pass discount.' },
        { icon: 'zap', label: 'Rohini → Cyber City · EV Sedan · FASTag', prompt: 'Carpool from Rohini to Cyber City Gurugram around 9:00 AM in an EV with FASTag rebate.' },
        { icon: 'leaf', label: 'Lajpat Nagar under ₹50 · Max Green Credits', prompt: 'Evening carpool from Lajpat Nagar under ₹50 with max carbon credits.' }
      ],
      routines: {
        mon: {
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
      }
    },
    ananya: {
      id: 'ananya',
      name: 'Ananya Roy',
      shortName: 'Ananya',
      role: 'Climate Tech Lead',
      badge: 'Tier 3 Green Pioneer',
      avatar: 'images/driver_priya.jpg',
      avatarColor: '#1b3260',
      initials: 'AR',
      credits: 890,
      co2SavedKg: 92.4,
      tripsCompleted: 68,
      corridor: 'NH-48 EV Expressway & Cyber Corridor',
      primaryHub: 'Vasant Kunj B-Block',
      destination: 'Cyber City DLF',
      vehiclePref: 'Tata Nexon EV / MG ZS EV',
      habitualDays: 'Tuesdays, Wednesdays & Fridays (08:15 AM)',
      streak: 24,
      prompts: [
        { icon: 'zap', label: 'Vasant Kunj → Cyber City · 08:15 AM · EV', prompt: 'Carpool from Vasant Kunj to Cyber City Gurugram around 8:15 AM in an EV with FASTag rebate.' },
        { icon: 'building-2', label: 'Saket to Aerocity Worldmark · EV Front Seat', prompt: 'Morning ride from Saket District Centre to Aerocity Worldmark 2 around 8:40 AM with Priya.' },
        { icon: 'leaf', label: 'Cyber City to South Delhi · Zero Tailpipe', prompt: 'Evening carpool from Cyber City to South Delhi under ₹70 with max Green Credits.' }
      ],
      routines: {
        mon: {
          dest: 'Cyber City DLF',
          driver: 'Rajesh K.',
          driverImg: 'images/driver_rajesh.jpg',
          driverMeta: '★ 4.8 · 112 verified trips · Tata Nexon EV (Clean Corridor)',
          matchPct: '99%',
          startPoint: 'Vasant Kunj B-Block Gate 2',
          startTime: '08:15 AM · 150m walk',
          corridor: '16.5 km · NH-48 Express HOV Lane',
          endPoint: 'Cyber City Building 10',
          endTime: '08:50 AM · Cyber Hub Concourse',
          fare: '₹70',
          credits: '+65 Credits',
          co2: '-3.2 kg CO₂',
          quote: 'Hey <strong>Ananya</strong>! Routing to <strong>Cyber City</strong> today? I’ve paired you with <strong>Rajesh</strong> on the express HOV corridor (99% alignment). Lock in to preserve your 24-day zero-tailpipe streak!'
        },
        wed: {
          dest: 'Aerocity Hospitality District',
          driver: 'Priya M.',
          driverImg: 'images/driver_priya.jpg',
          driverMeta: '★ 4.9 · 87 verified trips · Tata Nexon EV',
          matchPct: '96%',
          startPoint: 'Saket District Centre',
          startTime: '08:40 AM · Metro Gate 1',
          corridor: '11.8 km · Clean Spine Corridor',
          endPoint: 'Aerocity Worldmark 2',
          endTime: '09:10 AM · Central Plaza',
          fare: '₹50',
          credits: '+55 Credits',
          co2: '-2.6 kg CO₂',
          quote: 'Hi <strong>Ananya</strong>! Heading to <strong>Aerocity</strong>? <strong>Priya</strong> is departing Saket at 08:40 AM with an open EV front seat. One tap secures your seat + <strong>55 Green Credits</strong>.'
        },
        fri: {
          dest: 'One Horizon Center',
          driver: 'Dr. Sen',
          driverImg: 'images/driver_rajesh.jpg',
          driverMeta: '★ 4.95 · 140 verified trips · Hyundai Ioniq 5',
          matchPct: '95%',
          startPoint: 'Green Park Metro',
          startTime: '08:30 AM · South Extension exit',
          corridor: '24.2 km · Southern Peripheral EV Flyway',
          endPoint: 'Golf Course Road, Horizon',
          endTime: '09:15 AM · Main Portico',
          fare: '₹80',
          credits: '+70 Credits',
          co2: '-4.1 kg CO₂',
          quote: 'Friday executive commute to <strong>Horizon Center</strong>, <strong>Ananya</strong>? <strong>Dr. Sen’s</strong> Ioniq 5 has 1 open pod seat on the Southern Peripheral. Reserve now for <strong>70 Green Credits</strong>.'
        }
      }
    },
    rohan: {
      id: 'rohan',
      name: 'Dr. Rohan Sen',
      shortName: 'Dr. Sen',
      role: 'Clean Air Epidemiologist',
      badge: 'Tier 3 EV Specialist',
      avatar: 'images/driver_rajesh.jpg',
      avatarColor: '#2a427f',
      initials: 'RS',
      credits: 1150,
      co2SavedKg: 134.2,
      tripsCompleted: 98,
      corridor: 'Aurobindo Marg & Medical Hub Corridor',
      primaryHub: 'Hauz Khas Enclave',
      destination: 'AIIMS & South Campus',
      vehiclePref: 'Hyundai Ioniq 5 EV',
      habitualDays: 'Daily Weekdays (07:45 AM)',
      streak: 42,
      prompts: [
        { icon: 'activity', label: 'Hauz Khas → AIIMS · 07:45 AM · Clean Link', prompt: 'Morning clinical commute from Hauz Khas to AIIMS Emergency Corridor at 07:45 AM in an EV.' },
        { icon: 'building-2', label: 'Panchsheel → Safdarjung Labs · 07:50 AM', prompt: 'Carpool to Safdarjung Research Labs around 7:50 AM with Rajesh, hospital lane pass.' },
        { icon: 'leaf', label: 'South Ex to DU North Campus · Friday 08:00', prompt: 'Friday carpool to Vallabhbhai Patel Chest Institute DU North Campus at 08:00 AM with Vikram.' }
      ],
      routines: {
        mon: {
          dest: 'AIIMS New Delhi',
          driver: 'Priya M.',
          driverImg: 'images/driver_priya.jpg',
          driverMeta: '★ 4.9 · 87 verified trips · Tata Nexon EV',
          matchPct: '97%',
          startPoint: 'Hauz Khas Enclave Gate 1',
          startTime: '07:45 AM · 100m walk',
          corridor: '6.4 km · Clean Aurobindo Green Link',
          endPoint: 'AIIMS Emergency Corridor',
          endTime: '08:05 AM · Dedicated HOV Bay',
          fare: '₹40',
          credits: '+50 Credits',
          co2: '-1.9 kg CO₂',
          quote: 'Good morning <strong>Dr. Sen</strong>! For your Monday clinical rounds at <strong>AIIMS</strong>, <strong>Priya’s</strong> EV pod is ready at 07:45 AM (97% route alignment). Tap to lock in and earn <strong>50 Green Credits</strong>.'
        },
        wed: {
          dest: 'Safdarjung Research Labs',
          driver: 'Rajesh K.',
          driverImg: 'images/driver_rajesh.jpg',
          driverMeta: '★ 4.8 · 112 verified trips · Clean Corridor EV',
          matchPct: '96%',
          startPoint: 'Panchsheel Park',
          startTime: '07:50 AM',
          corridor: '8.2 km · Outer Ring Road Clean Lane',
          endPoint: 'Safdarjung Hospital Gate 3',
          endTime: '08:15 AM',
          fare: '₹45',
          credits: '+50 Credits',
          co2: '-2.1 kg CO₂',
          quote: 'Hello <strong>Dr. Sen</strong>! Connecting to <strong>Safdarjung Labs</strong> today? I’ve held a front seat with <strong>Rajesh</strong> on the Outer Ring Road. Claim your <strong>50 Green Credits</strong>.'
        },
        fri: {
          dest: 'Vallabhbhai Patel Chest Institute',
          driver: 'Vikram S.',
          driverImg: 'images/driver_rajesh.jpg',
          driverMeta: '★ 4.6 · 34 verified trips · MG ZS EV',
          matchPct: '93%',
          startPoint: 'South Extension II',
          startTime: '08:00 AM',
          corridor: '19.5 km · Ring Road Rapid Transit',
          endPoint: 'Delhi University North Campus',
          endTime: '08:48 AM',
          fare: '₹70',
          credits: '+65 Credits',
          co2: '-3.4 kg CO₂',
          quote: 'Heading to <strong>North Campus Pulmonary Institute</strong> this Friday, <strong>Dr. Sen</strong>? <strong>Vikram’s</strong> MG ZS EV is passing South Ext at 08:00 AM. 1 seat remaining.'
        }
      }
    },
    vikram: {
      id: 'vikram',
      name: 'Vikram Malhotra',
      shortName: 'Vikram',
      role: 'Intermodal Transit Architect',
      badge: 'Tier 2 Transit Fellow',
      avatar: 'images/driver_rajesh.jpg',
      avatarColor: '#203565',
      initials: 'VM',
      credits: 580,
      co2SavedKg: 64.5,
      tripsCompleted: 45,
      corridor: 'DND Flyway & Noida Bio-Corridor',
      primaryHub: 'Lajpat Nagar Ring Road',
      destination: 'Noida Sector 125 & IT Hub',
      vehiclePref: 'MG ZS EV / Verified Shared Pod',
      habitualDays: 'Mondays, Wednesdays & Thursdays (08:30 AM)',
      streak: 15,
      prompts: [
        { icon: 'map-pin', label: 'Lajpat Nagar → Noida Sec 125 · 08:25 AM', prompt: 'Find a ride from Lajpat Nagar to Noida Sector 125 at 8:25 AM via DND Clean Flyway, cashless.' },
        { icon: 'zap', label: 'Jangpura → Mayur Vihar · Barapullah HOV', prompt: 'Carpool to Mayur Vihar Phase 1 Metro via Barapullah Elevated Transit around 8:40 AM.' },
        { icon: 'leaf', label: 'Ashram → Greater Noida Knowledge Park · EV', prompt: 'Long-distance zero-emission pod to Greater Noida Knowledge Park on Friday at 8:10 AM.' }
      ],
      routines: {
        mon: {
          dest: 'Noida Sector 125 Hub',
          driver: 'Priya M.',
          driverImg: 'images/driver_priya.jpg',
          driverMeta: '★ 4.9 · 87 verified trips · Tata Nexon EV',
          matchPct: '97%',
          startPoint: 'Lajpat Nagar Central Market',
          startTime: '08:25 AM · Metro Station Gate 3',
          corridor: '17.8 km · DND Clean Flyway HOV',
          endPoint: 'Amity / Sector 125 Complex',
          endTime: '09:05 AM · Main Plaza',
          fare: '₹60',
          credits: '+55 Credits',
          co2: '-2.9 kg CO₂',
          quote: 'Hey <strong>Vikram</strong>! Planning your transit review at <strong>Noida Sector 125</strong>? <strong>Priya</strong> is rolling via DND Flyway (97% route match). Tap to lock your shared EV seat.'
        },
        wed: {
          dest: 'Mayur Vihar Mobility Interchange',
          driver: 'Rajesh K.',
          driverImg: 'images/driver_rajesh.jpg',
          driverMeta: '★ 4.8 · 112 verified trips · Tata Nexon EV',
          matchPct: '95%',
          startPoint: 'Jangpura Flyover',
          startTime: '08:40 AM',
          corridor: '12.4 km · Barapullah Elevated Transit',
          endPoint: 'Mayur Vihar Phase 1 Metro',
          endTime: '09:10 AM',
          fare: '₹50',
          credits: '+50 Credits',
          co2: '-2.2 kg CO₂',
          quote: 'Good morning <strong>Vikram</strong>! heading to <strong>Mayur Vihar Interchange</strong>? <strong>Rajesh</strong> is on Barapullah at 08:40 AM with an open seat.'
        },
        fri: {
          dest: 'Greater Noida Knowledge Park',
          driver: 'Vikram S.',
          driverImg: 'images/driver_rajesh.jpg',
          driverMeta: '★ 4.6 · 34 verified trips · Clean EV',
          matchPct: '92%',
          startPoint: 'Ashram Chowk Underpass',
          startTime: '08:10 AM',
          corridor: '32.0 km · Noida-Greater Noida Expressway',
          endPoint: 'Knowledge Park III',
          endTime: '09:05 AM',
          fare: '₹90',
          credits: '+75 Credits',
          co2: '-4.6 kg CO₂',
          quote: 'Heading out to <strong>Knowledge Park</strong> on Friday, <strong>Vikram</strong>? Long-distance zero-emission pod matched with <strong>Vikram S.</strong> for <strong>75 Green Credits</strong>.'
        }
      }
    },
    sneha: {
      id: 'sneha',
      name: 'Sneha Kapur',
      shortName: 'Sneha',
      role: 'Design Strategist',
      badge: 'Tier 1 Urban Commuter',
      avatar: 'images/driver_priya.jpg',
      avatarColor: '#17274e',
      initials: 'SK',
      credits: 310,
      co2SavedKg: 35.2,
      tripsCompleted: 23,
      corridor: 'Ring Road & Hauz Khas Arts Corridor',
      primaryHub: 'Hauz Khas Village',
      destination: 'Lodhi Art District & CGO',
      vehiclePref: 'Shared Compact EV',
      habitualDays: 'Tuesdays & Thursdays (09:00 AM)',
      streak: 9,
      prompts: [
        { icon: 'compass', label: 'Hauz Khas → Lodhi Art District · 08:50 AM', prompt: 'Creative session commute from Hauz Khas to Lodhi Art District Block 12 around 08:50 AM in an EV.' },
        { icon: 'building-2', label: 'Green Park → Khan Market · 09:00 AM', prompt: 'Shared EV ride from Green Park to Khan Market Metro Gate 4 at 09:00 AM with Rajesh.' },
        { icon: 'leaf', label: 'AIIMS → CP British Council · 09:10 AM', prompt: 'Friday commute to Connaught Place British Council at 09:10 AM with Priya for 50 Green Credits.' }
      ],
      routines: {
        mon: {
          dest: 'Lodhi Art District',
          driver: 'Priya M.',
          driverImg: 'images/driver_priya.jpg',
          driverMeta: '★ 4.9 · 87 verified trips · Tata Nexon EV',
          matchPct: '98%',
          startPoint: 'Hauz Khas Metro Gate 2',
          startTime: '08:50 AM · 100m walk',
          corridor: '9.2 km · Sri Aurobindo Clean Corridor',
          endPoint: 'Lodhi Colony Block 12',
          endTime: '09:20 AM · Habitat Centre',
          fare: '₹45',
          credits: '+45 Credits',
          co2: '-2.0 kg CO₂',
          quote: 'Hey <strong>Sneha</strong>! Ready for your creative session at <strong>Lodhi Art District</strong>? <strong>Priya</strong> has reserved seat #2 in her clean EV pod. One tap saves 2.0 kg CO₂!'
        },
        wed: {
          dest: 'Khan Market Cultural Hub',
          driver: 'Rajesh K.',
          driverImg: 'images/driver_rajesh.jpg',
          driverMeta: '★ 4.8 · 112 verified trips · Clean Corridor EV',
          matchPct: '94%',
          startPoint: 'Green Park Market',
          startTime: '09:00 AM',
          corridor: '7.8 km · Ring Road to Subramaniam Marg',
          endPoint: 'Khan Market Metro Gate 4',
          endTime: '09:25 AM',
          fare: '₹40',
          credits: '+40 Credits',
          co2: '-1.8 kg CO₂',
          quote: 'Good morning <strong>Sneha</strong>! Heading to <strong>Khan Market</strong> on Wednesday? <strong>Rajesh</strong> has a shared EV seat available with 94% alignment.'
        },
        fri: {
          dest: 'Connaught Place British Council',
          driver: 'Priya M.',
          driverImg: 'images/driver_priya.jpg',
          driverMeta: '★ 4.9 · 87 verified trips · Tata Nexon EV',
          matchPct: '96%',
          startPoint: 'AIIMS Flyover North',
          startTime: '09:10 AM',
          corridor: '11.5 km · Central Vista Green Corridor',
          endPoint: 'Kasturba Gandhi Marg',
          endTime: '09:40 AM',
          fare: '₹50',
          credits: '+50 Credits',
          co2: '-2.3 kg CO₂',
          quote: 'Friday visit to <strong>CP British Council</strong>, <strong>Sneha</strong>? <strong>Priya</strong> is departing AIIMS Flyover at 09:10 AM. Claim your <strong>50 Green Credits</strong>.'
        }
      }
    }
  },

  listeners: [],

  getAllPersonas() {
    return Object.values(this.PERSONAS);
  },

  getCurrentUser() {
    let savedId = null;
    try {
      savedId = localStorage.getItem(this.STORAGE_KEY);
    } catch (e) {}

    const id = (savedId && this.PERSONAS[savedId]) ? savedId : 'adesh';
    const base = this.PERSONAS[id];

    // Load any dynamic credits/offsets saved in localStorage
    try {
      const customData = JSON.parse(localStorage.getItem(this.CUSTOM_DATA_KEY) || '{}');
      if (customData[id]) {
        return { ...base, ...customData[id] };
      }
    } catch (e) {}

    return { ...base };
  },

  setCurrentUser(userId) {
    if (!this.PERSONAS[userId]) return false;
    try {
      localStorage.setItem(this.STORAGE_KEY, userId);
    } catch (e) {}

    const updatedUser = this.getCurrentUser();
    this.notify(updatedUser);
    if (typeof CeraToast !== 'undefined') {
      CeraToast.show(`Switched to ${updatedUser.name} (${updatedUser.role}). Corridors, routines, and Green Credits synchronized.`, {
        title: 'Commuter Persona Active',
        type: 'info'
      });
    }
    return true;
  },

  addCredits(amount) {
    const user = this.getCurrentUser();
    user.credits = (user.credits || 0) + Number(amount);
    user.tripsCompleted = (user.tripsCompleted || 0) + 1;
    user.co2SavedKg = +(user.co2SavedKg + 2.4).toFixed(1);
    this.persistUserData(user.id, {
      credits: user.credits,
      tripsCompleted: user.tripsCompleted,
      co2SavedKg: user.co2SavedKg
    });
    this.notify(user);
    return user;
  },

  deductCredits(amount) {
    const user = this.getCurrentUser();
    if (user.credits < amount) return false;
    user.credits -= Number(amount);
    this.persistUserData(user.id, { credits: user.credits });
    this.notify(user);
    return true;
  },

  persistUserData(userId, data) {
    try {
      const all = JSON.parse(localStorage.getItem(this.CUSTOM_DATA_KEY) || '{}');
      all[userId] = { ...(all[userId] || {}), ...data };
      localStorage.setItem(this.CUSTOM_DATA_KEY, JSON.stringify(all));
    } catch (e) {}
  },

  onUserChange(fn) {
    if (typeof fn === 'function') {
      this.listeners.push(fn);
    }
  },

  notify(user) {
    this.listeners.forEach(fn => {
      try { fn(user); } catch (err) { console.error('User listener error:', err); }
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   5.6. NAVBAR COMMUTER PROFILE & QUICK PERSONA SWITCHER
   ═══════════════════════════════════════════════════════════════ */
function initUserProfileNav() {
  const menu = document.getElementById('user-profile-menu');
  const btn = document.getElementById('user-profile-btn');
  const list = document.getElementById('dropdown-persona-list');
  const navAvatar = document.getElementById('nav-user-avatar');
  const navName = document.getElementById('nav-user-name');
  const navCredits = document.getElementById('nav-user-credits');
  const dropdownRole = document.getElementById('dropdown-user-role');
  const mobileAvatar = document.getElementById('mobile-user-avatar');
  const mobileName = document.getElementById('mobile-user-name');
  const mobileRole = document.getElementById('mobile-user-role');
  const mobileSwitchBtn = document.getElementById('btn-mobile-switch-persona');

  function renderDropdownPersonas(activeUser) {
    if (!list) return;
    const personas = CeraUserManager.getAllPersonas();
    list.innerHTML = personas.map(p => {
      const isActive = p.id === activeUser.id;
      return `
        <button type="button" class="dropdown-persona-item ${isActive ? 'is-active' : ''}" data-persona-id="${p.id}">
          <img src="${p.avatar}" alt="${p.name}" class="dropdown-persona-avatar" />
          <div class="dropdown-persona-meta">
            <span class="dropdown-persona-name">${p.name} ${isActive ? '✓' : ''}</span>
            <span class="dropdown-persona-role">${p.role} · ${p.destination}</span>
          </div>
          <span class="dropdown-persona-tag">${p.credits} GC</span>
        </button>
      `;
    }).join('');

    list.querySelectorAll('.dropdown-persona-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = item.dataset.personaId;
        CeraUserManager.setCurrentUser(id);
        if (menu) menu.classList.remove('is-open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function syncNav(user) {
    if (navAvatar) {
      navAvatar.src = user.avatar;
      navAvatar.alt = user.name;
    }
    if (navName) navName.textContent = user.shortName || user.name;
    if (navCredits) navCredits.textContent = user.credits;
    if (dropdownRole) dropdownRole.textContent = `${user.role} · ${user.badge}`;

    if (mobileAvatar) {
      mobileAvatar.src = user.avatar;
      mobileAvatar.alt = user.name;
    }
    if (mobileName) mobileName.textContent = user.name;
    if (mobileRole) mobileRole.textContent = `${user.badge} · ${user.credits} GC`;

    const heroAvatar = document.getElementById('hero-user-avatar');
    const heroName = document.getElementById('hero-user-name');
    const heroTier = document.getElementById('hero-user-tier');
    const heroCredits = document.getElementById('hero-user-credits');

    if (heroAvatar) {
      heroAvatar.src = user.avatar;
      heroAvatar.alt = user.name;
    }
    if (heroName) heroName.textContent = user.name;
    if (heroTier) heroTier.innerHTML = `<i data-lucide="shield-check" class="icon icon--xxs"></i> ${user.badge} · ${user.corridor}`;
    if (heroCredits) heroCredits.textContent = user.credits;

    renderDropdownPersonas(user);
    if (window.lucide) lucide.createIcons();
  }

  // Initial populate
  const initialUser = CeraUserManager.getCurrentUser();
  syncNav(initialUser);

  // Subscribe to changes
  CeraUserManager.onUserChange(user => {
    syncNav(user);
  });

  if (btn && menu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (mobileSwitchBtn) {
    mobileSwitchBtn.addEventListener('click', () => {
      const personas = CeraUserManager.getAllPersonas();
      const curr = CeraUserManager.getCurrentUser();
      const idx = personas.findIndex(p => p.id === curr.id);
      const nextIdx = (idx + 1) % personas.length;
      CeraUserManager.setCurrentUser(personas[nextIdx].id);
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   5.7. COMMUTER PERSONA DIRECTORY MODAL
   ═══════════════════════════════════════════════════════════════ */
function initPersonaModal() {
  const modal = document.getElementById('cera-persona-modal');
  const openBtn = document.getElementById('btn-open-persona-modal');
  const closeBtn = document.getElementById('persona-modal-close-btn');
  const doneBtn = document.getElementById('persona-modal-done-btn');
  const grid = document.getElementById('persona-modal-grid');

  if (!modal || !grid) return;

  function renderCards(activeUser) {
    const personas = CeraUserManager.getAllPersonas();
    grid.innerHTML = personas.map(p => {
      const isActive = p.id === activeUser.id;
      return `
        <div class="persona-card ${isActive ? 'is-active' : ''}">
          <div class="persona-card-header">
            <img src="${p.avatar}" alt="${p.name}" class="persona-card-avatar" />
            <div class="persona-card-meta">
              <span class="persona-card-name">${p.name}</span>
              <span class="persona-card-role">${p.role}</span>
              <span class="persona-card-badge">${p.badge}</span>
            </div>
          </div>

          <div class="persona-stats-grid">
            <div class="persona-stat-cell">
              <span class="persona-stat-num">${p.credits}</span>
              <span class="persona-stat-lbl">Credits</span>
            </div>
            <div class="persona-stat-cell">
              <span class="persona-stat-num">${p.co2SavedKg} kg</span>
              <span class="persona-stat-lbl">CO₂ Offset</span>
            </div>
            <div class="persona-stat-cell">
              <span class="persona-stat-num">${p.streak}d</span>
              <span class="persona-stat-lbl">Streak</span>
            </div>
          </div>

          <div class="persona-info-rows">
            <div class="persona-info-row">
              <i data-lucide="map-pin" class="icon icon--xxs"></i>
              <span>Hub: <strong>${p.primaryHub}</strong> → <strong>${p.destination}</strong></span>
            </div>
            <div class="persona-info-row">
              <i data-lucide="calendar" class="icon icon--xxs"></i>
              <span>Routine: <strong>${p.habitualDays}</strong></span>
            </div>
            <div class="persona-info-row">
              <i data-lucide="car" class="icon icon--xxs"></i>
              <span>Preferred: <strong>${p.vehiclePref}</strong></span>
            </div>
          </div>

          <button type="button" class="persona-btn-select" data-persona-id="${p.id}" ${isActive ? 'disabled' : ''}>
            ${isActive ? '✓ Active Commuter Persona' : 'Switch to this Persona'}
          </button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.persona-btn-select:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.personaId;
        CeraUserManager.setCurrentUser(id);
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  function openModal() {
    renderCards(CeraUserManager.getCurrentUser());
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  CeraUserManager.onUserChange(user => {
    if (modal.classList.contains('is-active')) {
      renderCards(user);
    }
  });
}

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

  let activeUser = CeraUserManager.getCurrentUser();
  let routines = activeUser.routines || CeraUserManager.PERSONAS.adesh.routines;

  let isLocked = false;
  const commuteContext = CeraAISystem.getCommuteContext();
  let currentDay = commuteContext.routineDayKey || 'mon';

  function buildSystemGreeting(routine, sys, ctx) {
    const greeting = ctx.greetingPrefix;
    const timeStr = ctx.timeFormatted;
    const osName = sys.os;
    const rush = ctx.isRushHour ? ` <span class="ai-greeting-alert">⚡ ${ctx.commuteContext}</span>` : '';
    const commuterName = activeUser.shortName || routine.user;
    return `"${greeting}, <strong>${commuterName}</strong>! Connected from your <strong>${osName}</strong> system at ${timeStr}.${rush} For your <strong>${ctx.dayName}</strong> commute to <strong>${routine.dest}</strong>, I’ve pre-matched you with <strong>${routine.driver}</strong> (${routine.matchPct} route alignment, EV Sedan). Tap to lock in your ride and claim your daily <strong>${routine.credits || '50 Green Credits'}</strong>."`;
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

  // Initial routine display from localStorage or current diurnal day
  const savedRoutine = localStorage.getItem('cera-commute-routine');
  if (savedRoutine) {
    try {
      const parsed = JSON.parse(savedRoutine);
      if (parsed && parsed.day && routines[parsed.day]) {
        currentDay = parsed.day;
      }
    } catch (e) {}
  }

  applyRoutine(currentDay);

  if (savedRoutine) {
    try {
      const parsed = JSON.parse(savedRoutine);
      if (parsed && parsed.locked) {
        isLocked = true;
        if (lockBtn) lockBtn.classList.add('is-locked');
        if (lockBtnText) lockBtnText.innerHTML = `✓ LOCKED IN · CONFIRMED WITH ${routines[currentDay].driver.toUpperCase()}`;
        if (feedbackBanner) feedbackBanner.style.display = 'flex';
      }
    } catch (e) {}
  }

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

        try {
          localStorage.setItem('cera-commute-routine', JSON.stringify({
            day: currentDay,
            locked: true,
            timestamp: Date.now()
          }));
        } catch (e) {}

        // Dynamically increment citizen's civic credit balance
        CeraUserManager.addCredits(50);
        if (creditsCounter) {
          creditsCounter.textContent = activeUser.credits;
        }
        if (co2Counter) {
          co2Counter.textContent = activeUser.co2SavedKg;
        }

        if (window.lucide) lucide.createIcons();
      } else {
        // Toggle unlock
        isLocked = false;
        lockBtn.classList.remove('is-locked');
        if (lockBtnText) {
          lockBtnText.textContent = `1-TAP LOCK IN RIDE (${routines[currentDay].credits})`;
        }
        if (feedbackBanner) {
          feedbackBanner.style.display = 'none';
        }
        CeraUserManager.deductCredits(50);
        if (creditsCounter) {
          creditsCounter.textContent = activeUser.credits;
        }
        try {
          localStorage.removeItem('cera-commute-routine');
        } catch (e) {}
      }
    });
  }

  // Listen for user persona switches to update Smart-Twin routines & Ride-Scribe prompt chips
  CeraUserManager.onUserChange(user => {
    activeUser = user;
    routines = user.routines || CeraUserManager.PERSONAS.adesh.routines;
    isLocked = false;
    if (creditsCounter) creditsCounter.textContent = user.credits;
    if (co2Counter) co2Counter.textContent = user.co2SavedKg;
    applyRoutine(currentDay);
    renderUserPromptChips(user);
  });

  // Reset Routine Button
  const resetRoutineBtn = document.getElementById('smart-twin-reset-btn');
  if (resetRoutineBtn) {
    resetRoutineBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      try {
        localStorage.removeItem('cera-commute-routine');
      } catch (err) {}
      isLocked = false;
      applyRoutine(commuteContext.routineDayKey || 'mon');
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
    if (lower.includes('cyber city') || lower.includes('gurugram') || lower.includes('horizon')) destination = "Cyber City, Gurugram";
    else if (lower.includes('safdarjung') || lower.includes('aiims') || lower.includes('medical') || lower.includes('pulmonary')) destination = "AIIMS & Safdarjung Medical Hub";
    else if (lower.includes('noida') || lower.includes('knowledge park') || lower.includes('sector 125') || lower.includes('sector 62')) destination = "Noida Sector 125 & IT Hub";
    else if (lower.includes('lodhi') || lower.includes('khan market') || lower.includes('art district')) destination = "Lodhi Art District & Cultural Hub";
    else if (lower.includes('lajpat') || lower.includes('south ex')) destination = "Lajpat Nagar / South Ex";
    else if (lower.includes('aerocity') || lower.includes('worldmark')) destination = "Aerocity Worldmark District";
    else if (lower.includes('rohini')) destination = "Rohini Sector 11";
    else if (lower.includes('dwarka')) destination = "Dwarka Sector 10 Hub";

    // 2. Time
    let time = "Tomorrow, 08:30 AM";
    if (lower.includes('7:45') || lower.includes('07:45')) time = "Tomorrow, 07:45 AM";
    else if (lower.includes('7:50') || lower.includes('07:50')) time = "Tomorrow, 07:50 AM";
    else if (lower.includes('8:10') || lower.includes('08:10')) time = "Tomorrow, 08:10 AM";
    else if (lower.includes('8:15') || lower.includes('08:15')) time = "Tomorrow, 08:15 AM";
    else if (lower.includes('8:25') || lower.includes('08:25')) time = "Tomorrow, 08:25 AM";
    else if (lower.includes('8:40') || lower.includes('08:40')) time = "Tomorrow, 08:40 AM";
    else if (lower.includes('8:50') || lower.includes('08:50')) time = "Tomorrow, 08:50 AM";
    else if (lower.includes('9:00') || lower.includes('9 am') || lower.includes('09:00')) time = "Tomorrow, 09:00 AM";
    else if (lower.includes('9:10') || lower.includes('09:10')) time = "Tomorrow, 09:10 AM";
    else if (lower.includes('evening') || lower.includes('6:45') || lower.includes('night')) time = "Today, 06:45 PM";
    else if (lower.includes('8:00') || lower.includes('8 am') || lower.includes('08:00')) time = "Tomorrow, 08:00 AM";

    // 3. Payment
    let payment = "UPI Dynamic Split";
    if (lower.includes('cashless')) payment = "Automated FASTag / NCMC";
    else if (lower.includes('fastag')) payment = "FASTag Toll Split";
    else if (lower.includes('upi')) payment = "UPI Split (Instant)";

    // 4. Discounts & Rebates
    let discount = "Civic Green Credits Applied";
    if (lower.includes('metro pass') || lower.includes('dmrc')) discount = "DMRC Metro Pass (-20% / ₹12 off)";
    else if (lower.includes('fastag rebate') || lower.includes('toll')) discount = "NHAI Toll Rebate (15% off)";
    else if (lower.includes('hospital') || lower.includes('lane pass')) discount = "Emergency / Hospital Priority Pass";
    else if (lower.includes('student') || lower.includes('cultural')) discount = "Student & Cultural Pass (-25%)";
    else if (lower.includes('carbon') || lower.includes('green credits')) discount = "Civic Green Credits 2.5× Boost";

    // 5. Vehicle Preference
    let vehicle = "Zero-Emission EV Sedan";
    if (lower.includes('ioniq') || lower.includes('hepa') || lower.includes('filter')) vehicle = "Hyundai Ioniq 5 EV (HEPA Clean Air)";
    else if (lower.includes('nexon') || lower.includes('ev sedan')) vehicle = "Tata Nexon EV (Zero Tailpipe)";
    else if (lower.includes('mg zs') || lower.includes('clean ev')) vehicle = "MG ZS EV (Zero Emission)";
    else if (lower.includes('hybrid')) vehicle = "Hybrid Clean Pod";
    else vehicle = "Verified High-Occupancy Pod";

    // 6. Matched Pod Details
    let driver = "Priya M.";
    let driverCar = "Tata Nexon EV";
    let matchScore = "98%";
    let fare = "₹48";
    if (destination.includes('Cyber City') || destination.includes('Gurugram')) {
      driver = "Rajesh K.";
      driverCar = "Tata Nexon EV";
      matchScore = "99%";
      fare = "₹70";
    } else if (destination.includes('AIIMS') || destination.includes('Safdarjung')) {
      driver = "Priya M.";
      driverCar = "Tata Nexon EV";
      matchScore = "97%";
      fare = "₹40";
    } else if (destination.includes('Noida') || destination.includes('Knowledge Park')) {
      driver = "Vikram S.";
      driverCar = "MG ZS EV";
      matchScore = "96%";
      fare = "₹60";
    } else if (destination.includes('Lodhi') || destination.includes('Khan Market')) {
      driver = "Priya M.";
      driverCar = "Tata Nexon EV";
      matchScore = "98%";
      fare = "₹45";
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

  // Dynamic User Prompt Chips Synchronization
  function renderUserPromptChips(user) {
    const dockWrap = document.getElementById('dock-ai-chips-wrap');
    const scribeWrap = document.getElementById('scribe-sample-pills-wrap');
    const prompts = (user && user.prompts) || (CeraUserManager.PERSONAS.adesh && CeraUserManager.PERSONAS.adesh.prompts) || [];
    const displayName = (user && (user.shortName || user.name)) || 'Commuter';

    if (dockWrap) {
      dockWrap.innerHTML = `
        <span class="chips-label">AI Prompts (${displayName}):</span>
        ${prompts.map(p => `
          <button type="button" class="ai-quick-chip" data-prompt="${p.prompt.replace(/"/g, '&quot;')}">
            <i data-lucide="${p.icon || 'zap'}" class="icon icon--xs"></i> ${p.label}
          </button>
        `).join('')}
      `;

      dockWrap.querySelectorAll('.ai-quick-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const prompt = chip.dataset.prompt || '';
          if (dockInput) dockInput.value = prompt;
          if (secInput) secInput.value = prompt;
          const parsed = parseNaturalLanguage(prompt);
          renderDockOutput(parsed);
          renderSectionOutput(parsed);
        });
      });
    }

    if (scribeWrap) {
      scribeWrap.innerHTML = `
        <span class="pills-title">Click to test prompts (${displayName}):</span>
        ${prompts.map(p => `
          <button type="button" class="scribe-sample-pill" data-query="${p.prompt.replace(/"/g, '&quot;')}">
            "${p.prompt}"
          </button>
        `).join('')}
        <button type="button" id="scribe-cycle-btn" class="scribe-cycle-btn" title="Cycle Next Scenario" aria-label="Cycle next scenario">
          <i data-lucide="refresh-cw" class="icon icon--xs"></i> Cycle Scenarios
        </button>
      `;

      scribeWrap.querySelectorAll('.scribe-sample-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const query = pill.dataset.query || '';
          if (secInput) secInput.value = query;
          if (dockInput) dockInput.value = query;
          const parsed = parseNaturalLanguage(query);
          renderSectionOutput(parsed);
          renderDockOutput(parsed);
        });
      });

      const cycleBtn = document.getElementById('scribe-cycle-btn');
      if (cycleBtn) {
        let currentPromptIdx = 0;
        cycleBtn.addEventListener('click', () => {
          if (!prompts.length) return;
          currentPromptIdx = (currentPromptIdx + 1) % prompts.length;
          const p = prompts[currentPromptIdx];
          if (secInput) secInput.value = p.prompt;
          if (dockInput) dockInput.value = p.prompt;
          const parsed = parseNaturalLanguage(p.prompt);
          renderSectionOutput(parsed);
          renderDockOutput(parsed);
        });
      }
    }

    if (window.lucide) lucide.createIcons();
  }

  // Initial population of prompt chips for active user
  renderUserPromptChips(activeUser);

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

  // ─── CLIPBOARD QUICK-PASTE & SCENARIO CYCLING ───
  const dockPasteBtn = document.getElementById('dock-scribe-paste');
  const secPasteBtn = document.getElementById('section-scribe-paste');
  const cycleBtn = document.getElementById('scribe-cycle-btn');

  async function pasteClipboardToScribe(inputElem) {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      alert('Clipboard API access requires browser permission or HTTPS context.');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        if (inputElem) inputElem.value = text.trim();
        if (dockInput) dockInput.value = text.trim();
        if (secInput) secInput.value = text.trim();
        const parsed = parseNaturalLanguage(text.trim());
        renderDockOutput(parsed);
        renderSectionOutput(parsed);
        handleUserChatPrompt(text.trim());
      }
    } catch (err) {
      console.warn('Clipboard read warning:', err);
    }
  }

  if (dockPasteBtn) {
    dockPasteBtn.addEventListener('click', () => pasteClipboardToScribe(dockInput));
  }
  if (secPasteBtn) {
    secPasteBtn.addEventListener('click', () => pasteClipboardToScribe(secInput));
  }

  const cycleScenarios = [
    "Find me a ride to office tomorrow around 8:30 AM, split the fuel via UPI, and apply my metro pass discount.",
    "Carpool from Rohini to Cyber City Gurugram around 9:00 AM in an EV with FASTag rebate.",
    "Evening carpool from Lajpat Nagar under ₹50 with max carbon credits.",
    "Express EV carpool from Noida Sec 62 to AIIMS via DND Flyway around 08:45 AM.",
    "Morning zero-emission ride from Dwarka Sector 10 to Connaught Place via Airport Express bypass."
  ];
  let cycleIdx = 0;

  if (cycleBtn) {
    cycleBtn.addEventListener('click', () => {
      cycleIdx = (cycleIdx + 1) % cycleScenarios.length;
      const prompt = cycleScenarios[cycleIdx];
      if (secInput) secInput.value = prompt;
      if (dockInput) dockInput.value = prompt;
      const parsed = parseNaturalLanguage(prompt);
      renderSectionOutput(parsed);
      renderDockOutput(parsed);
      handleUserChatPrompt(prompt);
    });
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

  // GPS Location Sensor Integration
  const detectGpsBtn = document.getElementById('btn-detect-gps');
  const gpsStatus = document.getElementById('heatmap-gps-status');

  if (detectGpsBtn) {
    detectGpsBtn.addEventListener('click', () => {
      if (gpsStatus) {
        gpsStatus.innerHTML = `Acquiring system geolocation sensors...`;
      }

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(4);
            const lon = pos.coords.longitude.toFixed(4);
            const acc = Math.round(pos.coords.accuracy || 25);
            if (gpsStatus) {
              gpsStatus.innerHTML = `<strong>Live GPS Sync:</strong> ${lat}° N, ${lon}° E (±${acc}m) · Calibrated to Nearest Clean Inflow (Barapullah Elevated)`;
            }
            const barapullahBtn = document.querySelector('[data-route="cp-barapullah"]');
            if (barapullahBtn) barapullahBtn.click();
            playCeraAudioCue('success');
          },
          (err) => {
            if (gpsStatus) {
              gpsStatus.innerHTML = `<strong>Calibrated GPS Node:</strong> 28.6315° N, 77.2167° E (Connaught Place Hub) · 850m from Clean Inflow Route`;
            }
            const barapullahBtn = document.querySelector('[data-route="cp-barapullah"]');
            if (barapullahBtn) barapullahBtn.click();
            playCeraAudioCue('success');
          },
          { timeout: 6000 }
        );
      } else {
        if (gpsStatus) {
          gpsStatus.innerHTML = `<strong>Calibrated GPS Node:</strong> 28.6315° N, 77.2167° E · Clean Barapullah Corridor Active`;
        }
      }
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

/* ═══════════════════════════════════════════════════════════════
   CERA-AI SYSTEM ENVIRONMENT DIAGNOSTICS DRAWER CONTROLLER
   ═══════════════════════════════════════════════════════════════ */
function initCeraDiagnostics() {
  const openBtn = document.getElementById('btn-open-diagnostics');
  const drawer = document.getElementById('cera-diagnostics-drawer');
  const backdrop = document.getElementById('diagnostics-backdrop');
  const closeBtn = document.getElementById('diagnostics-close-btn');
  const body = document.getElementById('diagnostics-body');
  const copyBtn = document.getElementById('btn-copy-diagnostics');
  const copyText = document.getElementById('copy-report-text');

  if (!drawer || !body) return;

  function renderDiagnostics() {
    const sys = CeraAISystem.getSystemInfo();
    const hw = CeraAISystem.getHardwareTelemetry();
    const ctx = CeraAISystem.getCommuteContext();

    body.innerHTML = `
      <div class="diag-section">
        <span class="diag-section-title">01 · Client OS & Browser Engine</span>
        <div class="diag-grid">
          <div class="diag-cell">
            <span class="diag-cell-lbl">Operating System</span>
            <span class="diag-cell-val">${sys.os}</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Browser Engine</span>
            <span class="diag-cell-val">${sys.browser}</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Display & DPR</span>
            <span class="diag-cell-val">${sys.displayInfo} (DPR: ${sys.dpr})</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Keyboard Shortcut</span>
            <span class="diag-cell-val">${sys.shortcutKey} (Omnibar)</span>
          </div>
        </div>
      </div>

      <div class="diag-section">
        <span class="diag-section-title">02 · Hardware Telemetry & Concurrency</span>
        <div class="diag-grid">
          <div class="diag-cell">
            <span class="diag-cell-lbl">CPU Hardware</span>
            <span class="diag-cell-val">${hw.cores}</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Allocated Memory</span>
            <span class="diag-cell-val">${hw.ram}</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Network Downlink</span>
            <span class="diag-cell-val">${hw.netType} (${hw.isOnline ? 'Online' : 'Offline'})</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Device Architecture</span>
            <span class="diag-cell-val">${sys.isMobile ? 'Mobile Touch' : 'Desktop Workstation'}</span>
          </div>
        </div>
      </div>

      <div class="diag-section">
        <span class="diag-section-title">03 · Diurnal Transit Context</span>
        <div class="diag-grid">
          <div class="diag-cell">
            <span class="diag-cell-lbl">System Time & Day</span>
            <span class="diag-cell-val">${ctx.timeFormatted} · ${ctx.dayName}</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Diurnal Transit Period</span>
            <span class="diag-cell-val">${ctx.timePeriod}</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Arterial Flow Context</span>
            <span class="diag-cell-val">${ctx.commuteContext}</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Peak Rush Advisory</span>
            <span class="diag-cell-val">${ctx.isRushHour ? 'Peak Congestion Active' : 'Off-Peak Clean Flow'}</span>
          </div>
        </div>
      </div>

      <div class="diag-section">
        <span class="diag-section-title">04 · CERA-AI Core Platform Node</span>
        <div class="diag-grid">
          <div class="diag-cell">
            <span class="diag-cell-lbl">Dispatch Latency</span>
            <span class="diag-cell-val">18ms (Edge Node)</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Cached Arterial Corridors</span>
            <span class="diag-cell-val">14,820 High-Occupancy Routes</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Privacy Encryption</span>
            <span class="diag-cell-val">Zero-Knowledge ZK-SNARK</span>
          </div>
          <div class="diag-cell">
            <span class="diag-cell-lbl">Active Routine Day</span>
            <span class="diag-cell-val">${ctx.routineDayKey.toUpperCase()} Pod Pre-Matched</span>
          </div>
        </div>
      </div>
    `;
  }

  function openDrawer() {
    renderDiagnostics();
    drawer.classList.add('is-active');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    drawer.classList.remove('is-active');
    drawer.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const sys = CeraAISystem.getSystemInfo();
      const hw = CeraAISystem.getHardwareTelemetry();
      const ctx = CeraAISystem.getCommuteContext();

      const report = `[CERA-AI System Environment Diagnostic Report]\n` +
        `• Client OS: ${sys.os} (${sys.browser})\n` +
        `• Display: ${sys.displayInfo} (DPR: ${sys.dpr})\n` +
        `• Hardware: ${hw.cores} | ${hw.ram} | ${hw.netType}\n` +
        `• Transit Context: ${ctx.timeFormatted} (${ctx.commuteContext})\n` +
        `• Rush Status: ${ctx.isRushHour ? 'PEAK RUSH' : 'OFF-PEAK'}\n` +
        `• Core Telemetry: 18ms Latency | 14,820 Paths Cached | ZK-Encrypted\n` +
        `Generated on: ${new Date().toISOString()}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(report).then(() => {
          if (copyText) copyText.textContent = '✓ Report Copied!';
          setTimeout(() => {
            if (copyText) copyText.textContent = 'Copy Environment Report';
          }, 2000);
        });
      } else {
        alert(report);
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   5.8. INTERACTIVE PERSONAL CARBON & FUEL SAVINGS CALCULATOR
   ═══════════════════════════════════════════════════════════════ */
function initCarbonCalculator() {
  const slider = document.getElementById('calc-distance-slider');
  const distanceVal = document.getElementById('calc-distance-val');
  const fuelButtons = document.querySelectorAll('#calc-fuel-group .calc-btn');
  const seatsButtons = document.querySelectorAll('#calc-seats-group .calc-btn');

  const resSavings = document.getElementById('calc-res-savings');
  const resSavingsYear = document.querySelector('.calc-result-badge');
  const resCo2 = document.getElementById('calc-res-co2');
  const resPm25 = document.getElementById('calc-res-pm25');
  const resCredits = document.getElementById('calc-res-credits');
  const resTier = document.getElementById('calc-res-tier');

  const calcAvatar = document.getElementById('calc-user-avatar');
  const calcName = document.getElementById('calc-user-name');

  if (!slider || !resSavings) return;

  let currentDistance = Number(slider.value) || 18;
  let currentFuel = 'petrol';
  let currentSeats = 3;

  const FUEL_FACTORS = {
    petrol: { costPerKm: 6.91, co2PerKm: 0.165, pm25PerKm: 0.42 },
    diesel: { costPerKm: 4.98, co2PerKm: 0.185, pm25PerKm: 0.85 },
    cng:    { costPerKm: 3.41, co2PerKm: 0.115, pm25PerKm: 0.12 },
    ev:     { costPerKm: 1.05, co2PerKm: 0.035, pm25PerKm: 0.02 }
  };

  function updateSyncUser(user) {
    if (calcAvatar && user && user.avatar) {
      calcAvatar.src = user.avatar;
      calcAvatar.alt = user.name;
    }
    if (calcName && user && user.name) {
      calcName.textContent = user.name;
    }
  }

  function calculate() {
    const monthlyKm = currentDistance * 2 * 22; // 22 working days round-trip
    const factor = FUEL_FACTORS[currentFuel] || FUEL_FACTORS.petrol;
    const tollPerMonth = 2200; // Average monthly DND / Barapullah / expressway toll

    const soloFuelCost = monthlyKm * factor.costPerKm;
    const soloTotalCost = soloFuelCost + tollPerMonth;

    // In a carpool of currentSeats, costs are split and toll has green FASTag rebate (15% off)
    const carpoolToll = (tollPerMonth * 0.85) / currentSeats;
    const carpoolFuel = soloFuelCost / currentSeats;
    const carpoolTotalCost = carpoolFuel + carpoolToll;

    const monthlySavings = Math.round(soloTotalCost - carpoolTotalCost);
    const yearlySavings = monthlySavings * 12;

    // Environmental savings
    const soloCo2 = monthlyKm * factor.co2PerKm;
    const savedCo2 = soloCo2 * (1 - 1 / currentSeats);

    const soloPm25 = monthlyKm * factor.pm25PerKm;
    const savedPm25 = soloPm25 * (1 - 1 / currentSeats);

    // Green credits calculation
    const earnedCredits = Math.round(savedCo2 * 9) + (currentSeats >= 4 ? 60 : 35);

    // Tier calculation
    let tierText = 'Tier 1';
    if (earnedCredits >= 500) {
      tierText = 'Tier 3 (Gold)';
    } else if (earnedCredits >= 250) {
      tierText = 'Tier 2 (Silver)';
    } else {
      tierText = 'Tier 1 (Bronze)';
    }

    // Render results
    resSavings.textContent = `₹${monthlySavings.toLocaleString('en-IN')}`;
    if (resSavingsYear) {
      resSavingsYear.textContent = `₹${yearlySavings.toLocaleString('en-IN')} / Year`;
    }
    if (resCo2) resCo2.textContent = `${savedCo2.toFixed(1)} kg`;
    if (resPm25) resPm25.textContent = `${Math.round(savedPm25)} g`;
    if (resCredits) resCredits.textContent = `+${earnedCredits} GC`;
    if (resTier) resTier.textContent = tierText;
  }

  // Slider events
  slider.addEventListener('input', () => {
    currentDistance = Number(slider.value);
    if (distanceVal) distanceVal.textContent = `${currentDistance} km`;
    calculate();
  });

  // Fuel button events
  fuelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      fuelButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentFuel = btn.dataset.fuel || 'petrol';
      calculate();
    });
  });

  // Seat occupancy events
  seatsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      seatsButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentSeats = Number(btn.dataset.seats) || 3;
      calculate();
    });
  });

  // User synchronization
  if (typeof CeraUserManager !== 'undefined') {
    updateSyncUser(CeraUserManager.getCurrentUser());
    CeraUserManager.onUserChange(user => {
      updateSyncUser(user);
    });
  }

  calculate();
}


