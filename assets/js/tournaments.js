import { pageShellInit, $ } from './utils.js';
import { DEMO_TOURNAMENTS } from './data.js';
import { tournamentCard } from './cards.js';

pageShellInit();
const grid = $('#tournamentGrid');
if (grid) grid.innerHTML = DEMO_TOURNAMENTS.map(tournamentCard).join('');
