import { pageShellInit, $, fillCitySelect, fillGameSelect, fillSelect, bindGameDependentSelects, normalizeSearch, toast } from './utils.js';
import { DEMO_TEAMS } from './data.js';
import { listenAuth, listenCollection, createTeamApplication } from './firebase-service.js';
import { teamCard } from './cards.js';

pageShellInit();
let currentUser = null;
let allTeams = [];
const els = { grid: $('#teamsGrid'), count: $('#resultCount'), search: $('#searchInput'), game: $('#gameFilter'), city: $('#cityFilter'), rank: $('#rankFilter'), role: $('#roleFilter') };
fillGameSelect(els.game, 'Tüm oyunlar');
fillCitySelect(els.city, 'Tüm şehirler');
bindGameDependentSelects(els.game, els.rank, els.role);
listenAuth(user => currentUser = user);
function applyFilters() {
  const q = normalizeSearch(els.search.value);
  const filtered = allTeams.filter(t => {
    const haystack = normalizeSearch([t.teamName,t.city,t.game,t.wantedRole,t.minRank,t.description].join(' '));
    return (!q || haystack.includes(q)) && (!els.game.value || t.game === els.game.value) && (!els.city.value || t.city === els.city.value || t.city === 'Fark etmez') && (!els.rank.value || t.minRank === els.rank.value) && (!els.role.value || t.wantedRole === els.role.value);
  });
  els.count.textContent = filtered.length;
  els.grid.innerHTML = filtered.length ? filtered.map(teamCard).join('') : '<div class="empty">Bu filtrelerle takım ilanı bulunamadı.</div>';
}
['input','change'].forEach(evt => [els.search,els.game,els.city,els.rank,els.role].forEach(el => el?.addEventListener(evt, applyFilters)));
$('#resetFilters')?.addEventListener('click', () => { els.search.value=''; els.game.value=''; els.city.value=''; fillSelect(els.rank, [], 'Önce oyun seç'); fillSelect(els.role, [], 'Önce oyun seç'); applyFilters(); });
document.addEventListener('click', async (event) => {
  const btn = event.target.closest('[data-apply-team]');
  if (!btn) return;
  const team = allTeams.find(t => (t.id || t.requestId) === btn.dataset.applyTeam);
  if (!currentUser) { toast('Takıma başvurmak için giriş yapmalısın.', 'error'); location.href = './login.html'; return; }
  try { await createTeamApplication(currentUser.uid, team, 'Takımınıza EsporGO üzerinden başvurmak istiyorum.'); toast('Başvurun gönderildi.', 'success'); }
  catch (error) { toast(error.message, 'error'); }
});
listenCollection('publicTeams', (teams) => { allTeams = teams.length ? teams : DEMO_TEAMS; applyFilters(); }, DEMO_TEAMS);
