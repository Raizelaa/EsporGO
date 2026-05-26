import { $, $$, fillCitySelect, fillGameSelect, fillPlatformSelect, fillMicSelect, fillAvailabilitySelect, fillTeamStatusSelect, bindGameDependentSelects, formToObject, toast } from './utils.js';
import { listenAuth, getUserProfile, updateMyProfile, createTeamRequest, createTournamentRequest, logout } from './firebase-service.js';

let currentUser = null;
let currentProfile = null;

function activateTab(id) {
  $$('.dashboard-section').forEach(section => section.classList.toggle('active', section.id === id));
  $$('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === id));
}
$$('[data-tab]').forEach(button => button.addEventListener('click', () => activateTab(button.dataset.tab)));

function fillAllSelects() {
  fillCitySelect($('#profileCitySelect'));
  fillGameSelect($('#profileGameSelect'));
  fillPlatformSelect($('#profilePlatformSelect'));
  fillMicSelect($('#profileMicSelect'));
  fillAvailabilitySelect($('#profileAvailabilitySelect'));
  fillTeamStatusSelect($('#profileTeamStatusSelect'));
  bindGameDependentSelects($('#profileGameSelect'), $('#profileRankSelect'), $('#profileRoleSelect'));
  fillGameSelect($('#teamGameSelect'));
  fillCitySelect($('#teamCitySelect'));
  bindGameDependentSelects($('#teamGameSelect'), $('#teamRankSelect'), $('#teamRoleSelect'));
  fillGameSelect($('#tournamentGameSelect'));
}
fillAllSelects();

function setFormValues(form, data = {}) {
  [...form.elements].forEach(el => {
    if (!el.name || !(el.name in data)) return;
    el.value = data[el.name] ?? '';
    if (el.id === 'profileGameSelect') el.dispatchEvent(new Event('change'));
  });
  // Oyuna bağlı seçenekler güncellendikten sonra rank/rol tekrar basılır.
  if ($('#profileRankSelect')) $('#profileRankSelect').value = data.rank || '';
  if ($('#profileRoleSelect')) $('#profileRoleSelect').value = data.gameRole || '';
}

function renderProfile(profile) {
  currentProfile = profile;
  $('#profileStatus').textContent = profile?.status || 'Yok';
  $('#profileGame').textContent = profile?.game || '-';
  $('#profileRank').textContent = profile?.rank || '-';
  $('#profileCity').textContent = profile?.city || '-';
  $('#profileSummary').textContent = profile ? `${profile.playerName || 'Oyuncu'} · ${profile.game || '-'} · ${profile.rank || '-'} · ${profile.teamStatus || '-'}` : 'Profil bulunamadı.';
  const verified = $('#verifiedBadge');
  verified.textContent = profile?.verified ? 'Doğrulanmış' : 'Standart Profil';
  verified.className = `badge-mini ${profile?.verified ? 'green' : ''}`;
  if (profile) setFormValues($('#profileForm'), profile);
}

listenAuth(async (user) => {
  currentUser = user;
  if (!user) { toast('Panele girmek için giriş yapmalısın.', 'error'); setTimeout(() => location.href = './login.html', 800); return; }
  try { renderProfile(await getUserProfile(user.uid)); }
  catch (error) { toast(error.message || 'Profil okunamadı.', 'error'); }
});

$('#logoutButton')?.addEventListener('click', async () => { await logout(); location.href = './index.html'; });

$('#profileForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  try {
    await updateMyProfile(currentUser.uid, formToObject(event.currentTarget));
    toast('Profilin güncellendi. Onay durumun admin kurallarına göre korunur.', 'success');
    renderProfile(await getUserProfile(currentUser.uid));
  } catch (error) { toast(error.message || 'Profil güncellenemedi.', 'error'); }
});

$('#teamForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  try {
    await createTeamRequest(currentUser.uid, formToObject(event.currentTarget));
    event.currentTarget.reset();
    toast('Takım ilanı admin onayına gönderildi.', 'success');
  } catch (error) { toast(error.message || 'Takım ilanı gönderilemedi.', 'error'); }
});

$('#tournamentForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!currentUser) return;
  try {
    await createTournamentRequest(currentUser.uid, formToObject(event.currentTarget));
    event.currentTarget.reset();
    toast('Turnuva talebi admin paneline gönderildi.', 'success');
  } catch (error) { toast(error.message || 'Turnuva talebi gönderilemedi.', 'error'); }
});
