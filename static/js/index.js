// ── Hero Form: Safe self-contained script ──
var HERO_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

function heroShowPopup() {
  var p = document.getElementById('hero-success-popup');
  if (p) { p.classList.add('active'); }
}
function heroHidePopup() {
  var p = document.getElementById('hero-success-popup');
  if (p) { p.classList.remove('active'); }
}

document.addEventListener('DOMContentLoaded', function() {
  var form    = document.getElementById('hero-form');
  var popup   = document.getElementById('hero-success-popup');
  var closeBtn= document.getElementById('hero-popup-close');

  if (!form || !popup || !closeBtn) return;

  closeBtn.onclick = heroHidePopup;
  popup.onclick = function(e) { if (e.target === popup) heroHidePopup(); };

  // Clear errors on input
  ['hfg-name','hfg-phone','hfg-from','hfg-dest','hfg-date','hfg-pax'].forEach(function(gid) {
    var g = document.getElementById(gid);
    if (!g) return;
    g.querySelectorAll('input,select').forEach(function(el) {
      el.addEventListener('input',  function(){ g.classList.remove('hf-has-error'); });
      el.addEventListener('change', function(){ g.classList.remove('hf-has-error'); });
    });
  });

  function setErr(gid, show) {
    var g = document.getElementById(gid);
    if (g) g.classList.toggle('hf-has-error', show);
  }

  function validate() {
    var ok = true;

    var name = (document.getElementById('hf-name').value || '').trim();
    setErr('hfg-name', !name); if (!name) ok = false;

    var ph = (document.getElementById('hf-phone').value || '').replace(/\s/g,'').replace('+91','');
    var phOk = /^\d{10}$/.test(ph);
    setErr('hfg-phone', !phOk); if (!phOk) ok = false;

    var fr = (document.getElementById('hf-from').value || '').trim();
    setErr('hfg-from', !fr); if (!fr) ok = false;

    var ds = (document.getElementById('hf-dest').value || '').trim();
    setErr('hfg-dest', !ds); if (!ds) ok = false;

    var dt = document.getElementById('hf-date').value;
    setErr('hfg-date', !dt); if (!dt) ok = false;

    var px = document.getElementById('hf-pax').value;
    setErr('hfg-pax', !px); if (!px) ok = false;

    return ok;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validate()) return;

    var btn = document.getElementById('hf-submit');
    if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }

    var payload = {
      timestamp:   new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      source:      'Home Page Hero Form',
      name:        (document.getElementById('hf-name').value || '').trim(),
      phone:       (document.getElementById('hf-phone').value || '').trim(),
      email:       '',
      from:        (document.getElementById('hf-from').value || '').trim(),
      destination: (document.getElementById('hf-dest').value || '').trim(),
      date:        document.getElementById('hf-date').value,
      passengers:  document.getElementById('hf-pax').value,
      message:     ''
    };

    function done() {
      form.reset();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Send Query';
      }
      heroShowPopup();
    }

    // Send to sheet — done() called no matter what happens
    try {
      fetch(HERO_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function() { done(); }).catch(function() { done(); });
    } catch(err) {
      done();
    }
  });
});