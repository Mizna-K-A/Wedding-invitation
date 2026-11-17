/* ═══════════════════════════════════════════
   WEDDING INVITATION — JAVASCRIPT
   Ajmal & Muhsina · December 2026
═══════════════════════════════════════════ */

/* ══════════════════════════════════════════ */
/*  SVG NAME WRITE-ON ANIMATION               */
/* ══════════════════════════════════════════ */
function animateSVGName(textEl, delay, duration, onComplete) {
  // Use the bounding-box perimeter as a proxy for path length
  // (SVGTextElement doesn't expose getTotalLength directly)
  const len = textEl.getComputedTextLength ? textEl.getComputedTextLength() * 4.5 : 1800;

  textEl.style.strokeDasharray  = len;
  textEl.style.strokeDashoffset = len;
  textEl.style.transition = 'none';

  // Force reflow
  void textEl.getBoundingClientRect();

  setTimeout(() => {
    textEl.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    textEl.style.strokeDashoffset = '0';

    // After stroke finishes, fade fill in
    setTimeout(() => {
      textEl.classList.add('filled');
      if (onComplete) onComplete();
    }, duration);
  }, delay);
}

// Start animations after fonts load
document.fonts.ready.then(() => {
  const ajmalText = document.querySelector('#svg-ajmal .svg-name-text, #svg-emily .svg-name-text');
  const muhsinaText = document.querySelector('#svg-muhsina .svg-name-text, #svg-james .svg-name-text');

  if (ajmalText) {
    animateSVGName(ajmalText, 600, 1800, () => {
      // Muhsina starts drawing as Ajmal finishes
      if (muhsinaText) {
        animateSVGName(muhsinaText, 200, 1800, null);
      }
    });
  }
});

/* ══════════════════════════════════════════ */
/*  HERO SPARKLE PARTICLES                    */
/* ══════════════════════════════════════════ */
(function spawnSparkles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  function createSparkle() {
    const s = document.createElement('div');
    const size = Math.random() * 4 + 1.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = Math.random() * 4 + 3;
    const delay = Math.random() * 3;

    s.style.cssText = `
      position:absolute;
      left:${x}%; top:${y}%;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:rgba(184,151,106,${Math.random() * 0.6 + 0.2});
      pointer-events:none; z-index:4;
      will-change: transform, opacity;
      animation: sparkleAnim ${dur}s ${delay}s ease-in-out infinite;
    `;
    hero.appendChild(s);
  }

  // Inject sparkle keyframe with hardware acceleration
  if (!document.getElementById('sparkle-style')) {
    const st = document.createElement('style');
    st.id = 'sparkle-style';
    st.textContent = `
      @keyframes sparkleAnim {
        0%,100% { opacity:0; transform:scale(0.5) translate3d(0, 0, 0); }
        30%      { opacity:1; transform:scale(1) translate3d(0, -10px, 0); }
        70%      { opacity:0.6; transform:scale(0.8) translate3d(0, -20px, 0); }
      }
    `;
    document.head.appendChild(st);
  }

  // Generate fixed number of sparkles (reduced on small screens if possible, but 20 is safe if we don't recreate them)
  const isMobile = window.innerWidth < 900;
  const count = isMobile ? 12 : 25;
  for (let i = 0; i < count; i++) createSparkle();
})();

/* ── COUNTDOWN ── */
const weddingDate = new Date('December 27, 2026 10:00:00').getTime();

function updateCountdown() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) {
    cdDays.textContent = '00';
    cdHours.textContent = '00';
    cdMinutes.textContent = '00';
    cdSeconds.textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  cdDays.textContent    = String(days).padStart(2,'0');
  cdHours.textContent   = String(hours).padStart(2,'0');
  cdMinutes.textContent = String(minutes).padStart(2,'0');
  cdSeconds.textContent = String(seconds).padStart(2,'0');
}

if (document.getElementById('cd-days')) {
  setInterval(updateCountdown, 1000);
  updateCountdown();
}

/* ── NAV SCROLL EFFECT ── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ── MOBILE NAV TOGGLE ── */
function toggleNav() {
  const links = document.querySelector('.nav-links');
  links.classList.toggle('open');
}

/* Close mobile nav on link click */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════ */
/*  GOOGLE SHEET GUEST RSVP & LIVE COUNTER    */
/* ══════════════════════════════════════════ */

/**
 * PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
 * Example: "https://script.google.com/macros/s/AKfycbx.../exec"
 * Follow the instructions in google-apps-script.js or GOOGLE_SHEET_SETUP.md.
 * If left empty (""), the form runs in local demo mode and saves to localStorage.
 */
const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7FoIGtCCy3TOfigTdX72xQvF37RLL8UZiK_bkZ7T67-7J4amYZ65lmoqXdiCOr9w/exec";

// Save guest to localStorage fallback
function saveGuestLocally(name) {
  const currentCount = parseInt(localStorage.getItem('wedding_guest_count') || '0', 10);
  const updatedCount = currentCount + 1;
  localStorage.setItem('wedding_guest_count', updatedCount);

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('wedding_guest_list') || '[]');
  } catch (err) {
    list = [];
  }

  const now = new Date();
  const timeStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
                  now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  list.unshift({
    sl: updatedCount,
    name: name,
    time: timeStr
  });

  localStorage.setItem('wedding_guest_list', JSON.stringify(list));
  return updatedCount;
}

// ── Real-Time Luxury Input UX Helpers ──
function handleNameInput(input) {
  const val = input.value.trim();
  const clearBtn = document.getElementById('btn-clear-name');
  const preview = document.getElementById('name-live-preview');
  const previewName = document.getElementById('live-name-display');

  if (clearBtn) {
    clearBtn.classList.toggle('hidden', input.value.length === 0);
  }

  if (preview && previewName) {
    if (val.length > 0) {
      previewName.textContent = val;
      preview.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
    }
  }
}

function clearNameInput() {
  const input = document.getElementById('guest-name');
  if (input) {
    input.value = '';
    handleNameInput(input);
    input.focus();
  }
}

function appendTag(tag) {
  const input = document.getElementById('guest-name');
  if (!input) return;

  const current = input.value.trim();
  if (current) {
    // Avoid duplicate appending
    if (!current.includes(tag.trim())) {
      input.value = current + tag;
    }
  } else {
    input.value = 'Ameer' + tag;
    input.select();
  }
  handleNameInput(input);
  input.focus();
}

// Celebratory Confetti Burst Effect
function fireConfetti() {
  const count = 35;
  const target = document.getElementById('guest-success');
  const rect = target ? target.getBoundingClientRect() : null;
  const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const originY = rect ? rect.top + window.scrollY + 60 : window.scrollY + 350;

  const colors = ['#b8976a', '#d4b483', '#f0e0c0', '#5c3d2e', '#27ae60', '#e8cba8'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 140 + 70;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity - 50;
    const rot = Math.random() * 360;

    el.style.cssText = `
      position: absolute;
      left: ${originX}px;
      top: ${originY}px;
      width: ${size}px;
      height: ${size * (Math.random() > 0.4 ? 1 : 0.6)}px;
      background: ${color};
      border-radius: ${Math.random() > 0.3 ? '50%' : '3px'};
      pointer-events: none;
      z-index: 9999;
      transform: translate3d(0,0,0) rotate(0deg);
      transition: transform 0.95s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.95s ease;
      opacity: 1;
    `;

    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate3d(${destX}px, ${destY}px, 0) rotate(${rot}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 1050);
  }
}

// ── INDEX.HTML: Handle guest name form submission ──
function handleGuestSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('guest-name');
  const btn = document.getElementById('guest-submit');
  const name = nameInput ? nameInput.value.trim() : '';

  if (!name) {
    if (nameInput) {
      shakeElement(nameInput);
      nameInput.focus();
    }
    return;
  }

  const originalBtnHTML = btn.innerHTML;
  btn.innerHTML = '<span>Saving to Guest List… ⏳</span>';
  btn.disabled = true;

  // Always keep local list updated as well
  saveGuestLocally(name);

  // If Google Sheet Web App URL is configured
  if (GOOGLE_SHEET_SCRIPT_URL && GOOGLE_SHEET_SCRIPT_URL.trim() !== "") {
    const url = `${GOOGLE_SHEET_SCRIPT_URL}?name=${encodeURIComponent(name)}&t=${Date.now()}`;

    fetch(url, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && typeof data.count === 'number') {
          localStorage.setItem('wedding_guest_count', data.count);
        }
        showGuestSuccess(name, btn, originalBtnHTML);
      })
      .catch(err => {
        console.warn('Google Sheet submission warning (falling back gracefully):', err);
        showGuestSuccess(name, btn, originalBtnHTML);
      });
  } else {
    // Local / Demo mode when Google Sheet URL is not configured yet
    setTimeout(() => {
      showGuestSuccess(name, btn, originalBtnHTML);
    }, 600);
  }
}

// Show celebratory guest pass on index.html
function showGuestSuccess(name, btn, originalBtnHTML) {
  const formCard = document.getElementById('guest-form-container') || document.getElementById('guest-form');
  const successBox = document.getElementById('guest-success');
  const nameDisplay = document.getElementById('success-guest-name');

  if (nameDisplay) {
    nameDisplay.textContent = name;
  }
  if (formCard) {
    formCard.classList.add('hidden');
  }
  if (successBox) {
    successBox.classList.remove('hidden');
    fireConfetti();
    setTimeout(() => {
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }

  if (btn) {
    btn.innerHTML = originalBtnHTML;
    btn.disabled = false;
  }
}

// Allow user to register another family member or guest
function resetGuestForm() {
  const formCard = document.getElementById('guest-form-container') || document.getElementById('guest-form');
  const successBox = document.getElementById('guest-success');
  const nameInput = document.getElementById('guest-name');

  if (successBox) successBox.classList.add('hidden');
  if (formCard) formCard.classList.remove('hidden');
  if (nameInput) {
    nameInput.value = '';
    handleNameInput(nameInput);
    nameInput.focus();
  }
}

// Backwards compatibility alias
function handleRSVP(e) {
  handleGuestSubmit(e);
}

// ══════════════════════════════════════════
//  GUEST-COUNT.HTML DASHBOARD LOGIC
// ══════════════════════════════════════════
let allGuestsData = [];

function initGuestCountPage() {
  const page = document.getElementById('guest-count-page');
  if (!page) return;

  loadGuestCountData(false);

  // Auto-refresh when tab gains focus
  window.addEventListener('focus', () => {
    loadGuestCountData(false);
  });

  // Background auto-refresh every 20 seconds while page is open
  setInterval(() => {
    loadGuestCountData(false);
  }, 20000);
}

function loadGuestCountData(animate) {
  const totalCountEl = document.getElementById('guest-total-count');
  const statusEl = document.getElementById('guest-sync-status');
  if (!totalCountEl) return;

  if (statusEl) {
    statusEl.textContent = 'Syncing...';
  }

  // If Google Sheet Web App URL is configured, fetch live from Google Sheet with cache-buster
  if (GOOGLE_SHEET_SCRIPT_URL && GOOGLE_SHEET_SCRIPT_URL.trim() !== "") {
    const fetchUrl = `${GOOGLE_SHEET_SCRIPT_URL}?t=${Date.now()}`;
    fetch(fetchUrl, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') {
          const count = typeof data.count === 'number' ? data.count : 0;
          totalCountEl.textContent = count;
          localStorage.setItem('wedding_guest_count', count);
          if (count === 0) {
            localStorage.setItem('wedding_guest_list', '[]');
          }

          if (data.guests && Array.isArray(data.guests)) {
            allGuestsData = data.guests;
          } else {
            allGuestsData = getLocalGuestList();
          }

          renderGuestTable(allGuestsData);
          if (statusEl) statusEl.textContent = 'Live Google Sheet Count';
          if (animate) triggerCountAnimation(totalCountEl);
        } else {
          fallbackToLocalCount(totalCountEl, statusEl, animate);
        }
      })
      .catch(err => {
        console.warn('Could not connect to Google Sheet, falling back to local data:', err);
        fallbackToLocalCount(totalCountEl, statusEl, animate);
      });
  } else {
    // Local / Demo data mode
    fallbackToLocalCount(totalCountEl, statusEl, animate);
  }
}

function fallbackToLocalCount(totalCountEl, statusEl, animate) {
  allGuestsData = getLocalGuestList();
  const count = allGuestsData.length || parseInt(localStorage.getItem('wedding_guest_count') || '0', 10);
  totalCountEl.textContent = count;

  renderGuestTable(allGuestsData);

  if (statusEl) {
    statusEl.textContent = GOOGLE_SHEET_SCRIPT_URL ? 'Cached Data (Offline)' : 'Local Demo Mode';
  }
  if (animate) triggerCountAnimation(totalCountEl);
}

function getLocalGuestList() {
  try {
    return JSON.parse(localStorage.getItem('wedding_guest_list') || '[]');
  } catch (e) {
    return [];
  }
}

function triggerCountAnimation(el) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function renderGuestTable(guests) {
  const tbody = document.getElementById('guests-tbody');
  const emptyState = document.getElementById('guests-empty-state');
  const table = document.getElementById('guests-table');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!guests || guests.length === 0) {
    if (table) table.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (table) table.style.display = 'table';
  if (emptyState) emptyState.style.display = 'none';

  guests.forEach((g, index) => {
    const tr = document.createElement('tr');
    const slNumber = g.sl || (guests.length - index);
    const guestName = escapeHtml(g.name || 'Guest');
    const guestTime = escapeHtml(g.time || '—');

    tr.innerHTML = `
      <td style="text-align: center;"><span class="guest-sl-badge">${slNumber}</span></td>
      <td class="guest-name-cell">${guestName}</td>
      <td class="guest-time-cell">${guestTime}</td>
    `;
    tbody.appendChild(tr);
  });
}

function filterGuestList() {
  const searchInput = document.getElementById('guest-search');
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    renderGuestTable(allGuestsData);
    return;
  }

  const filtered = allGuestsData.filter(g => {
    const name = (g.name || '').toLowerCase();
    return name.includes(query);
  });

  renderGuestTable(filtered);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function shakeElement(el) {
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 600);
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initGuestCountPage();
    initCalendarReminder();
  });
} else {
  initGuestCountPage();
  initCalendarReminder();
}

/* ── PETAL PARTICLES ── */
const PETAL_COLORS = ['#f5e6d3','#e8cba8','#f2dcc8','#deb89a','#f8f0e3'];

function createPetal() {
  const container = document.getElementById('petals');
  if (!container) return;

  const petal = document.createElement('div');
  petal.classList.add('petal');

  const size    = Math.random() * 14 + 6;
  const left    = Math.random() * 100;
  const duration = Math.random() * 10 + 8;
  const delay   = Math.random() * 8;
  const color   = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];

  petal.style.cssText = `
    width: ${size}px;
    height: ${size * 0.7}px;
    left: ${left}%;
    background: ${color};
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: 0;
    box-shadow: inset 0 0 4px rgba(180,130,80,.18);
  `;

  container.appendChild(petal);

  // Remove after animation
  setTimeout(() => {
    petal.remove();
  }, (duration + delay) * 1000 + 500);
}

// Spawn petals periodically (disabled on mobile for peak performance)
function spawnPetals() {
  const container = document.getElementById('petals');
  if (!container || window.innerWidth < 900) return; // Skip if no container or mobile
  createPetal();
  setTimeout(spawnPetals, Math.random() * 2200 + 1000);
}
if (document.getElementById('petals') && window.innerWidth >= 900) {
  spawnPetals();
}

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── GALLERY LIGHTBOX ── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(10,5,2,.92);z-index:9998;
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;animation:fadeIn .3s ease;
    `;
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
      max-width:90vw;max-height:88vh;object-fit:contain;
      border-radius:12px;box-shadow:0 32px 100px rgba(0,0,0,.6);
      animation:scaleIn .3s ease;
    `;
    const closeHint = document.createElement('p');
    closeHint.textContent = '✕ Click anywhere to close';
    closeHint.style.cssText = `
      position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);
      color:rgba(255,255,255,.55);font-family:'Lato',sans-serif;font-size:.82rem;
      letter-spacing:.1em;
    `;
    overlay.appendChild(img);
    overlay.appendChild(closeHint);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());

    // Inject keyframes if not present
    if (!document.getElementById('lb-style')) {
      const style = document.createElement('style');
      style.id = 'lb-style';
      style.textContent = `
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { transform:scale(.88) } to { transform:scale(1) } }
        .shake { animation: shake .5s ease !important; }
        @keyframes shake {
          0%,100% { transform:translateX(0) }
          20%,60%  { transform:translateX(-6px) }
          40%,80%  { transform:translateX(6px) }
        }
      `;
      document.head.appendChild(style);
    }
  });
});

/* ── WEDDING CARD MODAL ── */
function openCardModal() {
  const modal = document.getElementById('card-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCardModal() {
  const modal = document.getElementById('card-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ══════════════════════════════════════════ */
/*  PHONE CALENDAR REMINDER SYSTEM            */
/* ══════════════════════════════════════════ */
function openCalendarModal() {
  const modal = document.getElementById('calendar-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCalendarModal() {
  const modal = document.getElementById('calendar-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Generates and downloads standard .ics calendar file
 * Includes automatic 1-day (-P1D) and 2-hour (-PT2H) phone alarms
 * Supported natively by Apple Calendar (iPhone/Mac) and Samsung/Outlook
 */
function downloadWeddingICS() {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ajmal and Muhsina Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:ajmal-muhsina-wedding-20261227@nikah',
    'DTSTAMP:20260101T000000Z',
    'DTSTART:20261227T043000Z',
    'DTEND:20261227T083000Z',
    'SUMMARY:💍 Nikah Ceremony: Ajmal & Muhsina (11:00 AM)',
    'DESCRIPTION:With the blessings of Allah, you are warmly invited to celebrate the Wedding Program & Nikah Ceremony of Ajmal & Muhsina.\\n\\nProgram: 10:00 AM – 2:00 PM\\nNikah Ceremony: 11:00 AM\\nWalima Feast: 12:00 PM onwards\\n\\nVenue: PCK Auditorium, Irinjalakuda - Kodungallur Rd, Vellangallur, Kerala.\\nGoogle Maps: https://maps.app.goo.gl/QxR1hThK6hF8n8ob9',
    'LOCATION:PCK Auditorium, Irinjalakuda - Kodungallur Rd, Vellangallur, Kerala',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Nikah Ceremony of Ajmal & Muhsina tomorrow!',
    'TRIGGER:-P1D',
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Wedding program starts at 10:00 AM (Nikah at 11:00 AM)!',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = window.URL.createObjectURL(icsBlob);
  const tempLink = document.createElement('a');
  tempLink.href = downloadUrl;
  tempLink.setAttribute('download', 'Ajmal-Muhsina-Wedding-Reminder.ics');
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 2000);
}

/**
 * Direct launch link to Google Calendar (Android / Web)
 */
function openGoogleCalendar() {
  const gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('💍 Nikah Ceremony: Ajmal & Muhsina (11:00 AM)') +
    '&dates=20261227T043000Z/20261227T083000Z' +
    '&details=' + encodeURIComponent('With the blessings of Allah, we would be honoured to have you celebrate with us.\n\nWedding Program: 10:00 AM – 2:00 PM\nNikah Ceremony: 11:00 AM\nWalima Feast: 12:00 PM onwards\n\nVenue: PCK Auditorium, Vellangallur, Kerala.\nMap: https://maps.app.goo.gl/QxR1hThK6hF8n8ob9') +
    '&location=' + encodeURIComponent('PCK Auditorium, Irinjalakuda - Kodungallur Rd, Vellangallur, Kerala');
  window.open(gcalUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Initializes floating reminder toast on page open
 */
function initCalendarReminder() {
  const toast = document.getElementById('calendar-toast');
  if (!toast) return;

  if (sessionStorage.getItem('wedding_reminder_dismissed')) return;

  // Slide up after 2.5s
  setTimeout(() => {
    if (!sessionStorage.getItem('wedding_reminder_dismissed') && toast) {
      toast.classList.remove('hidden');
      // small delay to trigger CSS transition
      setTimeout(() => toast.classList.add('visible'), 50);
    }
  }, 2500);
}

function dismissCalendarToast(userInitiated) {
  const toast = document.getElementById('calendar-toast');
  if (toast) {
    toast.classList.remove('visible');
    setTimeout(() => toast.classList.add('hidden'), 400);
  }
  if (userInitiated) {
    sessionStorage.setItem('wedding_reminder_dismissed', 'true');
  }
}

// Close modals when pressing Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCardModal();
    closeCalendarModal();
  }
});
