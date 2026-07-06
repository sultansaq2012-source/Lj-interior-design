/* LJ Design — interactions: reveal on scroll, work filters, mobile nav, contact form */

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---------- Mobile nav ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

navLinks.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ---------- Work filter tabs ----------
const tabs = document.querySelectorAll('.tab-btn');
const cards = document.querySelectorAll('.project-card');
const workEmpty = document.getElementById('workEmpty');

tabs.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabs.forEach((b) => {
      b.dataset.active = 'false';
      b.setAttribute('aria-selected', 'false');
    });
    btn.dataset.active = 'true';
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.tab;
    let visible = 0;
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('filtered-out', !show);
      if (show) {
        visible += 1;
        card.classList.add('in'); // re-shown cards must not stay in the pre-reveal state
      }
    });
    workEmpty.hidden = visible > 0;
  });
});

// ---------- Contact form ----------
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const formSuccess = document.getElementById('formSuccess');
const formFail = document.getElementById('formFail');

function setFieldError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + 'Error');
  input.closest('.form-field').classList.toggle('has-error', Boolean(message));
  error.textContent = message || '';
}

function validate() {
  let ok = true;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name) {
    setFieldError('name', 'Please tell us your name.');
    ok = false;
  } else setFieldError('name', '');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('email', 'Please enter a valid email address.');
    ok = false;
  } else setFieldError('email', '');

  if (!message) {
    setFieldError('message', 'Tell us a little about the space.');
    ok = false;
  } else setFieldError('message', '');

  return ok;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.hidden = true;
  formFail.hidden = true;
  if (!validate()) return;

  // No backend yet — hand the enquiry to WhatsApp with the form contents prefilled.
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;

  try {
    const lines = [
      'Hello LJ Design, I would like to start a project.',
      'Name: ' + form.name.value.trim(),
      'Email: ' + form.email.value.trim(),
      form.phone.value.trim() && 'Phone: ' + form.phone.value.trim(),
      form.service.value && 'Project type: ' + form.service.value,
      'Message: ' + form.message.value.trim(),
    ].filter(Boolean);

    window.open(
      'https://wa.me/966505538629?text=' + encodeURIComponent(lines.join('\n')),
      '_blank',
      'noopener'
    );
    formSuccess.hidden = false;
    form.reset();
  } catch (err) {
    formFail.hidden = false;
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }
});
