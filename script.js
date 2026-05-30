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

/* ── Three.js 3D Hero — Extruded LJ Logo ─────────── */
(function initHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* Hide the flat SVG logo — 3D version takes over */
  const htmlLogo = document.querySelector('.hero-logo-big');
  if (htmlLogo) htmlLogo.style.opacity = '0';

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 38);

  /* Lights */
  scene.add(new THREE.AmbientLight(0x1a1208, 0.7));
  const keyLight = new THREE.DirectionalLight(0xfff8e8, 2.5);
  keyLight.position.set(8, 18, 14);
  scene.add(keyLight);
  const goldLight = new THREE.PointLight(0xc9a84c, 3.5, 70);
  goldLight.position.set(0, 6, 16);
  scene.add(goldLight);
  const rustLight = new THREE.PointLight(0xC4562A, 2.5, 55);
  rustLight.position.set(-16, -8, 6);
  scene.add(rustLight);
  const steelLight = new THREE.PointLight(0x7B9BB5, 2, 55);
  steelLight.position.set(16, -4, 4);
  scene.add(steelLight);

  /* ── 3D Extruded LJ Letters ── */
  const extrudeSettings = {
    depth: 6,
    bevelEnabled: true,
    bevelThickness: 0.9,
    bevelSize: 0.45,
    bevelSegments: 5,
  };

  /* L shape — rust/orange */
  const lShape = new THREE.Shape();
  lShape.moveTo(-13, -11);
  lShape.lineTo(-13,  14);
  lShape.lineTo( -9,  14);
  lShape.lineTo( -9,  -7);
  lShape.lineTo(  1,  -7);
  lShape.lineTo(  1, -11);
  lShape.closePath();

  const lMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(lShape, extrudeSettings),
    new THREE.MeshStandardMaterial({
      color: 0xC4562A, roughness: 0.05, metalness: 0.95,
      emissive: 0xC4562A, emissiveIntensity: 0.18,
    })
  );
  lMesh.position.z = -2.5;

  /* J shape — steel blue, overlapping the L's top */
  const jShape = new THREE.Shape();
  /* vertical bar */
  jShape.moveTo( 1,  -5);
  jShape.lineTo( 1,  14);
  jShape.lineTo( 5,  14);
  jShape.lineTo( 5,  -9);
  /* hook curves left */
  jShape.bezierCurveTo( 5, -16, -4, -16, -6,  -9);
  jShape.lineTo(-4,  -6);
  jShape.bezierCurveTo(-2,  -9,  1, -9,  1,  -5);
  jShape.closePath();

  const jMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(jShape, extrudeSettings),
    new THREE.MeshStandardMaterial({
      color: 0x7B9BB5, roughness: 0.05, metalness: 0.95,
      emissive: 0x7B9BB5, emissiveIntensity: 0.12,
    })
  );
  jMesh.position.z = 2.5;

  /* Group */
  const logoGroup = new THREE.Group();
  logoGroup.add(lMesh);
  logoGroup.add(jMesh);
  logoGroup.position.y = 4;
  scene.add(logoGroup);

  /* ── Orbiting rings ── */
  const ringData = [
    { r: 10, tube: 0.05, col: 0xc9a84c, opacity: 0.18, rx: 0.4, ry: 0.3 },
    { r: 15, tube: 0.04, col: 0xC4562A, opacity: 0.12, rx: 1.1, ry: 0.8 },
    { r: 20, tube: 0.03, col: 0x7B9BB5, opacity: 0.08, rx: 0.6, ry: 1.4 },
  ];
  const rings = ringData.map(d => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(d.r, d.tube, 6, 100),
      new THREE.MeshBasicMaterial({ color: d.col, transparent: true, opacity: d.opacity })
    );
    mesh.rotation.x = d.rx;
    mesh.rotation.y = d.ry;
    mesh.position.y = 4;
    scene.add(mesh);
    return mesh;
  });

  /* ── Particle dust field ── */
  const pCount = 300;
  const pPos   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r     = Math.random() * 38 + 6;
    pPos[i * 3]     = Math.cos(theta) * r;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 22;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo,
    new THREE.PointsMaterial({ color: 0xe8d5a3, size: 0.14, transparent: true, opacity: 0.6, sizeAttenuation: true })
  );
  scene.add(particles);

  /* ── Background crystal gems ── */
  const gemColors = [0xc9a84c, 0xC4562A, 0x7B9BB5, 0xe8d5a3];
  const gems = Array.from({ length: 22 }, () => {
    const r    = Math.random() * 0.9 + 0.2;
    const col  = gemColors[Math.floor(Math.random() * gemColors.length)];
    const wire = Math.random() > 0.45;
    const geo  = Math.random() > 0.5
      ? new THREE.OctahedronGeometry(r, 0)
      : new THREE.IcosahedronGeometry(r, 0);
    const mat  = wire
      ? new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.28 })
      : new THREE.MeshStandardMaterial({ color: col, roughness: 0.05, metalness: 1, transparent: true, opacity: 0.5 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 48,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 16 - 8
    );
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.013,
      ry: (Math.random() - 0.5) * 0.013,
      phase: Math.random() * Math.PI * 2,
      amp: Math.random() * 1.5 + 0.5,
    };
    scene.add(mesh);
    return mesh;
  });

  /* ── Expanding pulse rings from logo ── */
  const pulseRings = Array.from({ length: 3 }, (_, i) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.04, 6, 60),
      new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0 })
    );
    mesh.position.y = 4;
    mesh.userData = { delay: i * 1.5 };
    scene.add(mesh);
    return mesh;
  });

  /* Mouse parallax */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    /* Logo gentle float + tilt */
    logoGroup.position.y  = 4 + Math.sin(t * 0.65) * 0.9;
    logoGroup.rotation.y  = Math.sin(t * 0.38) * 0.1;
    logoGroup.rotation.x  = Math.sin(t * 0.27) * 0.05;

    /* Rings orbit */
    rings[0].rotation.y += 0.004;  rings[0].rotation.z += 0.002;
    rings[1].rotation.x += 0.003;  rings[1].rotation.z -= 0.002;
    rings[2].rotation.y -= 0.002;  rings[2].rotation.x += 0.003;

    /* Particle slow spin */
    particles.rotation.y += 0.0008;

    /* Gems drift */
    gems.forEach(g => {
      g.rotation.x += g.userData.rx;
      g.rotation.y += g.userData.ry;
      g.position.y += Math.sin(t * 0.5 + g.userData.phase) * g.userData.amp * 0.002;
    });

    /* Pulse rings expand and fade */
    pulseRings.forEach(pr => {
      const phase = (t * 0.5 + pr.userData.delay) % 4;
      const scale = 1 + phase * 7;
      const alpha = Math.max(0, 0.3 - phase * 0.08);
      pr.scale.set(scale, scale, 1);
      pr.material.opacity = alpha;
    });

    /* Moving lights */
    goldLight.position.x = Math.sin(t * 0.45) * 13;
    goldLight.position.y = Math.cos(t * 0.35) * 9 + 5;
    rustLight.position.x = Math.cos(t * 0.38) * -14;
    rustLight.position.y = Math.sin(t * 0.30) * 8;

    /* Mouse parallax — multi-depth */
    camera.position.x += (mouseX * 4   - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 2.5 - camera.position.y) * 0.04;
    logoGroup.position.x = mouseX * -1.5;
    camera.lookAt(0, 2, 0);

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
