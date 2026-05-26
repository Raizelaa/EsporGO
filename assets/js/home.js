import { pageShellInit, $, escapeHTML } from './utils.js';
import { GAME_CATEGORIES, GAMES } from './data.js';
import { listenCollection } from './firebase-service.js';

pageShellInit();

const grid = $('#gameCategoryGrid');
if (grid) {
  grid.innerHTML = GAME_CATEGORIES.map(category => {
    const games = GAMES.filter(game => game.category === category);
    if (!games.length) return '';
    return `<article class="game-card"><div class="icon-box">${category === 'FPS' ? '🎯' : category === 'MOBA' ? '⚔️' : category === 'Mobil' ? '📱' : category === 'Roleplay' ? '🎭' : '🎮'}</div><h3>${escapeHTML(category)}</h3><p>${escapeHTML(games.slice(0, 5).map(game => game.name).join(', '))}${games.length > 5 ? '...' : ''}</p><div class="divider"></div><span class="badge-mini cyan">${games.length} oyun</span></article>`;
  }).join('');
}

listenCollection('publicPlayers', (players) => { const el = $('#statPlayers'); if (el) el.textContent = players.length; });
listenCollection('publicTeams', (teams) => { const el = $('#statTeams'); if (el) el.textContent = teams.length; });
