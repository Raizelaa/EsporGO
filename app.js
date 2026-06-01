import {
  CITIES,
  GAMES,
  GAME_CATEGORIES,
  SAMPLE_PLAYERS,
  SAMPLE_TEAMS,
  SAMPLE_TOURNAMENTS,
  SAMPLE_REFEREES,
  getRanksForGame,
  getRolesForGame,
  getGameAccent,
  computeMatchScore,
  normalizeText
} from './data.js';

import {
  bootFirebase,
  authState,
  registerPlayer,
  login,
  logout,
  getCurrentSession,
  getPublicCollection,
  createTeamRequest,
  applyTeam,
  createTournamentRequest,
  registerTournament,
  createRefereeRequest,
  createReport,
  updateUserProfile,
  getNotifications,
  getMyItems,
  getAdminQueues,
  adminApproveUser,
  adminApproveTeam,
  adminApproveTournament,
  adminApproveReferee,
  adminReject,
  adminCloseReport,
  toggleFavorite
} from './firebase-service.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const page = document.body.dataset.page;
let currentUser = null;
let currentProfile = null;

const state = {
  players: SAMPLE_PLAYERS,
  teams: SAMPLE_TEAMS,
  tournaments: SAMPLE_TOURNAMENTS,
  referees: SAMPLE_REFEREES,
  firebaseReady: false
};

function toast(message, type = 'success') {
  let region = $('.toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    document.body.appendChild(region);
  }
  const item = document.createElement('div');
  item.className = `toast ${type}`;
  item.textContent = message;
  region.appendChild(item);
  setTimeout(() => item.remove(), 4800);
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatBool(value) {
  return value ? 'Var' : 'Yok';
}

function initials(name = 'EG') {
  return String(name).split(' ').map((word) => word[0]).join('').slice(0, 2).toLocaleUpperCase('tr-TR');
}

function fillSelect(selector, options, placeholder = 'Seç') {
  const nodes = typeof selector === 'string' ? $$(selector) : [selector];
  nodes.filter(Boolean).forEach((select) => {
    const current = select.value;
    select.innerHTML = `<option value="">${placeholder}</option>` + options.map((option) => {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? option : option.label;
      return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
    }).join('');
    if (current) select.value = current;
  });
}

function bindGameRankRole(gameSelector, rankSelector, roleSelector) {
  const game = $(gameSelector);
  const rank = $(rankSelector);
  const role = $(roleSelector);
  if (!game) return;
  const update = () => {
    const selected = game.value || GAMES[0].name;
    if (rank) fillSelect(rank, getRanksForGame(selected), 'Rank seç');
    if (role) fillSelect(role, getRolesForGame(selected), 'Rol seç');
  };
  game.addEventListener('change', update);
  update();
}

function populateGlobalSelects() {
  fillSelect('[data-cities]', CITIES, 'Şehir seç');
  fillSelect('[data-games]', GAMES.map((game) => game.name), 'Oyun seç');
  fillSelect('[data-categories]', GAME_CATEGORIES.map((item) => ({ value: item.id, label: `${item.icon} ${item.name}` })), 'Kategori seç');
  fillSelect('[data-platforms]', ['PC', 'Mobile', 'Console', 'PC + Mobile', 'PC + Console'], 'Platform seç');
  bindGameRankRole('#registerGame', '#registerRank', '#registerRole');
  bindGameRankRole('#profileGame', '#profileRank', '#profileRole');
  bindGameRankRole('#teamGame', '#teamMinRank', '#teamRole');
}

function setupNavigation() {
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach((link) => {
    const file = link.getAttribute('href');
    if (file === currentFile || (currentFile === '' && file === 'index.html')) link.classList.add('active');
  });
  $('.mobile-toggle')?.addEventListener('click', () => $('.nav-links')?.classList.toggle('open'));
  $('#logoutBtn')?.addEventListener('click', async () => {
    try {
      await logout();
      toast('Çıkış yapıldı.');
      location.href = 'index.html';
    } catch (error) {
      toast(error.message, 'error');
    }
  });
}

function updateAuthUI(user, profile) {
  currentUser = user;
  currentProfile = profile;
  $$('[data-auth="out"]').forEach((el) => el.style.display = user ? 'none' : 'inline-flex');
  $$('[data-auth="in"]').forEach((el) => el.style.display = user ? 'inline-flex' : 'none');
  $$('[data-user-name]').forEach((el) => el.textContent = profile?.gamerTag || user?.email || 'Oyuncu');
}

async function hydratePublicData() {
  const ctx = await bootFirebase();
  state.firebaseReady = ctx.ready;
  if (!ctx.ready) return;
  const [players, teams, tournaments, referees] = await Promise.all([
    getPublicCollection('publicPlayers', SAMPLE_PLAYERS),
    getPublicCollection('publicTeams', SAMPLE_TEAMS),
    getPublicCollection('publicTournaments', SAMPLE_TOURNAMENTS),
    getPublicCollection('publicReferees', SAMPLE_REFEREES)
  ]);
  state.players = players.length ? players : SAMPLE_PLAYERS;
  state.teams = teams.length ? teams : SAMPLE_TEAMS;
  state.tournaments = tournaments.length ? tournaments : SAMPLE_TOURNAMENTS;
  state.referees = referees.length ? referees : SAMPLE_REFEREES;
}

function playerCard(player) {
  const score = computeMatchScore(player, currentProfile || {});
  const accent = getGameAccent(player.game);
  return `
    <article class="card player-card" style="--accent:${accent}">
      <div class="card-top">
        <div class="avatar">${escapeHtml(initials(player.gamerTag))}</div>
        <div class="badges">
          ${player.verified ? '<span class="badge success">✓ Onaylı</span>' : '<span class="badge">Kontrol edildi</span>'}
          ${player.lookingForTeam ? '<span class="badge brand">Takım arıyor</span>' : ''}
        </div>
      </div>
      <h3>${escapeHtml(player.gamerTag)}</h3>
      <p>${escapeHtml(player.bio || 'Profesyonel profil açıklaması henüz eklenmedi.')}</p>
      <div class="meta-list">
        <div><span>Oyun</span><b>${escapeHtml(player.game)}</b></div>
        <div><span>Rank / Rol</span><b>${escapeHtml(player.rank)} · ${escapeHtml(player.role || player.roleInGame || 'Flex')}</b></div>
        <div><span>Şehir</span><b>${escapeHtml(player.city)}</b></div>
        <div><span>Mikrofon</span><b>${formatBool(player.mic)}</b></div>
        <div><span>Aktiflik</span><b>${escapeHtml(player.activeHours || 'Belirtilmedi')}</b></div>
      </div>
      <div class="badges">
        <span class="badge warn">Uyum ${score}%</span>
        <span class="badge">Güven ${player.trustScore || 70}/100</span>
        ${player.platform ? `<span class="badge">${escapeHtml(player.platform)}</span>` : ''}
      </div>
      <div class="progress" aria-label="Uyum skoru"><i style="width:${score}%"></i></div>
      <div class="hero-actions">
        <button class="btn small primary" data-favorite="player" data-id="${escapeHtml(player.id)}" data-name="${escapeHtml(player.gamerTag)}">Favorile</button>
        <button class="btn small ghost" data-report="player" data-id="${escapeHtml(player.id)}">Rapor et</button>
      </div>
    </article>`;
}

function teamCard(team) {
  return `
    <article class="card team-card">
      <div class="card-top">
        <div class="avatar">${escapeHtml(initials(team.teamName))}</div>
        <div class="badges">
          ${team.verified ? '<span class="badge success">✓ Doğrulanmış</span>' : '<span class="badge brand">Başvuru açık</span>'}
        </div>
      </div>
      <h3>${escapeHtml(team.teamName)}</h3>
      <p>${escapeHtml(team.description || 'Takım açıklaması eklenmedi.')}</p>
      <div class="meta-list">
        <div><span>Oyun</span><b>${escapeHtml(team.game)}</b></div>
        <div><span>Eksik roller</span><b>${escapeHtml((team.neededRoles || []).join(', ') || team.neededRole || 'Belirtilmedi')}</b></div>
        <div><span>Minimum rank</span><b>${escapeHtml(team.minRank || 'Serbest')}</b></div>
        <div><span>Antrenman</span><b>${escapeHtml(team.trainingDays || 'Belirtilmedi')}</b></div>
        <div><span>Mikrofon</span><b>${team.micRequired ? 'Zorunlu' : 'Tercihe bağlı'}</b></div>
      </div>
      <div class="badges"><span class="badge warn">${team.applications || 0} başvuru</span><span class="badge">Güven ${team.trustScore || 80}/100</span></div>
      <div class="hero-actions">
        <button class="btn small primary" data-apply-team="${escapeHtml(team.id)}">Başvur</button>
        <button class="btn small ghost" data-favorite="team" data-id="${escapeHtml(team.id)}" data-name="${escapeHtml(team.teamName)}">Favorile</button>
      </div>
    </article>`;
}

function tournamentCard(tournament) {
  const progress = Math.min(100, Math.round(((tournament.registered || 0) / (tournament.teamLimit || 1)) * 100));
  return `
    <article class="card tournament-card">
      <div class="card-top">
        <div class="avatar">🏆</div>
        <span class="badge ${tournament.status === 'Kayıt Açık' ? 'success' : 'brand'}">${escapeHtml(tournament.status || 'Yakında')}</span>
      </div>
      <h3>${escapeHtml(tournament.name)}</h3>
      <p>${escapeHtml(tournament.description || 'Turnuva açıklaması eklenmedi.')}</p>
      <div class="meta-list">
        <div><span>Oyun / Format</span><b>${escapeHtml(tournament.game)} · ${escapeHtml(tournament.format)}</b></div>
        <div><span>Tarih</span><b>${escapeHtml(tournament.startDate)} - ${escapeHtml(tournament.endDate || tournament.startDate)}</b></div>
        <div><span>Ödül</span><b>${escapeHtml(tournament.prize || 'Duyurulacak')}</b></div>
        <div><span>Hakem ihtiyacı</span><b>${escapeHtml(tournament.refereeNeed || 0)} hakem</b></div>
      </div>
      <div class="badges"><span class="badge warn">${tournament.registered || 0}/${tournament.teamLimit || '?'} kayıt</span></div>
      <div class="progress"><i style="width:${progress}%"></i></div>
      <div class="hero-actions">
        <button class="btn small primary" data-register-tournament="${escapeHtml(tournament.id)}">Kayıt ol</button>
        <button class="btn small ghost" data-favorite="tournament" data-id="${escapeHtml(tournament.id)}" data-name="${escapeHtml(tournament.name)}">Favorile</button>
      </div>
    </article>`;
}

function refereeCard(referee) {
  return `
    <article class="card referee-card">
      <div class="card-top">
        <div class="avatar">⚖️</div>
        ${referee.verified ? '<span class="badge success">Onaylı hakem</span>' : '<span class="badge">Hakem</span>'}
      </div>
      <h3>${escapeHtml(referee.refereeName)}</h3>
      <p>${escapeHtml(referee.bio || 'Hakem profili açıklaması yok.')}</p>
      <div class="meta-list">
        <div><span>Oyunlar</span><b>${escapeHtml((referee.games || []).join(', '))}</b></div>
        <div><span>Deneyim</span><b>${escapeHtml(referee.experience || 'Belirtilmedi')}</b></div>
        <div><span>Maç sayısı</span><b>${escapeHtml(referee.matches || 0)}</b></div>
        <div><span>Müsaitlik</span><b>${escapeHtml(referee.availability || 'Belirtilmedi')}</b></div>
      </div>
      <div class="badges"><span class="badge warn">${escapeHtml(referee.level || 'Hakem')}</span><span class="badge">Güven ${referee.trustScore || 85}/100</span></div>
      <div class="hero-actions"><button class="btn small ghost" data-favorite="referee" data-id="${escapeHtml(referee.id)}" data-name="${escapeHtml(referee.refereeName)}">Favorile</button></div>
    </article>`;
}

function attachCommonCardActions() {
  $$('[data-favorite]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await toggleFavorite(button.dataset.favorite, button.dataset.id, button.dataset.name);
        toast('Favorilere eklendi.');
      } catch (error) { toast(error.message, 'error'); }
    });
  });

  $$('[data-report]').forEach((button) => {
    button.addEventListener('click', async () => {
      const reason = prompt('Rapor sebebini kısa yaz:');
      if (!reason) return;
      try {
        await createReport({ targetType: button.dataset.report, targetId: button.dataset.id, reason });
        toast('Rapor admin paneline gönderildi.');
      } catch (error) { toast(error.message, 'error'); }
    });
  });

  $$('[data-apply-team]').forEach((button) => {
    button.addEventListener('click', async () => {
      const message = prompt('Takıma başvuru mesajın:');
      if (!message) return;
      try {
        await applyTeam(button.dataset.applyTeam, message);
        toast('Takım başvurun gönderildi.');
      } catch (error) { toast(error.message, 'error'); }
    });
  });

  $$('[data-register-tournament]').forEach((button) => {
    button.addEventListener('click', async () => {
      const name = prompt('Takım/oyuncu adını yaz:');
      if (!name) return;
      try {
        await registerTournament(button.dataset.registerTournament, { entryName: name });
        toast('Turnuva kayıt talebin gönderildi.');
      } catch (error) { toast(error.message, 'error'); }
    });
  });
}

function filterItems(items, filters) {
  return items.filter((item) => {
    const search = normalizeText(filters.search || '');
    if (filters.game && item.game !== filters.game && !(item.games || []).includes(filters.game)) return false;
    if (filters.city && item.city !== filters.city) return false;
    if (filters.platform && item.platform && item.platform !== filters.platform) return false;
    if (filters.mic === 'true' && !item.mic && !item.micRequired) return false;
    if (filters.category) {
      const game = GAMES.find((entry) => entry.name === item.game);
      if (game?.category !== filters.category) return false;
    }
    if (search) {
      const haystack = normalizeText(Object.values(item).flat().join(' '));
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

function initHome() {
  const stats = {
    players: state.players.length,
    teams: state.teams.length,
    tournaments: state.tournaments.length,
    referees: state.referees.length,
    games: GAMES.length
  };
  Object.entries(stats).forEach(([key, value]) => {
    $$(`[data-stat="${key}"]`).forEach((node) => node.textContent = value + '+');
  });

  const gameGrid = $('#popularGames');
  if (gameGrid) {
    gameGrid.innerHTML = GAMES.slice(0, 12).map((game) => `
      <article class="card">
        <div class="card-top"><div class="avatar" style="background:${game.accent}22;border-color:${game.accent}55">${GAME_CATEGORIES.find(c => c.id === game.category)?.icon || '🎮'}</div><span class="badge">${escapeHtml(game.category)}</span></div>
        <h3>${escapeHtml(game.name)}</h3>
        <p>${escapeHtml(game.roles.slice(0, 4).join(' · '))}</p>
        <div class="badges"><span class="badge brand">${game.ranks.length} rank</span><span class="badge">${game.platform.join(' / ')}</span></div>
      </article>
    `).join('');
  }

  const latestPlayers = $('#latestPlayers');
  if (latestPlayers) latestPlayers.innerHTML = state.players.slice(0, 3).map(playerCard).join('');
  const latestTeams = $('#latestTeams');
  if (latestTeams) latestTeams.innerHTML = state.teams.slice(0, 3).map(teamCard).join('');
  const latestTournaments = $('#latestTournaments');
  if (latestTournaments) latestTournaments.innerHTML = state.tournaments.slice(0, 3).map(tournamentCard).join('');
  attachCommonCardActions();
}

function initPlayers() {
  const grid = $('#playersGrid');
  const count = $('#resultCount');
  const render = () => {
    const filters = Object.fromEntries(new FormData($('#playerFilters')).entries());
    const items = filterItems(state.players, filters);
    count.textContent = `${items.length} oyuncu bulundu`;
    grid.innerHTML = items.length ? items.map(playerCard).join('') : '<div class="empty-state">Uygun oyuncu bulunamadı. Filtreleri genişlet veya ilk profili sen oluştur.</div>';
    attachCommonCardActions();
  };
  $('#playerFilters')?.addEventListener('submit', (event) => { event.preventDefault(); render(); });
  $('#clearPlayerFilters')?.addEventListener('click', () => { $('#playerFilters').reset(); render(); });
  render();
}

function initTeams() {
  const grid = $('#teamsGrid');
  const render = () => {
    const filters = Object.fromEntries(new FormData($('#teamFilters')).entries());
    const items = filterItems(state.teams, filters);
    grid.innerHTML = items.length ? items.map(teamCard).join('') : '<div class="empty-state">Açık takım ilanı bulunamadı. Takım ilanını sen oluştur.</div>';
    attachCommonCardActions();
  };
  $('#teamFilters')?.addEventListener('submit', (event) => { event.preventDefault(); render(); });
  $('#clearTeamFilters')?.addEventListener('click', () => { $('#teamFilters').reset(); render(); });
  $('#teamCreateForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    data.neededRoles = String(data.neededRoles || '').split(',').map((x) => x.trim()).filter(Boolean);
    data.micRequired = Boolean(data.micRequired);
    try {
      await createTeamRequest(data);
      event.currentTarget.reset();
      toast('Takım ilanı admin onayına gönderildi.');
    } catch (error) { toast(error.message, 'error'); }
  });
  render();
}

function initTournaments() {
  const grid = $('#tournamentsGrid');
  const render = () => {
    const filters = Object.fromEntries(new FormData($('#tournamentFilters')).entries());
    const items = filterItems(state.tournaments, filters).filter((item) => !filters.status || item.status === filters.status);
    grid.innerHTML = items.length ? items.map(tournamentCard).join('') : '<div class="empty-state">Bu filtrede turnuva bulunamadı. Yeni turnuva talebi oluşturabilirsin.</div>';
    attachCommonCardActions();
  };
  $('#tournamentFilters')?.addEventListener('submit', (event) => { event.preventDefault(); render(); });
  $('#clearTournamentFilters')?.addEventListener('click', () => { $('#tournamentFilters').reset(); render(); });
  $('#tournamentCreateForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await createTournamentRequest(data);
      event.currentTarget.reset();
      toast('Turnuva talebin admin paneline gönderildi.');
    } catch (error) { toast(error.message, 'error'); }
  });
  render();
}

function initReferees() {
  const grid = $('#refereesGrid');
  const render = () => {
    const filters = Object.fromEntries(new FormData($('#refereeFilters')).entries());
    const items = filterItems(state.referees, filters);
    grid.innerHTML = items.length ? items.map(refereeCard).join('') : '<div class="empty-state">Uygun hakem bulunamadı. Hakem başvurusu oluştur.</div>';
    attachCommonCardActions();
  };
  $('#refereeFilters')?.addEventListener('submit', (event) => { event.preventDefault(); render(); });
  $('#refereeCreateForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    data.games = String(data.games || '').split(',').map((x) => x.trim()).filter(Boolean);
    try {
      await createRefereeRequest(data);
      event.currentTarget.reset();
      toast('Hakem başvurun admin onayına gönderildi.');
    } catch (error) { toast(error.message, 'error'); }
  });
  render();
}

function initLogin() {
  const loginForm = $('#loginForm');
  const registerForm = $('#registerForm');
  const stepper = $$('.step');
  const steps = $$('.form-step');
  let step = 0;
  const showStep = (index) => {
    step = Math.max(0, Math.min(steps.length - 1, index));
    steps.forEach((panel, i) => panel.classList.toggle('active', i === step));
    stepper.forEach((bar, i) => bar.classList.toggle('active', i <= step));
    $('#prevStep')?.toggleAttribute('disabled', step === 0);
    $('#nextStep').style.display = step === steps.length - 1 ? 'none' : 'inline-flex';
    $('#submitRegister').style.display = step === steps.length - 1 ? 'inline-flex' : 'none';
  };

  $$('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.tab-btn').forEach((item) => item.classList.remove('active'));
      $$('.tab-panel').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      $(`#${button.dataset.tab}`)?.classList.add('active');
    });
  });

  $('#nextStep')?.addEventListener('click', () => showStep(step + 1));
  $('#prevStep')?.addEventListener('click', () => showStep(step - 1));
  showStep(0);

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    try {
      await login(data.email, data.password);
      toast('Giriş başarılı. Panele yönlendiriliyorsun.');
      setTimeout(() => location.href = 'dashboard.html', 600);
    } catch (error) { toast(error.message, 'error'); }
  });

  registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(registerForm).entries());
    if (data.password !== data.passwordRepeat) {
      toast('Şifreler aynı değil.', 'error');
      return;
    }
    data.mic = Boolean(data.mic);
    data.lookingForTeam = Boolean(data.lookingForTeam);
    data.lookingForTournament = Boolean(data.lookingForTournament);
    data.publicProfile = Boolean(data.publicProfile);
    try {
      await registerPlayer(data);
      toast('Kayıt tamamlandı. Profilin admin onayı bekliyor.');
      setTimeout(() => location.href = 'dashboard.html', 800);
    } catch (error) { toast(error.message, 'error'); }
  });
}

async function initDashboard() {
  const session = await getCurrentSession();
  const gate = $('#dashboardGate');
  const content = $('#dashboardContent');
  if (!session.user) {
    gate.innerHTML = '<div class="empty-state"><h2>Panele girmek için giriş yapmalısın.</h2><p>Profilini, başvurularını ve bildirimlerini yönetmek için hesabına giriş yap.</p><a class="btn primary" href="login.html">Giriş yap</a></div>';
    content.style.display = 'none';
    return;
  }

  content.style.display = 'grid';
  gate.innerHTML = '';
  const profile = session.profile || {};
  $('#profileSummary').innerHTML = `
    <div class="card-top"><div class="avatar">${escapeHtml(initials(profile.gamerTag || session.user.email))}</div><span class="badge ${profile.status === 'approved' ? 'success' : 'warn'}">${escapeHtml(profile.status || 'pending')}</span></div>
    <h3>${escapeHtml(profile.gamerTag || session.user.email)}</h3>
    <p>${escapeHtml(profile.bio || 'Profil açıklaması eklenmedi.')}</p>
    <div class="meta-list">
      <div><span>Oyun</span><b>${escapeHtml(profile.game || '-')}</b></div>
      <div><span>Rank</span><b>${escapeHtml(profile.rank || '-')}</b></div>
      <div><span>Şehir</span><b>${escapeHtml(profile.city || '-')}</b></div>
      <div><span>Güven puanı</span><b>${escapeHtml(profile.trustScore || 70)}/100</b></div>
    </div>`;

  const form = $('#profileForm');
  ['gamerTag','discord','city','game','rank','roleInGame','platform','activeHours','bio'].forEach((name) => {
    const field = form?.elements[name];
    if (field && profile[name]) field.value = profile[name];
  });
  bindGameRankRole('#profileGame', '#profileRank', '#profileRole');
  if (profile.rank) $('#profileRank').value = profile.rank;
  if (profile.roleInGame) $('#profileRole').value = profile.roleInGame;

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await updateUserProfile(session.user.uid, data);
      toast('Profil güncellendi.');
    } catch (error) { toast(error.message, 'error'); }
  });

  const [notifications, teamRequests, tournamentRequests, refereeRequests] = await Promise.all([
    getNotifications().catch(() => []),
    getMyItems('teamRequests').catch(() => []),
    getMyItems('tournamentRequests').catch(() => []),
    getMyItems('refereeRequests').catch(() => [])
  ]);
  $('#notificationsList').innerHTML = notifications.length ? notifications.map((item) => `<div class="card"><span class="badge brand">${escapeHtml(item.type || 'system')}</span><p>${escapeHtml(item.message)}</p></div>`).join('') : '<div class="empty-state">Henüz bildirim yok.</div>';
  $('#myRequests').innerHTML = [...teamRequests, ...tournamentRequests, ...refereeRequests].length
    ? [...teamRequests, ...tournamentRequests, ...refereeRequests].map((item) => `<div class="card"><h3>${escapeHtml(item.teamName || item.name || item.refereeName || 'Başvuru')}</h3><p>${escapeHtml(item.status || 'pending')}</p></div>`).join('')
    : '<div class="empty-state">Henüz başvurun yok.</div>';
}

async function initAdmin() {
  const gate = $('#adminGate');
  const content = $('#adminContent');
  const session = await getCurrentSession();
  if (!session.user || session.profile?.role !== 'admin') {
    gate.innerHTML = '<div class="empty-state"><h2>Gizli admin paneli</h2><p>Bu alana sadece role: admin olan hesaplar girebilir.</p><a class="btn primary" href="login.html">Admin hesabıyla giriş yap</a></div>';
    content.style.display = 'none';
    return;
  }
  gate.innerHTML = '';
  content.style.display = 'grid';

  async function refresh() {
    const queues = await getAdminQueues();
    renderAdminList('pendingUsers', queues.users, 'Oyuncu', async (item, action) => {
      if (action === 'approve') await adminApproveUser(item.id, item);
      else await adminReject('users', item.id, prompt('Reddetme sebebi:', 'Profil bilgileri eksik.') || 'Reddedildi.');
    });
    renderAdminList('pendingTeams', queues.teams, 'Takım', async (item, action) => {
      if (action === 'approve') await adminApproveTeam(item);
      else await adminReject('teamRequests', item.id, prompt('Reddetme sebebi:', 'Takım bilgileri eksik.') || 'Reddedildi.');
    });
    renderAdminList('pendingTournaments', queues.tournaments, 'Turnuva', async (item, action) => {
      if (action === 'approve') await adminApproveTournament(item);
      else await adminReject('tournamentRequests', item.id, prompt('Reddetme sebebi:', 'Turnuva bilgileri eksik.') || 'Reddedildi.');
    });
    renderAdminList('pendingReferees', queues.referees, 'Hakem', async (item, action) => {
      if (action === 'approve') await adminApproveReferee(item);
      else await adminReject('refereeRequests', item.id, prompt('Reddetme sebebi:', 'Hakem bilgileri eksik.') || 'Reddedildi.');
    });
    renderReportList(queues.reports);
    $('#adminLogs').innerHTML = queues.logs.length ? queues.logs.slice(-20).reverse().map((log) => `<div class="card"><span class="badge">${escapeHtml(log.action)}</span><p>${escapeHtml(log.target || '')}</p><small>${escapeHtml(log.adminEmail || '')}</small></div>`).join('') : '<div class="empty-state">Henüz admin işlem kaydı yok.</div>';
  }

  function renderAdminList(targetId, items, label, handler) {
    const target = $(`#${targetId}`);
    target.innerHTML = items.length ? items.map((item, index) => `
      <div class="card" data-admin-item="${targetId}-${index}">
        <div class="card-top"><div><span class="badge warn">Bekliyor</span><h3>${escapeHtml(item.gamerTag || item.teamName || item.name || item.refereeName || label)}</h3></div><span class="badge">${escapeHtml(item.game || item.city || '')}</span></div>
        <p>${escapeHtml(item.bio || item.description || item.reason || 'Detay bilgisi yok.')}</p>
        <div class="hero-actions"><button class="btn small success" data-action="approve">Onayla</button><button class="btn small danger" data-action="reject">Reddet</button></div>
      </div>`).join('') : `<div class="empty-state">Bekleyen ${label.toLocaleLowerCase('tr-TR')} yok.</div>`;
    items.forEach((item, index) => {
      const node = $(`[data-admin-item="${targetId}-${index}"]`, target);
      node?.querySelector('[data-action="approve"]')?.addEventListener('click', async () => { await handler(item, 'approve'); toast('Onaylandı.'); refresh(); });
      node?.querySelector('[data-action="reject"]')?.addEventListener('click', async () => { await handler(item, 'reject'); toast('Reddedildi.'); refresh(); });
    });
  }

  function renderReportList(items) {
    const target = $('#openReports');
    target.innerHTML = items.length ? items.map((item, index) => `
      <div class="card" data-report-item="${index}">
        <div class="card-top"><span class="badge danger">Rapor</span><span class="badge">${escapeHtml(item.targetType || '')}</span></div>
        <h3>${escapeHtml(item.reason || 'Rapor sebebi yok')}</h3>
        <p>Hedef: ${escapeHtml(item.targetId || '-')}</p>
        <button class="btn small primary" data-close-report="${escapeHtml(item.id)}">Kapat</button>
      </div>`).join('') : '<div class="empty-state">Açık rapor yok.</div>';
    $$('[data-close-report]', target).forEach((button) => button.addEventListener('click', async () => {
      await adminCloseReport(button.dataset.closeReport, prompt('İşlem notu:', 'Kontrol edildi.') || 'Kontrol edildi.');
      toast('Rapor kapatıldı.');
      refresh();
    }));
  }

  $$('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.tab-btn').forEach((item) => item.classList.remove('active'));
      $$('.tab-panel').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      $(`#${button.dataset.tab}`)?.classList.add('active');
    });
  });
  refresh().catch((error) => toast(error.message, 'error'));
}

async function boot() {
  setupNavigation();
  populateGlobalSelects();
  await hydratePublicData();
  authState((user, profile) => updateAuthUI(user, profile));

  if (page === 'home') initHome();
  if (page === 'players') initPlayers();
  if (page === 'teams') initTeams();
  if (page === 'tournaments') initTournaments();
  if (page === 'referees') initReferees();
  if (page === 'login') initLogin();
  if (page === 'dashboard') initDashboard();
  if (page === 'admin') initAdmin();

  document.body.classList.add('is-ready');
  if (!state.firebaseReady) {
    console.info('EsporGO Firebase fallback:', window.ESPORGO_FIREBASE_REASON);
  }
}

boot().catch((error) => {
  console.error(error);
  toast(error.message || 'Beklenmeyen hata oluştu.', 'error');
});
