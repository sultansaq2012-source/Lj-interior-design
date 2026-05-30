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

/* ── Three.js 3D Hero ────────────────────────────── */
(function initHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 30);

  /* Ambient warm glow */
  scene.add(new THREE.AmbientLight(0x1a1208, 1));
  const pointA = new THREE.PointLight(0xc9a84c, 2.5, 80);
  pointA.position.set(10, 15, 10);
  scene.add(pointA);
  const pointB = new THREE.PointLight(0xC4562A, 1.5, 60);
  pointB.position.set(-15, -10, 5);
  scene.add(pointB);
  const pointC = new THREE.PointLight(0x7B9BB5, 1.2, 60);
  pointC.position.set(20, -5, -5);
  scene.add(pointC);

  /* Floating orbs — mix of gold, rust, and steel */
  const orbColors = [0xc9a84c, 0xC4562A, 0x7B9BB5, 0xe8d5a3, 0x9a7c2e];
  const orbs = [];
  for (let i = 0; i < 55; i++) {
    const r    = Math.random() * 0.55 + 0.1;
    const geo  = new THREE.SphereGeometry(r, 12, 12);
    const col  = orbColors[Math.floor(Math.random() * orbColors.length)];
    const mat  = new THREE.MeshStandardMaterial({
      color: col,
      roughness: 0.3,
      metalness: 0.8,
      emissive: col,
      emissiveIntensity: Math.random() * 0.25 + 0.05,
      transparent: true,
      opacity: Math.random() * 0.5 + 0.25,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const spread = 45;
    mesh.position.set(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * 20 - 5
    );
    mesh.userData = {
      speedX: (Math.random() - 0.5) * 0.003,
      speedY: (Math.random() - 0.5) * 0.003,
      speedZ: (Math.random() - 0.5) * 0.002,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      amp:    Math.random() * 2 + 0.5,
    };
    scene.add(mesh);
    orbs.push(mesh);
  }

  /* Thin floating rings */
  const ringGeo  = new THREE.TorusGeometry(3, 0.02, 8, 60);
  const ringMat  = new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.2, metalness: 1, transparent: true, opacity: 0.15 });
  const ring1    = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = 0.5; ring1.position.set(-8, 4, -8);
  scene.add(ring1);
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.015, 8, 60),
    new THREE.MeshStandardMaterial({ color: 0x7B9BB5, roughness: 0.2, metalness: 1, transparent: true, opacity: 0.1 })
  );
  ring2.rotation.y = 0.8; ring2.position.set(10, -6, -12);
  scene.add(ring2);

  /* Mouse parallax */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    orbs.forEach(o => {
      const d = o.userData;
      o.position.x += Math.sin(t * 0.4 + d.phaseX) * d.amp * 0.003;
      o.position.y += Math.cos(t * 0.3 + d.phaseY) * d.amp * 0.003;
      o.position.z += Math.sin(t * 0.2 + d.phaseX + d.phaseY) * 0.002;
      /* Wrap */
      if (o.position.x >  24) o.position.x = -24;
      if (o.position.x < -24) o.position.x =  24;
      if (o.position.y >  24) o.position.y = -24;
      if (o.position.y < -24) o.position.y =  24;
    });

    ring1.rotation.y += 0.002;
    ring2.rotation.x += 0.0015;
    ring2.rotation.z += 0.001;

    pointA.position.x = Math.sin(t * 0.3) * 15;
    pointA.position.y = Math.cos(t * 0.2) * 12;
    pointB.position.x = Math.cos(t * 0.25) * -18;
    pointB.position.y = Math.sin(t * 0.18) * 10;

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

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
