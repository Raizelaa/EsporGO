let firebaseContext = {
  ready: false,
  reason: 'Firebase başlatılmadı.',
  app: null,
  auth: null,
  db: null,
  modules: {}
};

const CDN_VERSION = '10.12.5';

export async function bootFirebase() {
  if (firebaseContext.ready || firebaseContext.booting) return firebaseContext;
  firebaseContext.booting = true;

  try {
    const configModule = await import('./firebase-config.js');
    const firebaseConfig = configModule.firebaseConfig;

    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('BURAYA')) {
      throw new Error('firebase-config.js içindeki bilgiler eksik görünüyor.');
    }

    const [appModule, authModule, firestoreModule] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${CDN_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${CDN_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${CDN_VERSION}/firebase-firestore.js`)
    ]);

    const app = appModule.getApps().length ? appModule.getApp() : appModule.initializeApp(firebaseConfig);
    const auth = authModule.getAuth(app);
    const db = firestoreModule.getFirestore(app);

    firebaseContext = {
      ready: true,
      reason: 'Firebase bağlantısı hazır.',
      app,
      auth,
      db,
      modules: { ...appModule, ...authModule, ...firestoreModule }
    };
  } catch (error) {
    firebaseContext.ready = false;
    firebaseContext.reason = error.message || 'Firebase bağlantısı kurulamadı.';
  } finally {
    firebaseContext.booting = false;
  }

  window.ESPORGO_FIREBASE_READY = firebaseContext.ready;
  window.ESPORGO_FIREBASE_REASON = firebaseContext.reason;
  return firebaseContext;
}

function requireFirebase() {
  if (!firebaseContext.ready) {
    throw new Error(firebaseContext.reason || 'Firebase hazır değil.');
  }
  return firebaseContext;
}

function cleanObject(input = {}) {
  const output = {};
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') output[key] = value;
  });
  return output;
}

export function authState(callback) {
  bootFirebase().then((ctx) => {
    if (!ctx.ready) {
      callback(null, null, ctx.reason);
      return () => {};
    }
    const { onAuthStateChanged } = ctx.modules;
    return onAuthStateChanged(ctx.auth, async (user) => {
      let profile = null;
      if (user) profile = await getUserProfile(user.uid);
      callback(user, profile, null);
    });
  });
}

export async function registerPlayer(payload) {
  await bootFirebase();
  const ctx = requireFirebase();
  const {
    createUserWithEmailAndPassword,
    updateProfile,
    doc,
    setDoc,
    serverTimestamp
  } = ctx.modules;

  const credentials = await createUserWithEmailAndPassword(ctx.auth, payload.email, payload.password);
  await updateProfile(credentials.user, { displayName: payload.gamerTag });

  const profile = cleanObject({
    uid: credentials.user.uid,
    email: payload.email,
    gamerTag: payload.gamerTag,
    city: payload.city,
    ageRange: payload.ageRange,
    discord: payload.discord,
    game: payload.game,
    secondaryGame: payload.secondaryGame,
    rank: payload.rank,
    roleInGame: payload.roleInGame,
    platform: payload.platform,
    mic: Boolean(payload.mic),
    activeHours: payload.activeHours,
    lookingForTeam: Boolean(payload.lookingForTeam),
    lookingForTournament: Boolean(payload.lookingForTournament),
    publicProfile: Boolean(payload.publicProfile),
    bio: payload.bio,
    role: 'player',
    status: 'pending',
    verified: false,
    trustScore: 70,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await setDoc(doc(ctx.db, 'users', credentials.user.uid), profile);
  await createNotification(credentials.user.uid, 'Profil başvurun alındı. Admin onayından sonra Oyuncu Bul alanında yayınlanacak.', 'profile');
  return profile;
}

export async function login(email, password) {
  await bootFirebase();
  const ctx = requireFirebase();
  const { signInWithEmailAndPassword } = ctx.modules;
  const credentials = await signInWithEmailAndPassword(ctx.auth, email, password);
  return credentials.user;
}

export async function logout() {
  await bootFirebase();
  const ctx = requireFirebase();
  const { signOut } = ctx.modules;
  await signOut(ctx.auth);
}

export async function getCurrentSession() {
  await bootFirebase();
  if (!firebaseContext.ready || !firebaseContext.auth.currentUser) return { user: null, profile: null };
  const user = firebaseContext.auth.currentUser;
  const profile = await getUserProfile(user.uid);
  return { user, profile };
}

export async function getUserProfile(uid) {
  await bootFirebase();
  if (!firebaseContext.ready || !uid) return null;
  const ctx = firebaseContext;
  const { doc, getDoc } = ctx.modules;
  const snapshot = await getDoc(doc(ctx.db, 'users', uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function updateUserProfile(uid, payload) {
  await bootFirebase();
  const ctx = requireFirebase();
  const { doc, updateDoc, serverTimestamp } = ctx.modules;
  await updateDoc(doc(ctx.db, 'users', uid), cleanObject({ ...payload, updatedAt: serverTimestamp() }));
}

export async function getPublicCollection(collectionName, fallback = []) {
  await bootFirebase();
  if (!firebaseContext.ready) return fallback;
  const ctx = firebaseContext;
  const { collection, getDocs, limit, query } = ctx.modules;
  const snapshot = await getDocs(query(collection(ctx.db, collectionName), limit(120)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getCollectionWhere(collectionName, field, operator, value) {
  await bootFirebase();
  if (!firebaseContext.ready) return [];
  const ctx = firebaseContext;
  const { collection, getDocs, query, where, limit } = ctx.modules;
  const snapshot = await getDocs(query(collection(ctx.db, collectionName), where(field, operator, value), limit(150)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function createTeamRequest(payload) {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) throw new Error('Takım ilanı oluşturmak için giriş yapmalısın.');
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  await addDoc(collection(ctx.db, 'teamRequests'), cleanObject({
    ...payload,
    ownerUid: user.uid,
    status: 'pending',
    applications: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }));
  await createNotification(user.uid, 'Takım ilanı başvurun alındı. Admin onayından sonra yayınlanacak.', 'team');
}

export async function applyTeam(teamId, message) {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) throw new Error('Takıma başvurmak için giriş yapmalısın.');
  const profile = await getUserProfile(user.uid);
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  await addDoc(collection(ctx.db, 'teamApplications'), cleanObject({
    teamId,
    applicantUid: user.uid,
    applicantName: profile?.gamerTag || user.email,
    applicantGame: profile?.game,
    applicantRank: profile?.rank,
    message,
    status: 'pending',
    createdAt: serverTimestamp()
  }));
}

export async function createTournamentRequest(payload) {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) throw new Error('Turnuva talebi oluşturmak için giriş yapmalısın.');
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  await addDoc(collection(ctx.db, 'tournamentRequests'), cleanObject({
    ...payload,
    ownerUid: user.uid,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }));
  await createNotification(user.uid, 'Turnuva talebin alındı. Admin panelinde incelenecek.', 'tournament');
}

export async function registerTournament(tournamentId, payload = {}) {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) throw new Error('Turnuvaya kayıt olmak için giriş yapmalısın.');
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  await addDoc(collection(ctx.db, 'tournamentRegistrations'), cleanObject({
    tournamentId,
    userUid: user.uid,
    status: 'pending',
    ...payload,
    createdAt: serverTimestamp()
  }));
}

export async function createRefereeRequest(payload) {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) throw new Error('Hakem başvurusu için giriş yapmalısın.');
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  await addDoc(collection(ctx.db, 'refereeRequests'), cleanObject({
    ...payload,
    ownerUid: user.uid,
    status: 'pending',
    verified: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }));
  await createNotification(user.uid, 'Hakem başvurun alındı. İnceleme sonrası sana bildirim gönderilecek.', 'referee');
}

export async function createReport(payload) {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) throw new Error('Rapor oluşturmak için giriş yapmalısın.');
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  await addDoc(collection(ctx.db, 'reports'), cleanObject({
    ...payload,
    reporterUid: user.uid,
    status: 'open',
    createdAt: serverTimestamp()
  }));
}

export async function createNotification(userId, message, type = 'system') {
  await bootFirebase();
  if (!firebaseContext.ready || !userId) return;
  const ctx = firebaseContext;
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  await addDoc(collection(ctx.db, 'notifications'), cleanObject({
    userId,
    message,
    type,
    read: false,
    createdAt: serverTimestamp()
  })).catch(() => {});
}

export async function toggleFavorite(targetType, targetId, targetName) {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) throw new Error('Favorilere eklemek için giriş yapmalısın.');
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  await addDoc(collection(ctx.db, 'favorites'), cleanObject({
    userId: user.uid,
    targetType,
    targetId,
    targetName,
    createdAt: serverTimestamp()
  }));
}

export async function getMyItems(collectionName, ownerField = 'ownerUid') {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) return [];
  return getCollectionWhere(collectionName, ownerField, '==', user.uid);
}

export async function getNotifications() {
  await bootFirebase();
  const ctx = requireFirebase();
  const user = ctx.auth.currentUser;
  if (!user) return [];
  return getCollectionWhere('notifications', 'userId', '==', user.uid);
}

export async function getAdminQueues() {
  await bootFirebase();
  const ctx = requireFirebase();
  const profile = await getUserProfile(ctx.auth.currentUser?.uid);
  if (!profile || profile.role !== 'admin') throw new Error('Admin yetkisi gerekli.');

  const [users, teams, tournaments, referees, reports, logs] = await Promise.all([
    getCollectionWhere('users', 'status', '==', 'pending'),
    getCollectionWhere('teamRequests', 'status', '==', 'pending'),
    getCollectionWhere('tournamentRequests', 'status', '==', 'pending'),
    getCollectionWhere('refereeRequests', 'status', '==', 'pending'),
    getCollectionWhere('reports', 'status', '==', 'open'),
    getPublicCollection('adminLogs', [])
  ]);

  return { users, teams, tournaments, referees, reports, logs };
}

export async function adminApproveUser(userId, profile) {
  await bootFirebase();
  const ctx = requireFirebase();
  const { doc, setDoc, updateDoc, serverTimestamp } = ctx.modules;
  await updateDoc(doc(ctx.db, 'users', userId), {
    status: 'approved',
    verified: true,
    updatedAt: serverTimestamp()
  });
  await setDoc(doc(ctx.db, 'publicPlayers', userId), cleanObject({
    id: userId,
    gamerTag: profile.gamerTag,
    city: profile.city,
    ageRange: profile.ageRange,
    game: profile.game,
    secondaryGame: profile.secondaryGame,
    rank: profile.rank,
    roleInGame: profile.roleInGame,
    role: profile.roleInGame,
    platform: profile.platform,
    mic: profile.mic,
    activeHours: profile.activeHours,
    lookingForTeam: profile.lookingForTeam,
    lookingForTournament: profile.lookingForTournament,
    bio: profile.bio,
    trustScore: profile.trustScore || 70,
    status: 'approved',
    verified: true,
    publishedAt: serverTimestamp()
  }));
  await createNotification(userId, 'Profilin onaylandı. Artık Oyuncu Bul sayfasında yayınlanıyorsun.', 'approved');
  await adminLog('Oyuncu onaylandı', profile.gamerTag || userId);
}

export async function adminReject(collectionName, documentId, reason = 'Başvuru reddedildi.') {
  await bootFirebase();
  const ctx = requireFirebase();
  const { doc, updateDoc, serverTimestamp } = ctx.modules;
  await updateDoc(doc(ctx.db, collectionName, documentId), {
    status: 'rejected',
    rejectReason: reason,
    updatedAt: serverTimestamp()
  });
  await adminLog('Başvuru reddedildi', `${collectionName}/${documentId}`);
}

export async function adminApproveTeam(team) {
  await bootFirebase();
  const ctx = requireFirebase();
  const { doc, setDoc, updateDoc, serverTimestamp } = ctx.modules;
  await updateDoc(doc(ctx.db, 'teamRequests', team.id), { status: 'approved', updatedAt: serverTimestamp() });
  await setDoc(doc(ctx.db, 'publicTeams', team.id), cleanObject({ ...team, status: 'approved', publishedAt: serverTimestamp() }));
  if (team.ownerUid) await createNotification(team.ownerUid, 'Takım ilanı onaylandı ve yayına alındı.', 'approved');
  await adminLog('Takım ilanı onaylandı', team.teamName || team.id);
}

export async function adminApproveTournament(tournament) {
  await bootFirebase();
  const ctx = requireFirebase();
  const { doc, setDoc, updateDoc, serverTimestamp } = ctx.modules;
  await updateDoc(doc(ctx.db, 'tournamentRequests', tournament.id), { status: 'approved', updatedAt: serverTimestamp() });
  await setDoc(doc(ctx.db, 'publicTournaments', tournament.id), cleanObject({ ...tournament, status: tournament.publishStatus || 'Kayıt Açık', publishedAt: serverTimestamp() }));
  if (tournament.ownerUid) await createNotification(tournament.ownerUid, 'Turnuva talebin onaylandı ve yayına alındı.', 'approved');
  await adminLog('Turnuva onaylandı', tournament.name || tournament.id);
}

export async function adminApproveReferee(referee) {
  await bootFirebase();
  const ctx = requireFirebase();
  const { doc, setDoc, updateDoc, serverTimestamp } = ctx.modules;
  await updateDoc(doc(ctx.db, 'refereeRequests', referee.id), { status: 'approved', verified: true, updatedAt: serverTimestamp() });
  await setDoc(doc(ctx.db, 'publicReferees', referee.id), cleanObject({ ...referee, status: 'approved', verified: true, publishedAt: serverTimestamp() }));
  if (referee.ownerUid) await createNotification(referee.ownerUid, 'Hakem başvurun onaylandı.', 'approved');
  await adminLog('Hakem başvurusu onaylandı', referee.refereeName || referee.id);
}

export async function adminCloseReport(reportId, actionNote = 'İşlem tamamlandı.') {
  await bootFirebase();
  const ctx = requireFirebase();
  const { doc, updateDoc, serverTimestamp } = ctx.modules;
  await updateDoc(doc(ctx.db, 'reports', reportId), { status: 'closed', actionNote, updatedAt: serverTimestamp() });
  await adminLog('Rapor kapatıldı', reportId);
}

export async function adminLog(action, target) {
  await bootFirebase();
  if (!firebaseContext.ready) return;
  const ctx = firebaseContext;
  const { addDoc, collection, serverTimestamp } = ctx.modules;
  const admin = ctx.auth.currentUser;
  await addDoc(collection(ctx.db, 'adminLogs'), cleanObject({
    action,
    target,
    adminUid: admin?.uid,
    adminEmail: admin?.email,
    createdAt: serverTimestamp()
  })).catch(() => {});
}
