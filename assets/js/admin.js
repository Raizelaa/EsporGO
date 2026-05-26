import { $, $$, toast } from './utils.js';
import {
  login,
  logout,
  listenAuth,
  getUserProfile,
  listenCollection,
  adminApprovePlayer,
  adminRejectPlayer,
  adminToggleVerifyPlayer,
  adminRemovePublicPlayer,
  adminApproveTeam,
  adminRejectTeam,
  adminRemovePublicTeam,
  adminUpdateTournamentRequest,
  adminCloseReport
} from './firebase-service.js';
import { adminUserRow, adminPublicPlayerRow, adminTeamRow, adminTournamentRow, adminReportRow } from './cards.js';

let isAdmin = false;
let users = [];
let publicPlayers = [];
let teamRequests = [];
let publicTeams = [];
let tournamentRequests = [];
let reports = [];
let unsubscribers = [];

function activateTab(id) {
  $$('.admin-section').forEach(section => section.classList.toggle('active', section.id === id));
  $$('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === id));
}
$$('[data-tab]').forEach(button => button.addEventListener('click', () => activateTab(button.dataset.tab)));

function empty(text) { return `<div class="empty">${text}</div>`; }
function render() {
  const pendingPlayers = users.filter(user => user.status === 'pending');
  const pendingTeams = teamRequests.filter(team => team.status === 'pending');
  const openReports = reports.filter(report => report.status !== 'closed');
  $('#statPendingPlayers').textContent = pendingPlayers.length;
  $('#statPublicPlayers').textContent = publicPlayers.length;
  $('#statPendingTeams').textContent = pendingTeams.length;
  $('#statReports').textContent = openReports.length;
  $('#pendingPlayersList').innerHTML = pendingPlayers.length ? pendingPlayers.map(adminUserRow).join('') : empty('Bekleyen oyuncu başvurusu yok.');
  $('#publicPlayersList').innerHTML = publicPlayers.length ? publicPlayers.map(adminPublicPlayerRow).join('') : empty('Yayında oyuncu yok.');
  $('#pendingTeamsList').innerHTML = pendingTeams.length ? pendingTeams.map(team => adminTeamRow(team, true)).join('') : empty('Bekleyen takım başvurusu yok.');
  $('#publicTeamsList').innerHTML = publicTeams.length ? publicTeams.map(team => adminTeamRow(team, false)).join('') : empty('Yayında takım yok.');
  $('#tournamentRequestsList').innerHTML = tournamentRequests.length ? tournamentRequests.map(adminTournamentRow).join('') : empty('Turnuva talebi yok.');
  $('#reportsList').innerHTML = reports.length ? reports.map(adminReportRow).join('') : empty('Rapor yok.');
}

function startAdminListeners() {
  unsubscribers.forEach(fn => fn());
  unsubscribers = [
    listenCollection('users', data => { users = data; render(); }),
    listenCollection('publicPlayers', data => { publicPlayers = data; render(); }),
    listenCollection('teamRequests', data => { teamRequests = data; render(); }),
    listenCollection('publicTeams', data => { publicTeams = data; render(); }),
    listenCollection('tournamentRequests', data => { tournamentRequests = data; render(); }),
    listenCollection('reports', data => { reports = data; render(); })
  ];
}

async function verifyAdmin(user) {
  if (!user) {
    isAdmin = false;
    $('#adminStatus').textContent = 'Giriş gerekli';
    $('#adminStatus').className = 'badge-mini warn';
    activateTab('adminLogin');
    return;
  }
  try {
    const profile = await getUserProfile(user.uid);
    isAdmin = profile?.role === 'admin';
    if (!isAdmin) {
      $('#adminStatus').textContent = 'Yetkisiz hesap';
      $('#adminStatus').className = 'badge-mini red';
      toast('Bu hesap admin yetkisine sahip değil.', 'error');
      activateTab('adminLogin');
      return;
    }
    $('#adminStatus').textContent = 'Admin aktif';
    $('#adminStatus').className = 'badge-mini green';
    activateTab('adminOverview');
    startAdminListeners();
  } catch (error) {
    toast(error.message || 'Admin kontrolü yapılamadı.', 'error');
  }
}

listenAuth(verifyAdmin);

$('#adminLoginForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  try { await login(data.email, data.password); toast('Giriş yapıldı. Yetki kontrol ediliyor.', 'success'); }
  catch (error) { toast(error.message || 'Admin girişi başarısız.', 'error'); }
});

$('#adminLogout')?.addEventListener('click', async () => { await logout(); location.reload(); });

document.addEventListener('click', async (event) => {
  if (!isAdmin) return;
  const btn = event.target.closest('button');
  if (!btn) return;
  try {
    if (btn.dataset.approvePlayer) { await adminApprovePlayer(btn.dataset.approvePlayer); toast('Oyuncu onaylandı ve yayınlandı.', 'success'); }
    if (btn.dataset.rejectPlayer) { await adminRejectPlayer(btn.dataset.rejectPlayer); toast('Oyuncu reddedildi/yayından kaldırıldı.', 'success'); }
    if (btn.dataset.toggleVerify) {
      const user = users.find(item => (item.uid || item.id) === btn.dataset.toggleVerify);
      await adminToggleVerifyPlayer(btn.dataset.toggleVerify, !user?.verified);
      toast('Doğrulama durumu güncellendi.', 'success');
    }
    if (btn.dataset.togglePublicVerify) {
      const player = publicPlayers.find(item => (item.uid || item.id) === btn.dataset.togglePublicVerify);
      await adminToggleVerifyPlayer(btn.dataset.togglePublicVerify, !player?.verified);
      toast('Yayındaki oyuncu doğrulaması güncellendi.', 'success');
    }
    if (btn.dataset.removePlayer) { await adminRemovePublicPlayer(btn.dataset.removePlayer); toast('Oyuncu yayından kaldırıldı.', 'success'); }
    if (btn.dataset.approveTeam) { await adminApproveTeam(btn.dataset.approveTeam); toast('Takım ilanı yayınlandı.', 'success'); }
    if (btn.dataset.rejectTeam) { await adminRejectTeam(btn.dataset.rejectTeam); toast('Takım ilanı reddedildi.', 'success'); }
    if (btn.dataset.removeTeam) { await adminRemovePublicTeam(btn.dataset.removeTeam); toast('Takım ilanı yayından kaldırıldı.', 'success'); }
    if (btn.dataset.tournamentStatus) { await adminUpdateTournamentRequest(btn.dataset.id, btn.dataset.tournamentStatus); toast('Turnuva talebi güncellendi.', 'success'); }
    if (btn.dataset.closeReport) { await adminCloseReport(btn.dataset.closeReport); toast('Rapor kapatıldı.', 'success'); }
  } catch (error) {
    toast(error.message || 'İşlem yapılamadı.', 'error');
  }
});
