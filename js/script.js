/* =====================================================
   MAIN SCRIPT — UNDANGAN KHITAN AKSA JULIANSYAH
   ===================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------
     1. GUEST NAME from ?to=
  --------------------------------------------------- */
  function setGuestName() {
    try {
      var params = new URLSearchParams(window.location.search);
      var to = params.get('to') || params.get('kepada') || params.get('tamu');
      if (to) {
        to = decodeURIComponent(to).replace(/\+/g, ' ').trim();
        if (to) {
          var el = $('#guestName');
          if (el) el.textContent = to;
        }
      }
    } catch (e) { /* noop */ }
  }

  /* ---------------------------------------------------
     2. LOADING SCREEN
  --------------------------------------------------- */
  var loaderHidden = false;
  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    var loader = $('#loader');
    if (loader) loader.classList.add('hide');
  }

  /* ---------------------------------------------------
     3. OPEN INVITATION
  --------------------------------------------------- */
  function initOpen() {
    var btn = $('#openBtn');
    var cover = $('#cover');
    var music = $('#bgMusic');
    if (!btn || !cover) return;

    btn.addEventListener('click', function () {
      cover.classList.add('open');
      document.body.classList.remove('locked');
      document.body.classList.add('revealed');

      // play music
      if (music) {
        music.volume = 0;
        var p = music.play();
        if (p && p.then) {
          p.then(function () { fadeInMusic(music); setMusicState(true); })
           .catch(function () { setMusicState(false); });
        } else {
          fadeInMusic(music); setMusicState(true);
        }
      }

      // smooth scroll to content
      setTimeout(function () {
        var inv = $('#ucapan');
        if (inv) inv.scrollIntoView({ behavior: 'smooth' });
        if (window.AOS) AOS.refreshHard();
      }, 700);
    });
  }

  /* ---------------------------------------------------
     4. MUSIC CONTROL
  --------------------------------------------------- */
  var musicPlaying = false;
  function fadeInMusic(audio) {
    var v = 0;
    var iv = setInterval(function () {
      v += 0.04;
      if (v >= 0.6) { v = 0.6; clearInterval(iv); }
      audio.volume = v;
    }, 90);
  }
  function setMusicState(on) {
    musicPlaying = on;
    var btn = $('#musicBtn');
    if (!btn) return;
    btn.classList.toggle('spin', on);
    var icon = $('i', btn);
    if (icon) icon.className = on ? 'fas fa-music' : 'fas fa-volume-xmark';
  }
  function initMusic() {
    var btn = $('#musicBtn');
    var music = $('#bgMusic');
    if (!btn || !music) return;
    btn.addEventListener('click', function () {
      if (musicPlaying) {
        music.pause(); setMusicState(false);
      } else {
        var p = music.play();
        if (p && p.then) { p.then(function () { music.volume = 0.6; setMusicState(true); }).catch(function(){}); }
        else { music.volume = 0.6; setMusicState(true); }
      }
    });
  }

  /* ---------------------------------------------------
     5. BACK TO TOP
  --------------------------------------------------- */
  function initBackTop() {
    var btn = $('#backTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) btn.classList.add('show');
      else btn.classList.remove('show');
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------
     6. RIPPLE EFFECT
  --------------------------------------------------- */
  function initRipple() {
    $$('.ripple').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var rect = el.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var span = document.createElement('span');
        span.className = 'ripple-wave';
        span.style.width = span.style.height = size + 'px';
        span.style.left = (e.clientX - rect.left - size / 2) + 'px';
        span.style.top  = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(span);
        setTimeout(function () { span.remove(); }, 650);
      });
    });
  }

  /* ---------------------------------------------------
     7. MOUSE GLOW
  --------------------------------------------------- */
  function initMouseGlow() {
    var glow = $('#mouseGlow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
    var x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY; glow.style.opacity = '1';
    });
    (function loop() {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------------------------------------------
     8. PARTICLES CANVAS
  --------------------------------------------------- */
  function initParticles() {
    var canvas = $('#particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var parts = [];
    var W, H, count;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      count = Math.min(70, Math.floor(W / 22));
      parts = [];
      for (var i = 0; i < count; i++) parts.push(newPart());
    }
    function newPart() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.6,
        d: Math.random() * 0.5 + 0.15,
        sway: Math.random() * 0.6 - 0.3,
        o: Math.random() * 0.5 + 0.2,
        gold: Math.random() > 0.5
      };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? 'rgba(231,200,115,' + p.o + ')'
          : 'rgba(255,255,255,' + (p.o * 0.7) + ')';
        ctx.fill();
        p.y += p.d; p.x += p.sway;
        if (p.y > H + 5) { p.y = -5; p.x = Math.random() * W; }
        if (p.x > W + 5) p.x = -5;
        if (p.x < -5) p.x = W + 5;
      }
      requestAnimationFrame(draw);
    }
    resize();
    draw();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(resize, 200);
    });
  }

  /* ---------------------------------------------------
     9. LIGHTBOX
  --------------------------------------------------- */
  function initLightbox() {
    var lb = $('#lightbox');
    var lbImg = $('#lbImg');
    var close = $('#lbClose');
    if (!lb || !lbImg) return;

    $$('.gallery__item img').forEach(function (img) {
      img.addEventListener('click', function () {
        lbImg.src = img.dataset.full || img.src;
        lb.classList.add('show');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
    function hide() {
      lb.classList.remove('show');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    if (close) close.addEventListener('click', hide);
    lb.addEventListener('click', function (e) { if (e.target === lb) hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  }

  /* ---------------------------------------------------
     10. RSVP + LOCALSTORAGE
  --------------------------------------------------- */
  var STORE_KEY = 'rsvp_aksa_khitan';
  function getWishes() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveWishes(arr) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (e) {}
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function renderWishes() {
    var list = $('#wishesList');
    if (!list) return;
    var arr = getWishes();
    if (!arr.length) {
      list.innerHTML = '<p class="wishes__empty">Belum ada ucapan. Jadilah yang pertama memberikan do\'a. 🤍</p>';
      return;
    }
    list.innerHTML = arr.slice().reverse().map(function (w) {
      var cls = w.attend === 'Hadir' ? 'is-hadir' : (w.attend === 'Tidak Hadir' ? 'is-tidak' : '');
      return '<div class="wish">' +
        '<div class="wish__head">' +
          '<span class="wish__name"><i class="fas fa-user-circle"></i> ' + escapeHtml(w.name) + '</span>' +
          '<span class="wish__badge ' + cls + '">' + escapeHtml(w.attend) + '</span>' +
        '</div>' +
        (w.message ? '<p class="wish__msg">' + escapeHtml(w.message) + '</p>' : '') +
      '</div>';
    }).join('');
  }
  function initRSVP() {
    var form = $('#rsvpForm');
    if (!form) return;
    renderWishes();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#rsvpName').value.trim();
      var attend = $('#rsvpAttend').value;
      var message = $('#rsvpMsg').value.trim();
      if (!name || !attend) return;

      var arr = getWishes();
      arr.push({ name: name, attend: attend, message: message, ts: Date.now() });
      saveWishes(arr);
      renderWishes();
      form.reset();

      var btn = $('.rsvp__btn', form);
      if (btn) {
        var orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Terima Kasih!</span>';
        btn.style.pointerEvents = 'none';
        setTimeout(function () { btn.innerHTML = orig; btn.style.pointerEvents = ''; }, 2200);
      }
    });
  }

  /* ---------------------------------------------------
     11. AOS INIT
  --------------------------------------------------- */
  function initAOS() {
    if (window.AOS) {
      AOS.init({ duration: 900, easing: 'ease-out-cubic', once: true, offset: 80 });
    } else {
      document.documentElement.classList.add('no-aos');
    }
  }

  /* ---------------------------------------------------
     BOOT — runs as soon as DOM is ready, never waits on
     slow CDN/audio resources (loader has a hard fallback)
  --------------------------------------------------- */
  var booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    try { setGuestName(); } catch (e) {}
    try { initAOS(); } catch (e) {}
    try { initOpen(); } catch (e) {}
    try { initMusic(); } catch (e) {}
    try { initBackTop(); } catch (e) {}
    try { initRipple(); } catch (e) {}
    try { initMouseGlow(); } catch (e) {}
    try { initParticles(); } catch (e) {}
    try { initLightbox(); } catch (e) {}
    try { initRSVP(); } catch (e) {}
  }

  // Run init immediately (DOM is already parsed — scripts are at end of body)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Hide the loading screen: whichever happens first wins.
  setTimeout(hideLoader, 1500);                 // normal case
  window.addEventListener('load', hideLoader);  // if everything loads fast
  setTimeout(hideLoader, 4000);                 // hard fallback — never stuck
})();
