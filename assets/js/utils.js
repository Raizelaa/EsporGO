import { CITIES, GAMES, PLATFORMS, MIC_OPTIONS, TEAM_STATUS, AVAILABILITY } from './data.js';

export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

export function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[char]));
}

export function initials(name = 'EG') {
  return String(name).trim().split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || 'EG';
}

export function toast(message, type = 'info') {
  let el = $('#toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.dataset.type = type;
  el.classList.add('show');
  window.clearTimeout(window.__esporGoToast);
  window.__esporGoToast = window.setTimeout(() => el.classList.remove('show'), 4200);
}

export function setActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('[data-nav]').forEach(link => {
    const target = link.getAttribute('href') || '';
    const isActive = target.endsWith(current) || (current === '' && target.endsWith('index.html'));
    link.classList.toggle('active', isActive);
  });
}

export function setupMobileMenu() {
  const btn = $('#mobileMenuButton');
  const menu = $('#navLinks');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

export function fillSelect(select, items, placeholder = 'Seçiniz', keepValue = '') {
  if (!select) return;
  const value = keepValue || select.value;
  select.innerHTML = `<option value="">${escapeHTML(placeholder)}</option>` + items.map(item => `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`).join('');
  if (value && items.includes(value)) select.value = value;
}

export function fillCitySelect(select, placeholder = 'Şehir seç') { fillSelect(select, CITIES, placeholder); }
export function fillGameSelect(select, placeholder = 'Oyun seç') { fillSelect(select, GAMES.map(game => game.name), placeholder); }
export function fillPlatformSelect(select, placeholder = 'Platform seç') { fillSelect(select, PLATFORMS, placeholder); }
export function fillMicSelect(select, placeholder = 'Mikrofon durumu') { fillSelect(select, MIC_OPTIONS, placeholder); }
export function fillTeamStatusSelect(select, placeholder = 'Takım durumu') { fillSelect(select, TEAM_STATUS, placeholder); }
export function fillAvailabilitySelect(select, placeholder = 'Aktiflik') { fillSelect(select, AVAILABILITY, placeholder); }

export function getGame(name) { return GAMES.find(game => game.name === name); }

export function bindGameDependentSelects(gameSelect, rankSelect, roleSelect) {
  if (!gameSelect) return;
  const update = () => {
    const game = getGame(gameSelect.value);
    fillSelect(rankSelect, game?.ranks || [], game ? 'Rank seç' : 'Önce oyun seç');
    fillSelect(roleSelect, game?.roles || [], game ? 'Rol seç' : 'Önce oyun seç');
  };
  gameSelect.addEventListener('change', update);
  update();
}

export function toDateText(value) {
  if (!value) return 'Tarih yok';
  if (typeof value === 'string') return value;
  if (value?.toDate) return value.toDate().toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' });
  return 'Tarih yok';
}

export function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function requireFields(data, fields) {
  const missing = fields.filter(field => !String(data[field] || '').trim());
  return missing;
}

export function normalizeSearch(value = '') {
  return String(value).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function badge(text, tone = '') {
  return `<span class="badge-mini ${tone}">${escapeHTML(text)}</span>`;
}

export function pageShellInit() {
  setActiveNav();
  setupMobileMenu();
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}
