const modules = [
  { id:1, title:'Módulo 1 – Monedas Básicas', desc:'Aprende a identificar las monedas mexicanas y su valor. ¡Conviértete en un experto!', progress: 60 },
  { id:2, title:'Módulo 2 – Súper Moneda',    desc:'Descubre el poder de la moneda de 10 pesos y sus secretos históricos.',             progress: 20 },
  { id:3, title:'Módulo 3 – El Mercado',      desc:'Practica comprando y vendiendo en el mercado. ¿Cuánto te cambian de un billete?',   progress: 0  },
  { id:4, title:'Módulo 4 – El Banco',        desc:'Aprende cómo funciona un banco y por qué es útil ahorrar.',                        progress: 0  },
  { id:5, title:'Módulo 5 – Ahorro',          desc:'Crea tu plan de ahorro y alcanza tus metas financieras.',                          progress: 0  },
];

// ── Carrusel ─────────────────────────
const VISIBLE = 3;
let current = 0;
const total  = modules.length;

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
  const w = items[0].offsetWidth + 24;
  document.getElementById('carousel').style.transform = `translateX(-${current * w}px)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  document.getElementById('arrow-left').style.opacity  = current === 0 ? '0.3' : '1';
  document.getElementById('arrow-right').style.opacity = current >= total - VISIBLE ? '0.3' : '1';
}

function goTo(i)           { current = Math.max(0, Math.min(i, total - VISIBLE)); updateCarousel(); }
function moveCarousel(dir) { goTo(current + dir); }

// ── Modals ───────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ── Abrir módulo ─────────────────────
let moduloActual = 1; // guarda qué módulo se abrió

function openModule(n) {
  moduloActual = n;
  const m = modules.find(x => x.id === n);
  document.getElementById('mod-title').textContent        = m.title;
  document.getElementById('mod-desc').textContent         = m.desc;
  document.getElementById('mod-progress-pct').textContent = m.progress + '%';

  // Animar barra de progreso
  const bar = document.getElementById('mod-progress-bar');
  bar.style.width = '0%';
  setTimeout(() => { bar.style.width = m.progress + '%'; }, 80);

  openModal('module-modal');
}

function startModule() {
  closeModal('module-modal');
  window.location.href = `modulos/modulo${moduloActual}.html`;
  // ↑ Redirige a: modulos/modulo1.html, modulos/modulo2.html, etc.
}

// ── Perfil / Nombre ──────────────────
function saveName() {
  const n = document.getElementById('name-input').value.trim() || 'Player';
  document.getElementById('player-name').textContent = n;
  closeModal('player-modal');
  showToast('¡Nombre guardado, ' + n);
}

function toggleSetting(id) {
  document.getElementById(id).classList.toggle('on');
}

let muted = true;
function toggleMute() {
  muted = !muted;
  document.getElementById('mute-btn').innerHTML = muted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-high"></i>';
  document.getElementById('mute-btn').style.color = 'white';
  showToast(muted ? 'Sonido desactivado' : 'Sonido activado');
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
buildDots();
setTimeout(updateCarousel, 50);
window.addEventListener('resize', updateCarousel);
