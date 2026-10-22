/* BREACH REPORT - main.js (no dependencies) */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Dynamic year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Mobile menu */
  var btn = document.getElementById('menuBtn'), nav = document.getElementById('nav');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
    nav.classList.toggle('open', open);
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); }
    });
  }

  /* Smooth scroll for in-page links */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var t = id.length > 1 ? document.querySelector(id) : null;
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
    });
  });

  /* Scroll reveal (content stays visible if unsupported) */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Copy handle */
  var copyBtn = document.getElementById('copyBtn'), status = document.getElementById('copyStatus');
  var HANDLE = '@TheBreachReport', timer;
  function say(msg, ok) {
    status.textContent = msg;
    status.className = 'status ' + (ok ? 'ok' : 'err');
    clearTimeout(timer);
    timer = setTimeout(function () { status.textContent = ''; status.className = 'status'; }, 4000);
  }
  function legacyCopy() {
    var ta = document.createElement('textarea');
    ta.value = HANDLE; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var done = function () { say('آیدی کپی شد: ' + HANDLE, true); };
    var fail = function () { say('کپی انجام نشد. آیدی را دستی وارد کنید: ' + HANDLE, false); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(HANDLE).then(done, function () { legacyCopy() ? done() : fail(); });
    } else { legacyCopy() ? done() : fail(); }
  });

  /* Back to top */
  var top = document.getElementById('toTop');
  if (top) {
    var onScroll = function () { top.hidden = window.scrollY < window.innerHeight * 0.9; };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }
})();
