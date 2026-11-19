const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, reduced ? 0 : ms));

/* ---------- Starfield + shooting stars ---------- */
(function () {
  const c = document.getElementById('stars'), x = c.getContext('2d');
  const colors = ['#ffffff', '#a5b4fc', '#67e8f9', '#c4b5fd'];
  let stars = [], shots = [];

  function resize() { c.width = innerWidth; c.height = innerHeight; }
  resize(); addEventListener('resize', resize);

  for (let i = 0; i < 120; i++) {
    stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + 0.3,
                 p: Math.random() * 6, v: Math.random() * 0.00002 + 0.000005, c: colors[i % 4] });
  }

  function spawnShot() {
    shots.push({ x: Math.random() * c.width * 0.8, y: Math.random() * c.height * 0.4, l: 0, life: 40 });
  }
  if (!reduced) setInterval(() => Math.random() < 0.6 && spawnShot(), 3500);

  function draw(t) {
    x.clearRect(0, 0, c.width, c.height);
    for (const s of stars) {
      if (!reduced) { s.y += s.v; if (s.y > 1) s.y = 0; }
      x.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t / 1500 + s.p));
      x.fillStyle = s.c;
      x.beginPath(); x.arc(s.x * c.width, s.y * c.height, s.r, 0, 7); x.fill();
    }
    for (const m of shots) {
      m.x += 9; m.y += 5; m.l++;
      const a = 1 - m.l / m.life;
      const g = x.createLinearGradient(m.x, m.y, m.x - 90, m.y - 50);
      g.addColorStop(0, `rgba(103,232,249,${a})`); g.addColorStop(1, 'rgba(103,232,249,0)');
      x.globalAlpha = 1; x.strokeStyle = g; x.lineWidth = 2;
      x.beginPath(); x.moveTo(m.x, m.y); x.lineTo(m.x - 90, m.y - 50); x.stroke();
    }
    shots = shots.filter(m => m.l < m.life);
    x.globalAlpha = 1;
    if (!reduced) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ---------- Terminal tabs with typing animation ---------- */
const content = {
  term: {
    sub: '>_ bash – interactive shell session',
    lines: [
      { t: '$ python vinoth.py --status' },
      { t: '[OK] Python backend initialized', c: 'ok' },
      { t: '[OK] Full stack system active', c: 'ok' },
      { t: '[OK] SQL database connected', c: 'ok' },
      { t: '✦ System ready for high-scale applications.', c: 'hl' },
      { t: 'vinoth@portfolio:~$ ', c: 'dim', cursor: true }
    ]
  },
  cfg: {
    sub: 'developer.config.py',
    lines: [
      { t: 'developer = {' },
      { t: '    "name": "Vinoth",', c: 'str' },
      { t: '    "role": "Python Full Stack Developer",', c: 'str' },
      { t: '    "stack": ["Python", "SQL", "HTML", "CSS"],', c: 'str' },
      { t: '    "available": True' },
      { t: '}', cursor: true }
    ]
  },
  skills: {
    sub: 'skills.json',
    lines: [
      { t: '{' },
      { t: '  "backend":  ["Python"],', c: 'str' },
      { t: '  "database": ["SQL"],', c: 'str' },
      { t: '  "frontend": ["HTML", "CSS"]', c: 'str' },
      { t: '}', cursor: true }
    ]
  }
};

const pane = document.getElementById('pane');
let run = 0;

async function typeInto(el, text, id) {
  for (const ch of text) {
    if (id !== run) return false;
    el.textContent += ch;
    await sleep(28);
  }
  return true;
}

async function show(key) {
  const id = ++run;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.t === key));
  const data = content[key];
  pane.innerHTML = '';
  const sub = document.createElement('div'); sub.className = 'sub'; sub.textContent = data.sub;
  const box = document.createElement('div'); box.className = 'box';
  pane.append(sub, box);

  for (let i = 0; i < data.lines.length; i++) {
    if (id !== run) return;
    const l = data.lines[i];
    const el = document.createElement('div');
    el.className = 'ln' + (l.c ? ' ' + l.c : '');
    box.appendChild(el);
    if (i === 0) { if (!(await typeInto(el, l.t, id))) return; await sleep(300); }
    else { el.textContent = l.t; await sleep(320); }
    if (l.cursor) { const cur = document.createElement('span'); cur.className = 'cur'; el.appendChild(cur); }
  }
}

document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => show(b.dataset.t)));
setTimeout(() => show('term'), reduced ? 0 : 900);

/* ---------- Count-up numbers ---------- */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count;
  if (reduced) { el.textContent = target; return; }
  let n = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      el.textContent = ++n;
      if (n >= target) clearInterval(iv);
    }, 250);
  }, 1500);
});

/* ---------- 3D tilt on the terminal card ---------- */
(function () {
  const wrap = document.getElementById('tilt');
  const card = wrap.querySelector('.term');
  if (reduced || matchMedia('(hover: none)').matches) return;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
  });
  wrap.addEventListener('mouseleave', () => { card.style.transform = ''; });
})();

/* ================= Added sections ================= */

/* Mobile menu */
(function () {
  const btn = document.getElementById('menu'), nav = document.querySelector('nav');
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
  }));
})();

/* Scroll reveal + skill bars + percentage count-up */
(function () {
  function countPct(el) {
    const target = +el.dataset.pct;
    if (reduced) { el.textContent = target + '%'; return; }
    let n = 0;
    const iv = setInterval(() => {
      n += 2; if (n >= target) { n = target; clearInterval(iv); }
      el.textContent = n + '%';
    }, 22);
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      const fill = e.target.querySelector('.fill');
      if (fill) fill.style.width = fill.dataset.w + '%';
      const pct = e.target.querySelector('[data-pct]');
      if (pct) countPct(pct);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.sr').forEach(el => io.observe(el));
})();

/* Highlight the nav link of the section in view */
(function () {
  const links = [...document.querySelectorAll('nav a')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const a = map.get(e.target.id); if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
})();

/* Contact form: opens the visitor's email app with the message filled in.
   Change the address below to your own. For a real backend, replace this with a fetch() to Formspree, EmailJS or your Python API. */
(function () {
  const TO = 'you@example.com';
  const form = document.getElementById('form'), note = document.getElementById('note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const subject = encodeURIComponent('Portfolio message from ' + d.get('name'));
    const body = encodeURIComponent(d.get('msg') + '\n\n' + d.get('name') + ' (' + d.get('email') + ')');
    location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    note.textContent = 'Opening your email app…';
    form.reset();
  });
})();

document.getElementById('yr').textContent = new Date().getFullYear();

/* ================= Experience animations ================= */
(function () {
  const tl = document.querySelector('.timeline');
  if (!tl) return;
  const jobs = [...tl.querySelectorAll('.job')];

  // Glowing dot that travels down the line
  const runner = document.createElement('span');
  runner.className = 'runner';
  runner.setAttribute('aria-hidden', 'true');
  tl.appendChild(runner);

  // Draw the base line when the timeline enters view
  new IntersectionObserver((entries, o) => {
    entries.forEach(e => { if (e.isIntersecting) { tl.classList.add('in'); o.disconnect(); } });
  }, { threshold: 0.1 }).observe(tl);

  function update() {
    if (reduced) {
      tl.style.setProperty('--p', 1);
      jobs.forEach(j => j.classList.add('active'));
      return;
    }
    const vh = innerHeight, mark = vh * 0.6;
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
    tl.style.setProperty('--p', p.toFixed(4));
    jobs.forEach(j => {
      const n = j.querySelector('.node').getBoundingClientRect();
      j.classList.toggle('active', n.top < mark);
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
})();


// =====================================
// PREMIUM SKILLS PROGRESS ANIMATION
// =====================================

const skillSection = document.querySelector("#skills");

const skillObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const progressBars = entry.target.querySelectorAll(
                ".skill-progress"
            );

            progressBars.forEach((bar, index) => {

                const width = bar.getAttribute("data-width");

                setTimeout(() => {
                    bar.style.width = width;
                }, index * 120);

            });

            observer.unobserve(entry.target);
        }

    });

}, {
    threshold: 0.25
});

if (skillSection) {
    skillObserver.observe(skillSection);
}


// SKILLS PROGRESS BAR ANIMATION
document.querySelectorAll(".skill-progress").forEach((bar) => {
    const targetWidth = bar.getAttribute("data-width");

    bar.style.width = targetWidth;
});
