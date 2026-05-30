/* =====================================================
   LJ Interior Design — JavaScript v2
   Three.js hero · VanillaTilt · Slider · Form
   ===================================================== */

/* ── Navbar ──────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  backToTop.classList.toggle('visible', y > 500);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Mobile nav ──────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('active');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Smooth scroll ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Three.js Hero — Luxury Bokeh Background ────── */
(function initHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* Keep the SVG logo visible — Three.js is backdrop only */
  const htmlLogo = document.querySelector('.hero-logo-big');
  if (htmlLogo) htmlLogo.style.opacity = '1';

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 24);

  /* ── Soft bokeh light orbs — like out-of-focus studio lights ── */
  const palettes = [
    { color: 0xd4a84b, opacity: 0.055 },
    { color: 0xf5e8c8, opacity: 0.04  },
    { color: 0xc9a84c, opacity: 0.065 },
    { color: 0xfff3dc, opacity: 0.035 },
    { color: 0xC4562A, opacity: 0.03  },
    { color: 0xe8d5a3, opacity: 0.05  },
    { color: 0xb89040, opacity: 0.07  },
    { color: 0xf0e4c0, opacity: 0.04  },
  ];

  const bokeh = Array.from({ length: 20 }, (_, i) => {
    const p = palettes[i % palettes.length];
    const r = 1.8 + Math.random() * 4.5;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 10, 10),
      new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: p.opacity + Math.random() * 0.025 })
    );
    mesh.position.set(
      (Math.random() - 0.5) * 44,
      (Math.random() - 0.5) * 28,
      -4 - Math.random() * 16
    );
    mesh.userData = {
      vx: (Math.random() - 0.5) * 0.006,
      vy: (Math.random() - 0.5) * 0.005,
      ps: 0.15 + Math.random() * 0.25,
      pp: Math.random() * Math.PI * 2,
      base: p.opacity + Math.random() * 0.025,
    };
    scene.add(mesh);
    return mesh;
  });

  /* ── Fine gold dust — tiny barely-visible points ── */
  const pCount = 160;
  const pPos   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 55;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
    pPos[i * 3 + 2] = -10 - Math.random() * 14;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xe8d5a3, size: 0.07, transparent: true, opacity: 0.35, sizeAttenuation: true,
  })));

  /* Mouse parallax */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;

    bokeh.forEach(b => {
      b.position.x += b.userData.vx;
      b.position.y += b.userData.vy;
      b.material.opacity = b.userData.base + Math.sin(t * b.userData.ps + b.userData.pp) * 0.018;
      if (b.position.x >  24) b.position.x = -24;
      if (b.position.x < -24) b.position.x =  24;
      if (b.position.y >  16) b.position.y = -16;
      if (b.position.y < -16) b.position.y =  16;
    });

    camera.position.x += (mx * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (-my * 1   - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ── Scroll reveal ───────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up,.reveal-fade,.reveal-left,.reveal-right');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── Counter animation ───────────────────────────── */
document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.unobserve(el);
    const target = parseInt(el.dataset.target, 10);
    const step   = target / (1800 / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) { el.textContent = target; clearInterval(timer); }
    }, 16);
  }, { threshold: 0.5 });
  obs.observe(el);
});

/* ── VanillaTilt on portfolio cards ──────────────── */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
    max:           8,
    speed:         400,
    glare:         true,
    'max-glare':   0.12,
    perspective:   1000,
    scale:         1.02,
    gyroscope:     true,
  });
}

/* ── Portfolio filter ────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.94)';
        setTimeout(() => card.classList.add('hidden'), 350);
      }
    });
  });
});
document.querySelectorAll('.portfolio-card').forEach(c => {
  c.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
});

/* ── Testimonials slider ─────────────────────────── */
const track    = document.getElementById('testimonialsTrack');
const dotsWrap = document.getElementById('sliderDots');
const slides   = track ? track.querySelectorAll('.testimonial-card') : [];
let current = 0, autoTimer = null;

if (slides.length && track) {
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    resetAuto();
  }

  document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  }, { passive: true });

  function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 5200); }
  resetAuto();
}

/* ── Contact form ────────────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function setError(id, errId, msg) {
  const inp = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!inp || !err) return !msg;
  err.textContent = msg;
  inp.style.borderColor = msg ? '#e05c4a' : '';
  return !msg;
}

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let ok = true;
    ok = setError('name',    'nameError',    name    ? '' : 'Please enter your name.')    && ok;
    ok = setError('email',   'emailError',   !email  ? 'Please enter your email.' : !validateEmail(email) ? 'Please enter a valid email.' : '') && ok;
    ok = setError('message', 'messageError', message ? '' : 'Please enter your message.') && ok;
    if (!ok) return;

    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.hidden = true; btnLoading.hidden = false; submitBtn.disabled = true;
    await new Promise(r => setTimeout(r, 1500));
    form.reset();
    formSuccess.hidden  = false;
    btnText.hidden      = false; btnLoading.hidden = true; submitBtn.disabled = false;
    setTimeout(() => { formSuccess.hidden = true; }, 6000);
  });
  ['name','email','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => setError(id, `${id}Error`, ''));
  });
}

/* ── Active nav highlight on scroll ─────────────── */
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
      const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (a) a.style.color = 'var(--gold)';
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));
