import { escapeHTML, initials, badge } from './utils.js';

export function playerCard(player) {
  const verified = player.verified ? '<span class="verify" title="Doğrulanmış oyuncu">✦</span>' : '';
  return `
    <article class="entity-card">
      <div class="entity-head">
        <div class="avatar">${escapeHTML(initials(player.playerName))}</div>
        <div class="entity-title">
          <h3>${escapeHTML(player.playerName || 'Oyuncu')}</h3>
          <div class="muted">${verified} ${escapeHTML(player.city || 'Şehir yok')} · ${escapeHTML(player.platform || 'Platform yok')}</div>
        </div>
      </div>
      <div class="card-meta">
        ${badge(player.game || 'Oyun yok', 'cyan')}
        ${badge(player.rank || 'Rank yok')}
        ${badge(player.gameRole || 'Rol yok', 'green')}
        ${badge(player.mic || 'Mikrofon bilgisi yok')}
      </div>
      <p>${escapeHTML(player.bio || 'Bu oyuncu henüz profil açıklaması eklemedi.')}</p>
      <div class="divider"></div>
      <div class="card-row">
        <span class="small-text">${escapeHTML(player.availability || 'Aktiflik yok')} · ${escapeHTML(player.teamStatus || 'Takım bilgisi yok')}</span>
        ${player.discord ? `<button class="btn small" data-discord="${escapeHTML(player.discord)}">Discord</button>` : ''}
      </div>
    </article>`;
}

export function teamCard(team) {
  const verified = team.verified ? '<span class="verify" title="Doğrulanmış takım">✦</span>' : '';
  return `
    <article class="entity-card">
      <div class="entity-head">
        <div class="avatar">${escapeHTML(initials(team.teamName))}</div>
        <div class="entity-title">
          <h3>${escapeHTML(team.teamName || 'Takım')}</h3>
          <div class="muted">${verified} ${escapeHTML(team.city || 'Fark etmez')} · ${escapeHTML(team.game || 'Oyun yok')}</div>
        </div>
      </div>
      <div class="card-meta">
        ${badge(team.wantedRole || 'Rol yok', 'cyan')}
        ${badge(`Min: ${team.minRank || 'Belirtilmedi'}`)}
        ${badge(team.trainingDays || 'Program yok', 'green')}
      </div>
      <p>${escapeHTML(team.description || 'Takım açıklaması eklenmemiş.')}</p>
      <div class="divider"></div>
      <div class="card-row">
        <span class="small-text">İletişim: ${escapeHTML(team.contact || 'Belirtilmedi')}</span>
        <button class="btn small primary" data-apply-team="${escapeHTML(team.id || team.requestId || '')}">Başvur</button>
      </div>
    </article>`;
}

export function tournamentCard(tournament) {
  return `
    <article class="entity-card">
      <div class="card-row">
        <div>
          <div class="kicker">${escapeHTML(tournament.game || 'Oyun')}</div>
          <h3>${escapeHTML(tournament.name || tournament.tournamentName || 'Turnuva')}</h3>
        </div>
        ${badge(tournament.status || 'Planlanıyor', tournament.status?.includes('Açık') ? 'green' : 'warn')}
      </div>
      <div class="card-meta">
        ${badge(tournament.format || 'Format yok', 'cyan')}
        ${badge(tournament.teams || tournament.teamCount || 'Takım sayısı yok')}
        ${badge(tournament.level || 'Seviye yok')}
        ${badge(tournament.prize || 'Ödül yok', 'green')}
      </div>
      <p>${escapeHTML(tournament.description || `Tarih: ${tournament.date || tournament.datePreference || 'Yakında'}`)}</p>
      <div class="divider"></div>
      <a class="btn small" href="./dashboard.html">Ön Başvuru Gönder</a>
    </article>`;
}

export function adminUserRow(user) {
  return `
    <div class="table-row">
      <div>
        <strong>${escapeHTML(user.playerName || user.email || user.id)}</strong>
        <p class="small-text">${escapeHTML(user.email || '')} · ${escapeHTML(user.city || '')} · ${escapeHTML(user.game || '')} · ${escapeHTML(user.rank || '')}</p>
        <div class="card-meta">${badge(user.status || 'pending', user.status === 'approved' ? 'green' : 'warn')}${badge(user.role || 'player')}${user.verified ? badge('Doğrulanmış', 'green') : ''}</div>
      </div>
      <div class="table-row-actions">
        <button class="btn success small" data-approve-player="${escapeHTML(user.uid || user.id)}">Onayla</button>
        <button class="btn warn small" data-toggle-verify="${escapeHTML(user.uid || user.id)}">Verify</button>
        <button class="btn danger small" data-reject-player="${escapeHTML(user.uid || user.id)}">Reddet</button>
      </div>
    </div>`;
}

export function adminPublicPlayerRow(player) {
  return `
    <div class="table-row">
      <div>
        <strong>${escapeHTML(player.playerName || player.id)}</strong>
        <p class="small-text">${escapeHTML(player.city || '')} · ${escapeHTML(player.game || '')} · ${escapeHTML(player.rank || '')} · ${escapeHTML(player.gameRole || '')}</p>
        <div class="card-meta">${player.verified ? badge('Doğrulanmış', 'green') : badge('Standart')}</div>
      </div>
      <div class="table-row-actions">
        <button class="btn warn small" data-toggle-public-verify="${escapeHTML(player.uid || player.id)}">Verify Değiştir</button>
        <button class="btn danger small" data-remove-player="${escapeHTML(player.uid || player.id)}">Yayından Kaldır</button>
      </div>
    </div>`;
}

export function adminTeamRow(team, pending = true) {
  return `
    <div class="table-row">
      <div>
        <strong>${escapeHTML(team.teamName || team.id)}</strong>
        <p class="small-text">${escapeHTML(team.game || '')} · ${escapeHTML(team.city || '')} · ${escapeHTML(team.wantedRole || '')} · Min: ${escapeHTML(team.minRank || '')}</p>
        <div class="card-meta">${badge(team.status || (pending ? 'pending' : 'published'), pending ? 'warn' : 'green')}${badge(team.contact || 'İletişim yok')}</div>
      </div>
      <div class="table-row-actions">
        ${pending ? `<button class="btn success small" data-approve-team="${escapeHTML(team.id)}">Onayla</button><button class="btn danger small" data-reject-team="${escapeHTML(team.id)}">Reddet</button>` : `<button class="btn danger small" data-remove-team="${escapeHTML(team.id)}">Yayından Kaldır</button>`}
      </div>
    </div>`;
}

export function adminTournamentRow(item) {
  return `
    <div class="table-row">
      <div>
        <strong>${escapeHTML(item.tournamentName || item.id)}</strong>
        <p class="small-text">${escapeHTML(item.game || '')} · ${escapeHTML(item.format || '')} · ${escapeHTML(item.teamCount || '')} · ${escapeHTML(item.datePreference || '')}</p>
        <div class="card-meta">${badge(item.status || 'pending', item.status === 'approved' ? 'green' : 'warn')}${badge(item.prize || 'Ödül yok')}</div>
      </div>
      <div class="table-row-actions">
        <button class="btn success small" data-tournament-status="approved" data-id="${escapeHTML(item.id)}">Onayla</button>
        <button class="btn warn small" data-tournament-status="review" data-id="${escapeHTML(item.id)}">İncelemede</button>
        <button class="btn danger small" data-tournament-status="rejected" data-id="${escapeHTML(item.id)}">Reddet</button>
      </div>
    </div>`;
}

export function adminReportRow(item) {
  return `
    <div class="table-row">
      <div>
        <strong>${escapeHTML(item.targetType || 'Rapor')} · ${escapeHTML(item.targetId || '')}</strong>
        <p class="small-text">${escapeHTML(item.reason || 'Sebep belirtilmedi.')}</p>
        <div class="card-meta">${badge(item.status || 'open', item.status === 'closed' ? 'green' : 'red')}</div>
      </div>
      <div class="table-row-actions">
        <button class="btn success small" data-close-report="${escapeHTML(item.id)}">Kapat</button>
      </div>
    </div>`;
}
