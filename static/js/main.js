/* ================================================================
   MAIN.JS — Shared across all pages
   Car With Driver North India
   ================================================================ */

'use strict';

/* ── SCROLL PROGRESS BAR ── */
(function() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── NAVBAR: scrolled class + hamburger ── */
(function() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }
})();

/* ── BACK TO TOP ── */
(function() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── REVEAL ON SCROLL ── */
(function() {
  const targets = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale');
  if (!targets.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(t => obs.observe(t));
})();

/* ── COUNT-UP NUMBERS ── */
(function() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const duration = 1800;
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const update = now => {
        const t = Math.min((now - start) / duration, 1);
        const val = target * easeOut(t);
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
})();

/* ── CURSOR GLOW ── */
(function() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const tick = () => {
    cx += (mx - cx) * 0.10;
    cy += (my - cy) * 0.10;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(tick);
  };
  tick();
})();

/* ── SPOTLIGHT CARDS ── */
(function() {
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* ── 3D TILT CARDS ── */
(function() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── CANVAS PARTICLES (Hero) ── */
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const rand = (min, max) => Math.random() * (max - min) + min;
  const N = Math.min(50, Math.floor(W / 20));

  particles = Array.from({ length: N }, () => ({
    x: rand(0, W), y: rand(0, H),
    vx: rand(-0.3, 0.3), vy: rand(-0.5, -0.1),
    r: rand(1, 3),
    alpha: rand(0.1, 0.4),
    life: rand(0, 1),
  }));

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life += 0.003;
      if (p.y < -5 || p.life > 1) {
        p.y = H + 5; p.x = rand(0, W); p.life = 0;
      }
      const alpha = p.alpha * Math.sin(p.life * Math.PI);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,168,48,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}
document.addEventListener('DOMContentLoaded', () => initParticles('hero-particles'));

/* ── CONTACT FORM ── */
(function() {
  const form = document.getElementById('enquiry-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    // Simulate submission
    setTimeout(() => {
      status.textContent = '✓ Thank you! We will contact you within 2 hours.';
      status.style.cssText = 'color:#2D6A4F; font-weight:600; padding:12px 0; display:block;';
      form.reset();
      btn.disabled = false; btn.textContent = 'Send Booking Enquiry →';
    }, 1200);
  });
})();

/* ── ACTIVE NAV LINK ── */
(function() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── LAZY IMAGE PLACEHOLDER ── */
(function() {
  document.querySelectorAll('img[data-src]').forEach(img => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.src = e.target.dataset.src;
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '200px' });
    obs.observe(img);
  });
})();


const modal = document.getElementById("imageModal");
const modalSlider = document.getElementById("modalSlider");
const closeBtn = document.querySelector(".close");

let modalIndex = 0;
let modalSlides = [];
let isZoomed = false;
let startX = 0;

// 👉 LOOP ALL SLIDERS (IMPORTANT)
document.querySelectorAll(".slider").forEach(slider => 
{
  const slides = slider.querySelectorAll(".slide");
  let index = 0;

  // ===== MAIN SLIDER CLICK =====
  slider.addEventListener("click", (e) => {
    const width = slider.clientWidth;

    if (e.target.classList.contains("slide")) {
      // 👉 OPEN MODAL
      e.stopPropagation();
      openModal(slides, index);
      return;
    }

    // 👉 LEFT / RIGHT SLIDE
    if (e.offsetX < width / 2) {
      index = (index - 1 + slides.length) % slides.length;
    } else {
      index = (index + 1) % slides.length;
    }

    updateSlider(slides, index);
  });

  function updateSlider(slides, i) {
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
  }
});


// ===== OPEN MODAL WITH CURRENT CARD IMAGES =====
function openModal(slides, startIndex) {
  modal.style.display = "flex";
  modalSlider.innerHTML = "";

  modalIndex = startIndex;

  slides.forEach((img, i) => {
    const newImg = document.createElement("img");
    newImg.src = img.src;
    newImg.classList.add("modal-slide");

    if (i === modalIndex) newImg.classList.add("active");

    modalSlider.appendChild(newImg);
  });

  modalSlides = modalSlider.querySelectorAll(".modal-slide");
}


// ===== SHOW MODAL SLIDE =====
function showModalSlide(i) {
  modalSlides.forEach(img => {
    img.classList.remove("active");
    img.style.transform = "scale(1)";
  });

  modalSlides[i].classList.add("active");
  isZoomed = false;
}

// ===== CLICK LEFT/RIGHT IN MODAL =====
modalSlider.addEventListener("click", (e) => {
  const width = modalSlider.clientWidth;

  if (e.offsetX < width / 2) {
    modalIndex = (modalIndex - 1 + modalSlides.length) % modalSlides.length;
  } else {
    modalIndex = (modalIndex + 1) % modalSlides.length;
  }

  showModalSlide(modalIndex);
});


// ===== SWIPE SUPPORT =====
modalSlider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

modalSlider.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) {
    modalIndex = (modalIndex + 1) % modalSlides.length;
  } else if (endX - startX > 50) {
    modalIndex = (modalIndex - 1 + modalSlides.length) % modalSlides.length;
  }

  showModalSlide(modalIndex);
});


// ===== CLOSE MODAL =====
closeBtn.onclick = () => modal.style.display = "none";

modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};