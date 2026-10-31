// ✏️ EDIT THESE DETAILS ------------------------------------------
var CONFIG = {
  title: 'Halloween Party',
  date: new Date(2026, 9, 31, 20, 0, 0),   // month is zero-based (9 = October)
  durationHours: 4,
  place: 'The Haunted Hall, Your Street, Your Town',
  hostPhone: '911234567890',               // WhatsApp number with country code, no + or spaces
  hostName: 'The Host'
};
// ----------------------------------------------------------------

var el = function (id) { return document.getElementById(id); };
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Details ---------- */
el('dateTxt').textContent = CONFIG.date.toLocaleString('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit'
});
el('placeTxt').textContent = CONFIG.place;
el('mapLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CONFIG.place);

/* ---------- Calendar ---------- */
function stamp(d) { return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; }
var endDate = new Date(CONFIG.date.getTime() + CONFIG.durationHours * 36e5);
el('gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  + '&text=' + encodeURIComponent(CONFIG.title)
  + '&dates=' + stamp(CONFIG.date) + '/' + stamp(endDate)
  + '&location=' + encodeURIComponent(CONFIG.place)
  + '&details=' + encodeURIComponent('Costumes encouraged! 🎃');
el('ics').onclick = function () {
  var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    'DTSTART:' + stamp(CONFIG.date), 'DTEND:' + stamp(endDate),
    'SUMMARY:' + CONFIG.title, 'LOCATION:' + CONFIG.place, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'halloween-party.ics';
  a.click();
};

/* ---------- Share ---------- */
el('share').onclick = function () {
  var data = { title: CONFIG.title, text: 'You’re invited to a Halloween party! 🎃', url: location.href };
  if (navigator.share) { navigator.share(data).catch(function () {}); return; }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(location.href).then(function () { el('share').textContent = '✅ Link copied'; });
  }
};

/* ---------- Sound (generated, no audio files) ---------- */
var ctx = null, soundOn = false;
function audio() {
  if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function creak() {
  var c = audio(); if (!c || !soundOn) return;
  var o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(90, t);
  o.frequency.linearRampToValueAtTime(220, t + .5);
  o.frequency.linearRampToValueAtTime(70, t + 1.5);
  g.gain.setValueAtTime(.001, t);
  g.gain.linearRampToValueAtTime(.12, t + .3);
  g.gain.linearRampToValueAtTime(.001, t + 1.6);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + 1.7);
}
function thunder() {
  var c = audio(); if (!c || !soundOn) return;
  var len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = buf; f.type = 'lowpass'; f.frequency.value = 220; g.gain.value = .9;
  s.connect(f).connect(g).connect(c.destination); s.start();
}
el('mute').onclick = function () {
  soundOn = !soundOn;
  el('mute').textContent = soundOn ? '🔊' : '🔇';
  if (soundOn) audio();
};

/* ---------- Gate opening ---------- */
function openGate() {
  el('gate').classList.add('open');
  el('main').classList.add('show');
  soundOn = true; el('mute').textContent = '🔊';
  creak();
  setTimeout(function () { el('gate').classList.add('gone'); }, reduceMotion ? 0 : 1800);
}
el('knock').onclick = openGate;

/* ---------- Lightning ---------- */
function lightning() {
  if (!reduceMotion) {
    var f = el('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    setTimeout(thunder, 500);
  }
  setTimeout(lightning, 9000 + Math.random() * 9000);
}
setTimeout(lightning, 6000);

/* ---------- Floating ghosts ---------- */
if (!reduceMotion) {
  for (var i = 0; i < 5; i++) {
    var g = document.createElement('span');
    g.className = 'ghost'; g.textContent = i % 2 ? '👻' : '🎃';
    g.style.left = (8 + i * 20) + 'vw';
    g.style.animationDuration = (16 + i * 4) + 's';
    g.style.animationDelay = (-i * 5) + 's';
    document.body.appendChild(g);
  }
}

/* ---------- Countdown ---------- */
function tick() {
  var diff = CONFIG.date - new Date();
  if (diff <= 0) {
    ['d', 'h', 'm', 's'].forEach(function (k) { el(k).textContent = '0'; });
    el('live').style.display = 'block';
    return;
  }
  el('d').textContent = Math.floor(diff / 864e5);
  el('h').textContent = Math.floor(diff % 864e5 / 36e5);
  el('m').textContent = Math.floor(diff % 36e5 / 6e4);
  el('s').textContent = Math.floor(diff % 6e4 / 1e3);
}
tick(); setInterval(tick, 1000);

/* ---------- RSVP ---------- */
function confetti() {
  if (reduceMotion) return;
  var set = ['🎃', '🦇', '👻', '🕷️', '🍬'];
  for (var i = 0; i < 40; i++) {
    var c = document.createElement('span');
    c.className = 'conf'; c.textContent = set[i % set.length];
    c.style.left = Math.random() * 100 + 'vw';
    c.style.fontSize = 18 + Math.random() * 20 + 'px';
    c.style.animationDelay = Math.random() * .6 + 's';
    document.body.appendChild(c);
    setTimeout(function (n) { n.remove(); }, 3500, c);
  }
}
el('rsvpBtn').onclick = function () {
  el('rsvp').classList.add('on');
  el('rsvp').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  el('n').focus({ preventScroll: true });
};
el('send').onclick = function () {
  var name = el('n').value.trim(), err = el('err');
  err.textContent = '';
  if (name.length < 2) { err.textContent = '💀 Please tell us your name first.'; el('n').focus(); return; }
  var yes = el('a').value === 'y', guests = el('g').value;
  var msg = yes
    ? 'Hi ' + CONFIG.hostName + '! 🎃 This is ' + name + '. I’ll be at the Halloween party with ' + guests + ' guest(s) in total.'
    : 'Hi ' + CONFIG.hostName + '. This is ' + name + '. Sorry, I can’t make it to the Halloween party. 👻';
  try { localStorage.setItem('rsvp', JSON.stringify({ name: name, guests: guests, yes: yes })); } catch (e) {}
  var t = el('thanks'); t.style.display = 'block';
  t.textContent = yes ? '🦇 Thank you, ' + name + '! Opening WhatsApp to confirm…' : '👻 We’ll miss you, ' + name + '. Opening WhatsApp to let the host know…';
  if (yes) confetti();
  setTimeout(function () {
    window.open('https://wa.me/' + CONFIG.hostPhone + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  }, 900);
};