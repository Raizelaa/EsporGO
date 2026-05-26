import { firebaseConfig } from '../../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

export const firebaseReady = Boolean(firebaseConfig?.apiKey && !String(firebaseConfig.apiKey).includes('BURAYA'));

let app = null;
export let auth = null;
export let db = null;

if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export function listenAuth(callback) {
  if (!firebaseReady || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function registerPlayer(email, password, profile) {
  if (!firebaseReady) throw new Error('Firebase config dosyası hazır değil. firebase-config.js dosyasını kontrol et.');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  await setDoc(doc(db, 'users', uid), {
    uid,
    email,
    role: 'player',
    status: 'pending',
    verified: false,
    playerName: profile.playerName,
    age: Number(profile.age || 0),
    city: profile.city,
    game: profile.game,
    rank: profile.rank,
    gameRole: profile.gameRole,
    platform: profile.platform,
    mic: profile.mic,
    discord: profile.discord,
    availability: profile.availability,
    teamStatus: profile.teamStatus,
    bio: profile.bio || '',
    language: profile.language || 'Türkçe',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return credential.user;
}

export async function login(email, password) {
  if (!firebaseReady) throw new Error('Firebase config dosyası hazır değil.');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  if (!auth) return;
  return signOut(auth);
}

export async function getUserProfile(uid) {
  if (!db || !uid) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateMyProfile(uid, data) {
  if (!db || !uid) throw new Error('Giriş yapılmadı.');
  const allowed = ['playerName','age','city','game','rank','gameRole','platform','mic','discord','availability','teamStatus','bio','language'];
  const payload = {};
  for (const key of allowed) {
    if (key in data) payload[key] = key === 'age' ? Number(data[key] || 0) : data[key];
  }
  payload.updatedAt = serverTimestamp();
  await updateDoc(doc(db, 'users', uid), payload);
}

export function listenCollection(name, callback, fallback = []) {
  if (!db) {
    callback(fallback);
    return () => {};
  }
  return onSnapshot(collection(db, name), (snapshot) => {
    callback(snapshot.docs.map(item => ({ id: item.id, ...item.data() })));
  }, (error) => {
    console.error(`${name} dinlenemedi`, error);
    callback(fallback);
  });
}

export async function getCollectionOnce(name) {
  if (!db) return [];
  const snap = await getDocs(collection(db, name));
  return snap.docs.map(item => ({ id: item.id, ...item.data() }));
}

export async function createTeamRequest(uid, data) {
  if (!db || !uid) throw new Error('Takım ilanı oluşturmak için giriş yapmalısın.');
  await addDoc(collection(db, 'teamRequests'), {
    ownerUid: uid,
    teamName: data.teamName,
    game: data.game,
    wantedRole: data.wantedRole,
    minRank: data.minRank,
    city: data.city,
    contact: data.contact,
    trainingDays: data.trainingDays || '',
    description: data.description || '',
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function createTournamentRequest(uid, data) {
  if (!db || !uid) throw new Error('Turnuva talebi oluşturmak için giriş yapmalısın.');
  await addDoc(collection(db, 'tournamentRequests'), {
    ownerUid: uid,
    tournamentName: data.tournamentName,
    game: data.game,
    format: data.format,
    teamCount: data.teamCount,
    prize: data.prize || '',
    datePreference: data.datePreference || '',
    description: data.description || '',
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function createTeamApplication(uid, team, message) {
  if (!db || !uid) throw new Error('Başvuru göndermek için giriş yapmalısın.');
  await addDoc(collection(db, 'teamApplications'), {
    ownerUid: uid,
    teamId: team.id,
    teamName: team.teamName,
    teamOwnerUid: team.ownerUid || '',
    message: message || 'Takımınıza başvurmak istiyorum.',
    status: 'pending',
    createdAt: serverTimestamp()
  });
}

export async function createReport(uid, targetType, targetId, reason) {
  if (!db || !uid) throw new Error('Rapor göndermek için giriş yapmalısın.');
  await addDoc(collection(db, 'reports'), {
    ownerUid: uid,
    targetType,
    targetId,
    reason,
    status: 'open',
    createdAt: serverTimestamp()
  });
}

function publicPlayerFromUser(user) {
  return {
    uid: user.uid,
    playerName: user.playerName || '',
    city: user.city || '',
    game: user.game || '',
    rank: user.rank || '',
    gameRole: user.gameRole || '',
    platform: user.platform || '',
    mic: user.mic || '',
    discord: user.discord || '',
    availability: user.availability || '',
    teamStatus: user.teamStatus || '',
    bio: user.bio || '',
    language: user.language || 'Türkçe',
    verified: Boolean(user.verified),
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function publicTeamFromRequest(team, id) {
  return {
    requestId: id,
    ownerUid: team.ownerUid || '',
    teamName: team.teamName || '',
    game: team.game || '',
    wantedRole: team.wantedRole || '',
    minRank: team.minRank || '',
    city: team.city || '',
    contact: team.contact || '',
    trainingDays: team.trainingDays || '',
    description: team.description || '',
    verified: Boolean(team.verified),
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

export async function adminApprovePlayer(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Kullanıcı bulunamadı.');
  const user = { uid, ...snap.data(), status: 'approved' };
  await updateDoc(ref, { status: 'approved', updatedAt: serverTimestamp() });
  await setDoc(doc(db, 'publicPlayers', uid), publicPlayerFromUser(user));
}

export async function adminRejectPlayer(uid) {
  await updateDoc(doc(db, 'users', uid), { status: 'rejected', updatedAt: serverTimestamp() });
  await deleteDoc(doc(db, 'publicPlayers', uid)).catch(() => {});
}

export async function adminToggleVerifyPlayer(uid, value) {
  await updateDoc(doc(db, 'users', uid), { verified: value, updatedAt: serverTimestamp() }).catch(() => {});
  await updateDoc(doc(db, 'publicPlayers', uid), { verified: value, updatedAt: serverTimestamp() }).catch(() => {});
}

export async function adminRemovePublicPlayer(uid) {
  await deleteDoc(doc(db, 'publicPlayers', uid));
  await updateDoc(doc(db, 'users', uid), { status: 'hidden', updatedAt: serverTimestamp() }).catch(() => {});
}

export async function adminApproveTeam(id) {
  const ref = doc(db, 'teamRequests', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Takım başvurusu bulunamadı.');
  const team = snap.data();
  await updateDoc(ref, { status: 'approved', updatedAt: serverTimestamp() });
  await setDoc(doc(db, 'publicTeams', id), publicTeamFromRequest(team, id));
}

export async function adminRejectTeam(id) {
  await updateDoc(doc(db, 'teamRequests', id), { status: 'rejected', updatedAt: serverTimestamp() });
  await deleteDoc(doc(db, 'publicTeams', id)).catch(() => {});
}

export async function adminRemovePublicTeam(id) {
  await deleteDoc(doc(db, 'publicTeams', id));
  await updateDoc(doc(db, 'teamRequests', id), { status: 'hidden', updatedAt: serverTimestamp() }).catch(() => {});
}

export async function adminUpdateTournamentRequest(id, status) {
  await updateDoc(doc(db, 'tournamentRequests', id), { status, updatedAt: serverTimestamp() });
}

export async function adminCloseReport(id) {
  await updateDoc(doc(db, 'reports', id), { status: 'closed', updatedAt: serverTimestamp() });
}
