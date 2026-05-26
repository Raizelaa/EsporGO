import { pageShellInit, $, $$, fillCitySelect, fillGameSelect, fillPlatformSelect, fillSelect, bindGameDependentSelects, getGame, normalizeSearch, toast } from './utils.js';
import { DEMO_PLAYERS } from './data.js';
import { listenCollection } from './firebase-service.js';
import { playerCard } from './cards.js';

pageShellInit();
let allPlayers = [];
const els = {
  grid: $('#playersGrid'), count: $('#resultCount'), search: $('#searchInput'), game: $('#gameFilter'), city: $('#cityFilter'), rank: $('#rankFilter'), role: $('#roleFilter'), platform: $('#platformFilter')
};
fillGameSelect(els.game, 'Tüm oyunlar');
fillCitySelect(els.city, 'Tüm şehirler');
fillPlatformSelect(els.platform, 'Tüm platformlar');
bindGameDependentSelects(els.game, els.rank, els.role);
function applyFilters() {
  const q = normalizeSearch(els.search.value);
  const filtered = allPlayers.filter(p => {
    const haystack = normalizeSearch([p.playerName,p.city,p.game,p.rank,p.gameRole,p.platform,p.bio].join(' '));
    const game = !els.game.value || p.game === els.game.value;
    const city = !els.city.value || p.city === els.city.value;
    const rank = !els.rank.value || p.rank === els.rank.value;
    const role = !els.role.value || p.gameRole === els.role.value;
    const platform = !els.platform.value || p.platform === els.platform.value;
    return (!q || haystack.includes(q)) && game && city && rank && role && platform;
  });
  els.count.textContent = filtered.length;
  els.grid.innerHTML = filtered.length ? filtered.map(playerCard).join('') : '<div class="empty">Bu filtrelerle oyuncu bulunamadı.</div>';
}
['input','change'].forEach(evt => {
  [els.search, els.game, els.city, els.rank, els.role, els.platform].forEach(el => el?.addEventListener(evt, applyFilters));
});
$('#resetFilters')?.addEventListener('click', () => {
  els.search.value = ''; els.game.value = ''; els.city.value = ''; els.platform.value = '';
  fillSelect(els.rank, [], 'Önce oyun seç'); fillSelect(els.role, [], 'Önce oyun seç'); applyFilters();
});

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-discord]');
  if (!btn) return;
  navigator.clipboard?.writeText(btn.dataset.discord).then(() => toast('Discord kullanıcı adı kopyalandı.', 'success')).catch(() => toast(`Discord: ${btn.dataset.discord}`));
});

listenCollection('publicPlayers', (players) => {
  allPlayers = players.length ? players : DEMO_PLAYERS;
  applyFilters();
}, DEMO_PLAYERS);
