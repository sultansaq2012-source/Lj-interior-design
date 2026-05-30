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
