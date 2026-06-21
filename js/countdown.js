/* =====================================================
   COUNTDOWN — menuju 27 Juni 2026, 14.00 WIB
   WIB = UTC+7  ->  2026-06-27T14:00:00+07:00
   ===================================================== */
(function () {
  'use strict';

  var TARGET = new Date('2026-06-27T14:00:00+07:00').getTime();

  var elDays  = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMins  = document.getElementById('cd-mins');
  var elSecs  = document.getElementById('cd-secs');

  if (!elDays) return;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function setVal(el, val) {
    var v = pad(val);
    if (el.textContent !== v) {
      el.textContent = v;
      // subtle flip feedback
      el.style.transform = 'translateY(-4px)';
      el.style.opacity = '0.6';
      window.requestAnimationFrame(function () {
        el.style.transition = 'transform .35s ease, opacity .35s ease';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    }
  }

  function tick() {
    var now = Date.now();
    var dist = TARGET - now;

    if (dist <= 0) {
      setVal(elDays, 0); setVal(elHours, 0); setVal(elMins, 0); setVal(elSecs, 0);
      var dateEl = document.querySelector('.countdown__date');
      if (dateEl && !dateEl.dataset.done) {
        dateEl.dataset.done = '1';
        dateEl.innerHTML = '<i class="fas fa-heart"></i> Alhamdulillah, Acara Telah Berlangsung';
      }
      return;
    }

    var days  = Math.floor(dist / 86400000);
    var hours = Math.floor((dist % 86400000) / 3600000);
    var mins  = Math.floor((dist % 3600000) / 60000);
    var secs  = Math.floor((dist % 60000) / 1000);

    setVal(elDays, days);
    setVal(elHours, hours);
    setVal(elMins, mins);
    setVal(elSecs, secs);
  }

  tick();
  setInterval(tick, 1000);
})();
