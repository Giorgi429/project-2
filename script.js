/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
const TOTAL = 5;
let current = 1;
let animating = false;

/* ══════════════════════════════════════════
   PARTICLES CANVAS
══════════════════════════════════════════ */
(function () {
  const cv = document.getElementById('particles');
  const cx = cv.getContext('2d');
  let W, H;

  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  resize();
  addEventListener('resize', resize);

  const SYMBOLS = ['❤', '✦', '✨', '·', '·', '·', '·'];
  const pts = Array.from({ length: 90 }, () => mkPt());

  function mkPt() {
    return {
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.6 + .3,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      a: Math.random(),
      va: (Math.random() - .5) * .008,
      sym: Math.random() > .8 ? '❤' : null,
      size: Math.random() * 1 + .6,
    };
  }

  (function loop() {
    cx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.a += p.va;
      if (p.a < 0 || p.a > 1) p.va *= -1;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      if (p.sym) {
        cx.globalAlpha = p.a * .35;
        cx.font = `${p.size * 10}px serif`;
        cx.fillStyle = 'rgba(255,120,150,1)';
        cx.fillText(p.sym, p.x, p.y);
      } else {
        cx.globalAlpha = p.a * .5;
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = '#fff';
        cx.fill();
      }
      cx.globalAlpha = 1;
    });
    requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════════
   BUILD DOTS
══════════════════════════════════════════ */
const dotsEl = document.getElementById('dots');
for (let i = 1; i <= TOTAL; i++) {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 1 ? ' active' : '');
  d.onclick = () => goTo(i);
  dotsEl.appendChild(d);
}

function updateUI() {
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i + 1 === current));
  document.getElementById('counter').textContent = current + ' / ' + TOTAL;
  document.getElementById('arrowLeft').classList.toggle('show', current > 1);
  document.getElementById('arrowRight').classList.toggle('show', current < TOTAL);
}

/* ══════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════ */
function goTo(n) {
  if (animating || n === current || n < 1 || n > TOTAL) return;
  animating = true;
  if (current === 5) resetNoButton();

  const dir = n > current ? 1 : -1;
  const oldEl = document.querySelector('.slide.active');
  const newEl = document.querySelector('.slide:nth-child(' + n + ')');

  oldEl.classList.remove('active');
  oldEl.classList.add(dir > 0 ? 'exit-left' : 'exit-right');

  setTimeout(() => {
    oldEl.classList.remove('exit-left', 'exit-right');
    newEl.style.transform = dir > 0 ? 'translateX(60px)' : 'translateX(-60px)';
    newEl.classList.add('active');
    requestAnimationFrame(() => {
      newEl.style.transform = '';
    });
    current = n;
    updateUI();
    onEnter(n);
    setTimeout(() => animating = false, 600);
  }, 300);
}

function changeSlide(dir) { goTo(current + dir); }

/* ══════════════════════════════════════════
   PAGE ENTER HOOKS
══════════════════════════════════════════ */
function onEnter(n) {
  if (n === 5) initNoButton();
}

/* ══════════════════════════════════════════
   SLIDE 5 — ESCAPING "NO" BUTTON
══════════════════════════════════════════ */
const NO_MSGS = [
  'უუ, ჩქარა! 😂',
  'ეჰ, ვერ გამოგივა 😄',
  'ისევ სცდი?! 🏃',
  'კარგი მსახიობი ხარ 💨',
  'უუ, კიდევ?! 😆',
  'ბოლო შანსია... 🤭',
  '...გაიქცა! 😂',
];

let noCount = 0;
let noFixed = false;

function initNoButton() {
  const btn = document.getElementById('btnNo');
  btn.style.cssText = '';
  btn.style.display = '';
  noCount = 0;
  noFixed = false;
  document.getElementById('funMsg').textContent = '';
}

function resetNoButton() {
  const btn = document.getElementById('btnNo');
  if (btn) { btn.style.cssText = ''; btn.style.display = ''; }
  noCount = 0;
  noFixed = false;
}

function noEscape(e) {
  if (e) e.preventDefault();
  if (noCount >= 7) return;

  const btn = document.getElementById('btnNo');
  const msg = document.getElementById('funMsg');

  if (!noFixed) {
    const r = btn.getBoundingClientRect();
    btn.style.position = 'fixed';
    btn.style.margin  = '0';
    btn.style.zIndex  = '999';
    btn.style.left    = r.left + 'px';
    btn.style.top     = r.top  + 'px';
    noFixed = true;
  }

  noCount++;
  msg.textContent = NO_MSGS[noCount - 1];

  if (noCount >= 7) {
    btn.style.transition = 'opacity .35s, transform .35s';
    btn.style.opacity    = '0';
    btn.style.transform  = 'scale(0) rotate(180deg)';
    setTimeout(() => {
      btn.style.display = 'none';
      msg.textContent   = 'ღილაკი გაქრა! 😂 სხვა გამოსავალი არ გაქვს 💖';
    }, 370);
    return;
  }

  const bw  = btn.offsetWidth  + 16;
  const bh  = btn.offsetHeight + 16;
  const pad = 24;
  const x   = pad + Math.random() * (window.innerWidth  - bw - pad * 2);
  const y   = pad + Math.random() * (window.innerHeight - bh - pad * 2);
  btn.style.left = x + 'px';
  btn.style.top  = y + 'px';
}

function yesClick() {
  document.getElementById('funMsg').textContent = '💖 ვიცოდი! გიყვარვარ!';
  spawnHearts();
}

/* ══════════════════════════════════════════
   FLOATING HEARTS (click effect)
══════════════════════════════════════════ */
function spawnHearts() {
  const emojis = ['❤️', '💖', '🌹', '✨', '💫'];
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position:fixed;z-index:999;pointer-events:none;user-select:none;
        left:${20 + Math.random() * 60}vw;
        top:${30 + Math.random() * 40}vh;
        font-size:${1.5 + Math.random() * 1.5}rem;
      `;
      document.body.appendChild(el);
      el.animate([
        { transform: 'translateY(0) scale(0)', opacity: 0 },
        { transform: `translateY(-${80 + Math.random() * 80}px) scale(1.2)`, opacity: 1, offset: .3 },
        { transform: `translateY(-${160 + Math.random() * 80}px) scale(.8)`, opacity: 0 },
      ], { duration: 1400 + Math.random() * 600, easing: 'ease-out' }).onfinish = () => el.remove();
    }, i * 100);
  }
}

document.addEventListener('click', e => {
  if (e.target.closest('button') || e.target.closest('.dot') || e.target.closest('.arrow')) return;
  const el = document.createElement('div');
  const emojis = ['❤️', '💕', '✨', '🌸', '💖'];
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.cssText = `
    position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    font-size:1.4rem;pointer-events:none;z-index:999;user-select:none;
    transform:translate(-50%,-50%);
  `;
  document.body.appendChild(el);
  el.animate([
    { transform: 'translate(-50%,-50%) scale(0)', opacity: 0 },
    { transform: `translate(${(Math.random() - .5) * 60 - 50}%,${-80 - Math.random() * 40}px) scale(1.1)`, opacity: 1, offset: .35 },
    { transform: `translate(${(Math.random() - .5) * 80 - 50}%,${-140 - Math.random() * 60}px) scale(.7)`, opacity: 0 },
  ], { duration: 1100 + Math.random() * 500, easing: 'ease-out' }).onfinish = () => el.remove();
});

/* ══════════════════════════════════════════
   KEYBOARD & SWIPE
══════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') changeSlide(1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   changeSlide(-1);
});

let touchX = 0;
document.addEventListener('touchstart', e => touchX = e.touches[0].clientX, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) changeSlide(dx < 0 ? 1 : -1);
}, { passive: true });

/* ══════════════════════════════════════════
   COVER HEART CLICK
══════════════════════════════════════════ */
document.getElementById('coverHeart').addEventListener('click', () => spawnHearts());

/* ══════════════════════════════════════════
   NO BUTTON — EVENT LISTENERS
══════════════════════════════════════════ */
(function () {
  const btn = document.getElementById('btnNo');
  btn.addEventListener('mouseenter', noEscape);
  btn.addEventListener('touchstart', noEscape, { passive: false });
})();

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
updateUI();
