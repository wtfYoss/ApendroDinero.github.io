const modules = [
  { id: 1, title: 'Módulo 1 – Monedas Básicas', desc: 'Aprende a identificar las monedas mexicanas y su valor. ¡Conviértete en un experto!' },
  { id: 2, title: 'Módulo 2 – Súper Moneda', desc: 'Descubre el poder de la moneda de 10 pesos y sus secretos históricos.' },
  { id: 3, title: 'Módulo 3 – El Mercado', desc: 'Practica comprando y vendiendo en el mercado. ¿Cuánto te cambian de un billete?' },
  { id: 4, title: 'Módulo 4 – El Banco', desc: 'Aprende cómo funciona un banco y por qué es útil ahorrar.' },
  { id: 5, title: 'Módulo 5 – Ahorro', desc: 'Crea tu plan de ahorro y alcanza tus metas financieras.' },
];

// ── Carrusel ─────────────────────────
const VISIBLE = 3;
let current = 0;
const total = modules.length;
let moduloActual = 1;

// ── Utilidades de progreso ───────────
function estaCompleto(n) {
  return localStorage.getItem(`modulo${n}_completado`) === 'true';
}

function getModuleProgress(n) {
  return estaCompleto(n) ? 100 : 0;
}

function moduloDesbloqueado(n) {
  if (n === 1) return true;
  return estaCompleto(n - 1);
}

function contarModulosCompletados() {
  let completados = 0;
  for (let i = 1; i <= modules.length; i++) {
    if (estaCompleto(i)) completados++;
  }
  return completados;
}

// ── Carrusel ─────────────────────────
function buildDots() {
  const d = document.getElementById('dots');
  d.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === current ? ' active' : '');
    dot.onclick = () => goTo(i);
    d.appendChild(dot);
  }
}

function updateCarousel() {
  const items = document.querySelectorAll('.module-item');
  if (!items.length) return;

  const w = items[0].offsetWidth + 24;
  document.getElementById('carousel').style.transform = `translateX(-${current * w}px)`;

  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });

  document.getElementById('arrow-left').style.opacity = current === 0 ? '0.3' : '1';
  document.getElementById('arrow-right').style.opacity = current >= total - VISIBLE ? '0.3' : '1';
}

function goTo(i) {
  current = Math.max(0, Math.min(i, total - VISIBLE));
  updateCarousel();
}

function moveCarousel(dir) {
  goTo(current + dir);
}

// ── Modals ───────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ── Bloqueos visuales ────────────────
function actualizarBloqueos() {
  const mod4 = document.getElementById('mod4-card');
  const mod5 = document.getElementById('mod5-card');

  if (mod4) {
    mod4.classList.toggle('card-locked', !moduloDesbloqueado(4));
  }

  if (mod5) {
    mod5.classList.toggle('card-locked', !moduloDesbloqueado(5));
  }
}

// ── Abrir módulo ─────────────────────
function openModule(n) {
  if (!moduloDesbloqueado(n)) {
    showToast(`¡Completa el Módulo ${n - 1} primero!`);
    return;
  }

  moduloActual = n;
  const m = modules.find(x => x.id === n);
  const progress = getModuleProgress(n);

  document.getElementById('mod-title').textContent = m.title;
  document.getElementById('mod-desc').textContent = m.desc;
  document.getElementById('mod-progress-pct').textContent = progress + '%';

  const bar = document.getElementById('mod-progress-bar');
  bar.style.width = '0%';
  setTimeout(() => {
    bar.style.width = progress + '%';
  }, 80);

  openModal('module-modal');
}

function startModule() {
  closeModal('module-modal');
  window.location.href = `modulos/modulo${moduloActual}.html`;
}

// ── Perfil / Nombre ──────────────────
function saveName() {
  const n = document.getElementById('name-input').value.trim() || 'Player';
  document.getElementById('player-name').textContent = n;
  localStorage.setItem('player_name', n);
  closeModal('player-modal');
  showToast('¡Nombre guardado, ' + n + '!');
}

function cargarNombre() {
  const nombre = localStorage.getItem('player_name');
  if (nombre) {
    document.getElementById('player-name').textContent = nombre;
    const input = document.getElementById('name-input');
    if (input) input.value = nombre;
  }
}

// ── Ajustes ──────────────────────────
function toggleSetting(id) {
  document.getElementById(id).classList.toggle('on');
}

let muted = true;
function toggleMute() {
  muted = !muted;
  document.getElementById('mute-btn').innerHTML = muted
    ? '<i class="fa-solid fa-volume-xmark" style="color: rgb(255, 255, 255);"></i>'
    : '<i class="fa-solid fa-volume-high" style="color: rgb(255, 255, 255);"></i>';

  showToast(muted ? 'Sonido desactivado' : 'Sonido activado');
}

// ── Puntaje / progreso general ───────
function actualizarPanelPuntaje() {
  const totalScore = Number(localStorage.getItem('total_score')) || 0;
  const completados = contarModulosCompletados();

  const totalScoreEl = document.getElementById('total-score');
  const modulesDoneEl = document.getElementById('modules-done');
  const streakEl = document.getElementById('streak');
  const starsEl = document.getElementById('stars');

  if (totalScoreEl) totalScoreEl.textContent = totalScore;
  if (modulesDoneEl) modulesDoneEl.textContent = completados;
  if (streakEl) streakEl.textContent = completados;
  if (starsEl) {
    starsEl.innerHTML = `<i class="fa-solid fa-star" style="color: rgb(255, 212, 59);"></i>${completados}`;
  }
}

// ── Toast ─────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Init ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildDots();
  setTimeout(updateCarousel, 50);
  window.addEventListener('resize', updateCarousel);

  cargarNombre();
  actualizarBloqueos();
  actualizarPanelPuntaje();
});

let musica = null;

document.addEventListener('DOMContentLoaded', () => {
  musica = document.getElementById('bg-music');
  if (!musica) return;

  const musicMuted = localStorage.getItem('music_muted') === 'true';
  const savedTime = parseFloat(localStorage.getItem('music_time') || '0');

  musica.volume = 0.2;
  musica.currentTime = savedTime;

  const btn = document.getElementById('mute-btn');
  if (btn) {
    btn.innerHTML = musicMuted
      ? '<i class="fa-solid fa-volume-xmark" style="color: rgb(255, 255, 255);"></i>'
      : '<i class="fa-solid fa-volume-high" style="color: rgb(255, 255, 255);"></i>';
  }

  document.body.addEventListener('click', iniciarMusica, { once: true });

  window.addEventListener('beforeunload', () => {
    if (!musica) return;
    localStorage.setItem('music_time', String(musica.currentTime));
  });
});

function iniciarMusica() {
  if (!musica) return;

  const musicMuted = localStorage.getItem('music_muted') === 'true';
  if (musicMuted) return;

  musica.play().catch(err => {
    console.log('No se pudo reproducir la música:', err);
  });
}

function toggleMute() {
  muted = !muted;

  const btn = document.getElementById('mute-btn');
  btn.innerHTML = muted
    ? '<i class="fa-solid fa-volume-xmark" style="color: rgb(255, 255, 255);"></i>'
    : '<i class="fa-solid fa-volume-high" style="color: rgb(255, 255, 255);"></i>';

  localStorage.setItem('music_muted', muted ? 'true' : 'false');

  if (musica) {
    if (muted) {
      musica.pause();
    } else {
      musica.play().catch(() => {});
    }
  }

  showToast(muted ? 'Sonido desactivado' : 'Sonido activado');
}