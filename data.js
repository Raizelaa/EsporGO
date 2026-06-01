export const CITIES = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin','Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce'
];

export const GAME_CATEGORIES = [
  { id: 'fps', name: 'FPS', icon: '🎯' },
  { id: 'moba', name: 'MOBA', icon: '⚔️' },
  { id: 'battle-royale', name: 'Battle Royale', icon: '🪂' },
  { id: 'mobile', name: 'Mobil', icon: '📱' },
  { id: 'sports', name: 'Spor', icon: '⚽' },
  { id: 'fighting', name: 'Dövüş', icon: '🥊' },
  { id: 'mmo', name: 'MMO / PvP', icon: '🛡️' },
  { id: 'rp', name: 'Roleplay / FiveM', icon: '🚗' },
  { id: 'strategy', name: 'Strateji / Kart', icon: '♟️' }
];

export const GAMES = [
  { id: 'valorant', name: 'Valorant', category: 'fps', platform: ['PC'], accent: '#ff4655', roles: ['Duelist','Controller','Initiator','Sentinel','IGL','Flex'], ranks: ['Iron','Bronze','Silver','Gold','Platinum','Diamond','Ascendant','Immortal','Radiant'] },
  { id: 'cs2', name: 'Counter-Strike 2', category: 'fps', platform: ['PC'], accent: '#f7b500', roles: ['Entry Fragger','AWPer','Rifler','IGL','Support','Lurker'], ranks: ['Silver','Gold Nova','Master Guardian','DMG','Legendary Eagle','Supreme','Global Elite','Premier 10K+','Premier 15K+','Premier 20K+'] },
  { id: 'pointblank', name: 'Point Blank', category: 'fps', platform: ['PC'], accent: '#2ed3ff', roles: ['Rusher','Sniper','Support','Rifle','Taktik Lideri','Flex'], ranks: ['Yeni','Orta','İyi','Pro','Elit','Turnuva Seviyesi'] },
  { id: 'zula', name: 'Zula', category: 'fps', platform: ['PC'], accent: '#f97316', roles: ['Rusher','Sniper','Support','Rifle','Taktik Lideri'], ranks: ['Bronz','Gümüş','Altın','Platin','Elmas','Usta','Efsane'] },
  { id: 'r6', name: 'Rainbow Six Siege', category: 'fps', platform: ['PC','Console'], accent: '#00d1ff', roles: ['Entry','Support','Flex','Roamer','Anchor','IGL'], ranks: ['Copper','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Champion'] },
  { id: 'overwatch2', name: 'Overwatch 2', category: 'fps', platform: ['PC','Console'], accent: '#f99e1a', roles: ['Tank','Damage','Support','Flex'], ranks: ['Bronze','Silver','Gold','Platinum','Diamond','Master','Grandmaster','Champion'] },
  { id: 'lol', name: 'League of Legends', category: 'moba', platform: ['PC'], accent: '#c89b3c', roles: ['Top','Jungle','Mid','ADC','Support','Shotcaller'], ranks: ['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'] },
  { id: 'dota2', name: 'Dota 2', category: 'moba', platform: ['PC'], accent: '#a94335', roles: ['Carry','Mid','Offlane','Soft Support','Hard Support','Captain'], ranks: ['Herald','Guardian','Crusader','Archon','Legend','Ancient','Divine','Immortal'] },
  { id: 'wildrift', name: 'Wild Rift', category: 'mobile', platform: ['Mobile'], accent: '#12b8ff', roles: ['Solo','Jungle','Mid','Dragon Lane','Support'], ranks: ['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'] },
  { id: 'pubg', name: 'PUBG: Battlegrounds', category: 'battle-royale', platform: ['PC','Console'], accent: '#f5a623', roles: ['IGL','Fragger','Scout','Support','Sniper','Driver'], ranks: ['Bronze','Silver','Gold','Platinum','Diamond','Master','Grandmaster'] },
  { id: 'pubgm', name: 'PUBG Mobile', category: 'mobile', platform: ['Mobile'], accent: '#ffc107', roles: ['IGL','Fragger','Scout','Support','Sniper'], ranks: ['Bronze','Silver','Gold','Platinum','Diamond','Crown','Ace','Conqueror'] },
  { id: 'apex', name: 'Apex Legends', category: 'battle-royale', platform: ['PC','Console'], accent: '#ff3b30', roles: ['Entry','Anchor','Support','Recon','IGL'], ranks: ['Rookie','Bronze','Silver','Gold','Platinum','Diamond','Master','Apex Predator'] },
  { id: 'fortnite', name: 'Fortnite', category: 'battle-royale', platform: ['PC','Console','Mobile'], accent: '#8b5cf6', roles: ['IGL','Fragger','Builder','Support','Solo','Duo'], ranks: ['Bronze','Silver','Gold','Platinum','Diamond','Elite','Champion','Unreal'] },
  { id: 'rocketleague', name: 'Rocket League', category: 'sports', platform: ['PC','Console'], accent: '#00a6ff', roles: ['Striker','Defender','Rotator','Goalkeeper','Flex'], ranks: ['Bronze','Silver','Gold','Platinum','Diamond','Champion','Grand Champion','Supersonic Legend'] },
  { id: 'fc', name: 'EA Sports FC', category: 'sports', platform: ['PC','Console'], accent: '#23d18b', roles: ['1v1','Pro Clubs ST','Pro Clubs CAM','Pro Clubs CDM','Pro Clubs DEF','GK'], ranks: ['Casual','Division 10-7','Division 6-4','Division 3-1','Elite','Turnuva Seviyesi'] },
  { id: 'efootball', name: 'eFootball', category: 'sports', platform: ['PC','Console','Mobile'], accent: '#2563eb', roles: ['1v1','Co-op','Takım Kaptanı'], ranks: ['Beginner','Amateur','Professional','Top Player','Superstar','Legend'] },
  { id: 'fivem', name: 'FiveM', category: 'rp', platform: ['PC'], accent: '#00e5ff', roles: ['Aile Üyesi','Shooter','Şoför','Lider','Müzakereci','Ekonomi','Organizasyon'], ranks: ['Yeni','Orta','Deneyimli','Ekip Lideri','Aile Üyesi','Yönetici','Kurucu'] },
  { id: 'gta-rp', name: 'GTA Roleplay', category: 'rp', platform: ['PC'], accent: '#6ee7b7', roles: ['Polis','EMS','Mekanik','Mafya','Sivil','Streamer','Yönetim'], ranks: ['Yeni','Orta','Deneyimli','Rol Lideri','Yetkili'] },
  { id: 'mobilelegends', name: 'Mobile Legends', category: 'mobile', platform: ['Mobile'], accent: '#7c3aed', roles: ['EXP','Jungle','Mid','Gold','Roam','Shotcaller'], ranks: ['Warrior','Elite','Master','Grandmaster','Epic','Legend','Mythic','Mythical Glory','Mythical Immortal'] },
  { id: 'brawlstars', name: 'Brawl Stars', category: 'mobile', platform: ['Mobile'], accent: '#ffcc00', roles: ['DPS','Support','Tank','Control','Flex'], ranks: ['Bronze','Silver','Gold','Diamond','Mythic','Legendary','Masters'] },
  { id: 'clashroyale', name: 'Clash Royale', category: 'mobile', platform: ['Mobile'], accent: '#3b82f6', roles: ['Cycle','Beatdown','Control','Bait','Siege'], ranks: ['Arena','League','Master','Champion','Ultimate Champion'] },
  { id: 'tft', name: 'Teamfight Tactics', category: 'strategy', platform: ['PC','Mobile'], accent: '#a78bfa', roles: ['Flex','Reroll','Tempo','Economy','Tournament'], ranks: ['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'] },
  { id: 'hearthstone', name: 'Hearthstone', category: 'strategy', platform: ['PC','Mobile'], accent: '#d97706', roles: ['Aggro','Control','Combo','Midrange','Tournament'], ranks: ['Bronze','Silver','Gold','Platinum','Diamond','Legend'] },
  { id: 'minecraft', name: 'Minecraft PvP', category: 'mmo', platform: ['PC','Console','Mobile'], accent: '#22c55e', roles: ['PvP','BedWars','SkyWars','UHC','Builder','Leader'], ranks: ['Yeni','Orta','İyi','Pro','Elit','Turnuva Seviyesi'] },
  { id: 'metin2', name: 'Metin2 PvP', category: 'mmo', platform: ['PC'], accent: '#ef4444', roles: ['Savaşçı','Sura','Ninja','Şaman','Lonca Lideri','PvP'], ranks: ['Yeni','Orta','Farm','PvP İyi','Lonca Seviyesi','Turnuva'] },
  { id: 'roblox', name: 'Roblox Competitive', category: 'mmo', platform: ['PC','Mobile','Console'], accent: '#e11d48', roles: ['PvP','Obby','Shooter','Clan','Builder','Leader'], ranks: ['Yeni','Orta','İyi','Pro','Elit'] },
  { id: 'tekken8', name: 'Tekken 8', category: 'fighting', platform: ['PC','Console'], accent: '#dc2626', roles: ['Main','Counterpick','Lab Player','Tournament'], ranks: ['Beginner','Green','Yellow','Orange','Red','Purple','Blue','Tekken King','God of Destruction'] },
  { id: 'streetfighter6', name: 'Street Fighter 6', category: 'fighting', platform: ['PC','Console'], accent: '#06b6d4', roles: ['Main','Zoner','Rushdown','Grappler','Tournament'], ranks: ['Rookie','Iron','Bronze','Silver','Gold','Platinum','Diamond','Master','Legend'] },
  { id: 'mk1', name: 'Mortal Kombat', category: 'fighting', platform: ['PC','Console'], accent: '#facc15', roles: ['Main','Rushdown','Zoner','Grappler','Tournament'], ranks: ['Kasual','Apprentice','Kombatant','Warrior','Champion','Master','Grand Master','God','Elder God'] }
];

export const SAMPLE_PLAYERS = [
  { id: 'p1', gamerTag: 'Raizel', city: 'Çanakkale', game: 'Point Blank', rank: 'Elit', role: 'Taktik Lideri', platform: 'PC', mic: true, activeHours: '20:00 - 00:00', status: 'approved', verified: true, lookingForTeam: true, trustScore: 94, bio: 'Turnuva disiplini yüksek, takım oyunu odaklı oyuncu.', badges: ['Hakem tecrübeli','Takım arıyor','Mikrofon var'] },
  { id: 'p2', gamerTag: 'NovaAim', city: 'İstanbul', game: 'Valorant', rank: 'Ascendant', role: 'Initiator', platform: 'PC', mic: true, activeHours: '21:00 - 01:00', status: 'approved', verified: true, lookingForTeam: true, trustScore: 91, bio: 'Scrim düzeni olan takımlar arıyorum.', badges: ['Onaylı','Rekabetçi'] },
  { id: 'p3', gamerTag: 'KaraRifle', city: 'Ankara', game: 'Counter-Strike 2', rank: 'Premier 15K+', role: 'Rifler', platform: 'PC', mic: true, activeHours: '19:00 - 23:00', status: 'approved', verified: false, lookingForTeam: true, trustScore: 86, bio: 'Entry ve rifler oynarım, düzenli antrenman uygundur.', badges: ['Takım arıyor'] },
  { id: 'p4', gamerTag: 'MaviRoam', city: 'İzmir', game: 'Mobile Legends', rank: 'Mythic', role: 'Roam', platform: 'Mobile', mic: true, activeHours: '18:00 - 22:30', status: 'approved', verified: true, lookingForTeam: false, trustScore: 88, bio: 'Turnuva takımıyla oynamaya açığım.', badges: ['Mobil','Onaylı'] },
  { id: 'p5', gamerTag: 'LosPilot', city: 'Bursa', game: 'FiveM', rank: 'Ekip Lideri', role: 'Şoför', platform: 'PC', mic: true, activeHours: '22:00 - 02:00', status: 'approved', verified: true, lookingForTeam: true, trustScore: 90, bio: 'Aile içi operasyon, sürüş ve koordinasyon tecrübem var.', badges: ['RP','Takım arıyor'] },
  { id: 'p6', gamerTag: 'EmeraldADC', city: 'Antalya', game: 'League of Legends', rank: 'Emerald', role: 'ADC', platform: 'PC', mic: false, activeHours: '20:00 - 23:30', status: 'approved', verified: false, lookingForTeam: true, trustScore: 82, bio: 'Clash ve lig takımı arıyorum.', badges: ['ADC','Takım arıyor'] }
];

export const SAMPLE_TEAMS = [
  { id: 't1', teamName: 'EIGHT7 ESPOR', city: 'Çanakkale', game: 'Point Blank', minRank: 'Pro', neededRoles: ['Sniper','Rifle'], trainingDays: 'Salı / Perşembe / Pazar', micRequired: true, status: 'approved', verified: true, applications: 12, trustScore: 96, description: 'Düzenli maç, disiplin ve turnuva hedefi olan takım.' },
  { id: 't2', teamName: 'Marmara Core', city: 'İstanbul', game: 'Valorant', minRank: 'Diamond', neededRoles: ['Controller','Sentinel'], trainingDays: 'Haftada 4 gün', micRequired: true, status: 'approved', verified: false, applications: 8, trustScore: 89, description: 'Scrim düzeneği oturmuş yarı profesyonel ekip.' },
  { id: 't3', teamName: 'NG Cartel RP', city: 'Bursa', game: 'FiveM', minRank: 'Deneyimli', neededRoles: ['Shooter','Müzakereci','Şoför'], trainingDays: 'Sunucu etkinlik günleri', micRequired: true, status: 'approved', verified: true, applications: 21, trustScore: 92, description: 'RP disiplini, aile düzeni ve operasyon uyumu arıyoruz.' }
];

export const SAMPLE_TOURNAMENTS = [
  { id: 'tr1', name: 'EsporGO Point Blank Kupası', game: 'Point Blank', format: '5v5', status: 'Kayıt Açık', prize: 'Sponsor duyurulacak', startDate: '2026-07-12', endDate: '2026-07-14', teamLimit: 32, registered: 14, refereeNeed: 4, description: 'Hakem kontrollü, itiraz ve maç raporu düzenli turnuva.' },
  { id: 'tr2', name: 'Marmara Valorant Lig Gecesi', game: 'Valorant', format: '5v5', status: 'Yakında', prize: 'Premium profil + sponsor alanı', startDate: '2026-07-20', endDate: '2026-07-21', teamLimit: 16, registered: 6, refereeNeed: 3, description: 'Düşük ping, disiplinli bracket ve yayın odaklı organizasyon.' },
  { id: 'tr3', name: 'FiveM Crew Challenge', game: 'FiveM', format: 'Takım', status: 'Kayıt Açık', prize: 'Sunucu içi ödül', startDate: '2026-08-03', endDate: '2026-08-04', teamLimit: 12, registered: 5, refereeNeed: 2, description: 'RP kuralları, hakem değerlendirmesi ve raporlu organizasyon.' }
];

export const SAMPLE_REFEREES = [
  { id: 'r1', refereeName: 'Espor_Raizel', city: 'Çanakkale', games: ['Point Blank','Valorant','FiveM'], experience: '2 yıl', matches: 180, availability: 'Akşam / Hafta sonu', verified: true, level: 'Senior Hakem', trustScore: 97, bio: 'Canlı yayın maç yönetimi, TW kontrol ve turnuva disiplini tecrübesi.' },
  { id: 'r2', refereeName: 'RuleMaster', city: 'İstanbul', games: ['Counter-Strike 2','Valorant'], experience: '1 yıl', matches: 74, availability: 'Hafta içi akşam', verified: true, level: 'Hakem', trustScore: 88, bio: 'FPS turnuvaları için sonuç ve itiraz takibi.' }
];

export function findGameByName(name) {
  return GAMES.find((game) => game.name === name || game.id === name) || GAMES[0];
}

export function getRanksForGame(gameName) {
  return findGameByName(gameName).ranks || ['Yeni','Orta','İyi','Pro'];
}

export function getRolesForGame(gameName) {
  return findGameByName(gameName).roles || ['Oyuncu','Kaptan','Support','Flex'];
}

export function getGameAccent(gameName) {
  return findGameByName(gameName).accent || '#6ee7f9';
}

export function computeMatchScore(player, preferences = {}) {
  let score = 46;
  if (preferences.game && player.game === preferences.game) score += 28;
  if (preferences.city && player.city === preferences.city) score += 12;
  if (preferences.rank && player.rank === preferences.rank) score += 8;
  if (preferences.mic && player.mic) score += 6;
  if (player.verified) score += 5;
  if (player.lookingForTeam) score += 5;
  return Math.min(99, Math.max(55, score));
}

export function normalizeText(value) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
