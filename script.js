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
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent    = '00';
    document.getElementById('cd-hours').textContent   = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent    = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent   = String(hours).padStart(2,'0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2,'0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ── NAV SCROLL EFFECT ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

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

/* ── RSVP FORM ── */
function handleRSVP(e) {
  e.preventDefault();

  const name    = document.getElementById('rsvp-name').value.trim();
  const email   = document.getElementById('rsvp-email').value.trim();
  const btn     = document.getElementById('rsvp-submit');

  if (!name || !email) {
    shakeElement(btn);
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Simulate async send
  setTimeout(() => {
    document.getElementById('rsvp-form').classList.add('hidden');
    document.getElementById('rsvp-success').classList.remove('hidden');
  }, 1200);
}

function shakeElement(el) {
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 600);
}

/* ── PETAL PARTICLES ── */
const PETAL_COLORS = ['#f5e6d3','#e8cba8','#f2dcc8','#deb89a','#f8f0e3'];

function createPetal() {
  const container = document.getElementById('petals');
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
  if (window.innerWidth < 900) return; // Skip dynamic petal creation on mobile
  createPetal();
  setTimeout(spawnPetals, Math.random() * 2200 + 1000);
}
if (window.innerWidth >= 900) {
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

// Close modal when clicking outside or pressing Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCardModal();
});
