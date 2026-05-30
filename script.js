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

/* ── Three.js 3D Hero — Refined LJ Monogram ─────── */
(function initHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const htmlLogo = document.querySelector('.hero-logo-big');
  if (htmlLogo) htmlLogo.style.opacity = '0';

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 28);

  /* Lights — warm luxury */
  scene.add(new THREE.AmbientLight(0x110d08, 1.2));
  const keyLight = new THREE.DirectionalLight(0xfff4e0, 3.2);
  keyLight.position.set(6, 14, 12);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xc8d8e8, 0.8);
  fillLight.position.set(-10, -4, 8);
  scene.add(fillLight);
  const goldLight = new THREE.PointLight(0xc9a84c, 4, 50);
  goldLight.position.set(0, 4, 12);
  scene.add(goldLight);
  const rustLight = new THREE.PointLight(0xC4562A, 3, 40);
  rustLight.position.set(-10, -5, 5);
  scene.add(rustLight);
  const steelLight = new THREE.PointLight(0x9bb8cc, 2.5, 40);
  steelLight.position.set(10, 3, 5);
  scene.add(steelLight);

  /* ── Extruded letters (scaled to feel balanced) ── */
  const ext = { depth: 3.5, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.28, bevelSegments: 8 };

  /* L — rust metallic */
  const lShape = new THREE.Shape();
  lShape.moveTo(-7, -6);
  lShape.lineTo(-7,  7.5);
  lShape.lineTo(-5,  7.5);
  lShape.lineTo(-5, -3.8);
  lShape.lineTo( 0.5, -3.8);
  lShape.lineTo( 0.5, -6);
  lShape.closePath();

  const lMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(lShape, ext),
    new THREE.MeshStandardMaterial({ color: 0xC4562A, roughness: 0.08, metalness: 0.92, emissive: 0xC4562A, emissiveIntensity: 0.12 })
  );
  lMesh.position.z = -1.5;

  /* J — steel-blue metallic with curved hook */
  const jShape = new THREE.Shape();
  jShape.moveTo( 0.5, -2.8);
  jShape.lineTo( 0.5,  7.5);
  jShape.lineTo( 2.8,  7.5);
  jShape.lineTo( 2.8, -5.2);
  jShape.bezierCurveTo( 2.8, -9.2, -2.5, -9.2, -3.8, -5.4);
  jShape.lineTo(-2.2, -3.8);
  jShape.bezierCurveTo(-1.2, -5.5, 0.5, -5.5, 0.5, -2.8);
  jShape.closePath();

  const jMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(jShape, ext),
    new THREE.MeshStandardMaterial({ color: 0x7B9BB5, roughness: 0.08, metalness: 0.92, emissive: 0x7B9BB5, emissiveIntensity: 0.1 })
  );
  jMesh.position.z = 1.5;

  const logoGroup = new THREE.Group();
  logoGroup.add(lMesh);
  logoGroup.add(jMesh);
  logoGroup.position.set(0, 1.5, 0);
  scene.add(logoGroup);

  /* ── Elegant gold halo ring close around logo ── */
  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(7, 0.04, 8, 120),
    new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.1, metalness: 1, emissive: 0xc9a84c, emissiveIntensity: 0.35 })
  );
  haloRing.position.set(0, 1.5, 0);
  scene.add(haloRing);

  /* Slow outer orbit ring — very thin, steel */
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(11, 0.025, 6, 120),
    new THREE.MeshBasicMaterial({ color: 0x7B9BB5, transparent: true, opacity: 0.2 })
  );
  outerRing.rotation.x = 1.1;
  outerRing.rotation.y = 0.4;
  outerRing.position.set(0, 1.5, 0);
  scene.add(outerRing);

  /* ── 4 accent diamond gems at cardinal points ── */
  const gemAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  const gems = gemAngles.map((angle, i) => {
    const colors = [0xc9a84c, 0xC4562A, 0xc9a84c, 0x7B9BB5];
    const mesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22, 0),
      new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0, metalness: 1, emissive: colors[i], emissiveIntensity: 0.5 })
    );
    mesh.position.set(Math.cos(angle) * 7, 1.5 + Math.sin(angle) * 7, 0);
    mesh.userData.angle = angle;
    scene.add(mesh);
    return mesh;
  });

  /* ── Scattered background star-dust particles ── */
  const pCount = 220;
  const pPos   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 14 + Math.random() * 28;
    pPos[i * 3]     = Math.cos(theta) * r;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 36;
    pPos[i * 3 + 2] = -6 - Math.random() * 20;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo,
    new THREE.PointsMaterial({ color: 0xe8d5a3, size: 0.13, transparent: true, opacity: 0.55, sizeAttenuation: true })
  );
  scene.add(particles);

  /* ── Single expanding pulse ring ── */
  const pulseRing = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.035, 6, 80),
    new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0 })
  );
  pulseRing.position.set(0, 1.5, 0);
  scene.add(pulseRing);

  /* Mouse parallax */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.007;

    /* Logo gentle float + subtle sway */
    logoGroup.position.y = 1.5 + Math.sin(t * 0.55) * 0.45;
    logoGroup.rotation.y = Math.sin(t * 0.32) * 0.06;
    logoGroup.rotation.x = Math.sin(t * 0.22) * 0.03;

    /* Halo ring slow rotation */
    haloRing.rotation.z += 0.0018;
    haloRing.position.y = logoGroup.position.y;
    outerRing.rotation.y += 0.0012;
    outerRing.rotation.z -= 0.0008;
    outerRing.position.y = logoGroup.position.y;

    /* Accent gems orbit the halo */
    gems.forEach((g, i) => {
      const angle = gemAngles[i] + t * 0.28;
      g.position.x = Math.cos(angle) * 7;
      g.position.y = logoGroup.position.y + Math.sin(angle) * 7;
      g.rotation.x += 0.02;
      g.rotation.y += 0.015;
    });

    /* Particles slow drift */
    particles.rotation.y += 0.0005;
    particles.rotation.z += 0.0002;

    /* Pulse ring */
    const phase = (t * 0.4) % 3.5;
    pulseRing.scale.set(1 + phase * 9, 1 + phase * 9, 1);
    pulseRing.material.opacity = Math.max(0, 0.22 - phase * 0.065);
    pulseRing.position.y = logoGroup.position.y;

    /* Dynamic lights */
    goldLight.position.x  = Math.sin(t * 0.4) * 9;
    goldLight.position.y  = Math.cos(t * 0.3) * 6 + 4;
    rustLight.position.x  = Math.cos(t * 0.35) * -10;
    rustLight.position.y  = Math.sin(t * 0.28) * 6;

    /* Mouse parallax */
    camera.position.x += (mouseX * 3   - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 2  - camera.position.y) * 0.04;
    logoGroup.position.x = mouseX * -1;
    camera.lookAt(0, 1.5, 0);

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
