// ================================================================
//  GOOGLE SHEETS CONFIG
//  ✅ Replace SHEET_URL_CONTACT with your Google Apps Script URL
// ================================================================
const SHEET_URL_CONTACT = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
// ================================================================

function showPopup() {
  document.getElementById('success-popup').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function hidePopup() {
  document.getElementById('success-popup').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('popup-close').addEventListener('click', hidePopup);
document.getElementById('success-popup').addEventListener('click', function(e) {
  if (e.target === this) hidePopup();
});

// Validation helpers
function setError(id, show) {
  const fg = document.getElementById('fg-' + id);
  if (!fg) return;
  fg.classList.toggle('has-error', show);
}

function validateForm() {
  let valid = true;

  const name = document.getElementById('cf-name').value.trim();
  setError('name', !name);
  if (!name) valid = false;

  const phone = document.getElementById('cf-phone').value.replace(/\s/g,'').replace('+91','');
  setError('phone', !/^\d{10}$/.test(phone));
  if (!/^\d{10}$/.test(phone)) valid = false;

  const email = document.getElementById('cf-email').value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', true); valid = false;
  } else { setError('email', false); }

  const from = document.getElementById('cf-from').value.trim();
  setError('from', !from);
  if (!from) valid = false;

  const dest = document.getElementById('cf-dest').value.trim();
  setError('dest', !dest);
  if (!dest) valid = false;

  const date = document.getElementById('cf-date').value;
  setError('date', !date);
  if (!date) valid = false;

  const pax = document.getElementById('cf-pax').value;
  setError('pax', !pax);
  if (!pax) valid = false;

  return valid;
}

document.getElementById('contact-main-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const btn = document.getElementById('cf-submit');
  btn.disabled = true;
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Sending…';

  const payload = {
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    source: 'Contact Page',
    name: document.getElementById('cf-name').value.trim(),
    phone: document.getElementById('cf-phone').value.trim(),
    email: document.getElementById('cf-email').value.trim(),
    from: document.getElementById('cf-from').value.trim(),
    destination: document.getElementById('cf-dest').value.trim(),
    date: document.getElementById('cf-date').value,
    passengers: document.getElementById('cf-pax').value,
    message: document.getElementById('cf-message').value.trim()
  };

  try {
    await fetch(SHEET_URL_CONTACT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch(err) {
    // no-cors means we can't read the response, but data is sent
    console.log('Form submitted');
  }

  this.reset();
  btn.disabled = false;
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Send Booking Enquiry';
  showPopup();
});

// Clear error on input
document.querySelectorAll('#contact-main-form input, #contact-main-form select, #contact-main-form textarea').forEach(el => {
  el.addEventListener('input', () => {
    const fg = el.closest('.form-group');
    if (fg) fg.classList.remove('has-error');
  });
});