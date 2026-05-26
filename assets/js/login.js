import { pageShellInit, $, $$, fillCitySelect, fillGameSelect, fillPlatformSelect, fillMicSelect, fillAvailabilitySelect, fillTeamStatusSelect, bindGameDependentSelects, formToObject, requireFields, toast } from './utils.js';
import { login, registerPlayer, listenAuth } from './firebase-service.js';

pageShellInit();

const loginTab = $('#loginTab');
const registerTab = $('#registerTab');
const loginForm = $('#loginForm');
const registerForm = $('#registerForm');
let step = 0;

function setMode(mode) {
  const isRegister = mode === 'register';
  loginTab.classList.toggle('active', !isRegister);
  registerTab.classList.toggle('active', isRegister);
  loginForm.classList.toggle('hide', isRegister);
  registerForm.classList.toggle('hide', !isRegister);
}
loginTab.addEventListener('click', () => setMode('login'));
registerTab.addEventListener('click', () => setMode('register'));
if (new URLSearchParams(location.search).get('mode') === 'register') setMode('register');

fillCitySelect($('#registerCity'));
fillGameSelect($('#registerGame'));
fillPlatformSelect($('#registerPlatform'));
fillMicSelect($('#registerMic'));
fillAvailabilitySelect($('#registerAvailability'));
fillTeamStatusSelect($('#registerTeamStatus'));
bindGameDependentSelects($('#registerGame'), $('#registerRank'), $('#registerRole'));

function updateStep() {
  $$('[data-step]').forEach(panel => panel.classList.toggle('active', Number(panel.dataset.step) === step));
  $$('[data-step-label]').forEach(label => label.classList.toggle('active', Number(label.dataset.stepLabel) === step));
  $('#prevStep').disabled = step === 0;
  $('#nextStep').classList.toggle('hide', step === 3);
  $('#submitRegister').classList.toggle('hide', step !== 3);
}
function validateCurrentStep() {
  const panel = $(`[data-step="${step}"]`);
  const inputs = $$('input, select, textarea', panel);
  for (const input of inputs) {
    if (!input.checkValidity()) { input.reportValidity(); return false; }
  }
  return true;
}
$('#prevStep').addEventListener('click', () => { step = Math.max(0, step - 1); updateStep(); });
$('#nextStep').addEventListener('click', () => { if (!validateCurrentStep()) return; step = Math.min(3, step + 1); updateStep(); });
updateStep();

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = formToObject(loginForm);
  try {
    await login(data.email, data.password);
    toast('Giriş başarılı. Panele yönlendiriliyorsun.', 'success');
    setTimeout(() => location.href = './dashboard.html', 900);
  } catch (error) {
    toast(error.message || 'Giriş başarısız.', 'error');
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;
  const data = formToObject(registerForm);
  const missing = requireFields(data, ['email','password','playerName','age','city','discord','game','rank','gameRole','platform','mic','availability','teamStatus']);
  if (missing.length) { toast('Eksik alanlar var. Lütfen formu kontrol et.', 'error'); return; }
  try {
    await registerPlayer(data.email, data.password, data);
    toast('Kaydın alındı. Admin onayından sonra profilin yayınlanacak.', 'success');
    setTimeout(() => location.href = './dashboard.html', 1200);
  } catch (error) {
    toast(error.message || 'Kayıt sırasında hata oluştu.', 'error');
  }
});

listenAuth(user => {
  if (user && !new URLSearchParams(location.search).get('stay')) {
    // Kullanıcı zaten girişliyse formu kullanabilir; otomatik yönlendirmeyi kısa tutuyoruz.
  }
});
