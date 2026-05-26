export const CITIES = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin','Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkâri','Hatay','Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce'
];

export const GAME_CATEGORIES = [
  'FPS', 'MOBA', 'Battle Royale', 'Mobil', 'Spor', 'Dövüş', 'MMO / PvP', 'Roleplay', 'Strateji', 'Kart'
];

export const GAMES = [
  { name:'Valorant', category:'FPS', roles:['Duelist','Controller','Initiator','Sentinel','IGL','Flex'], ranks:['Iron 1','Iron 2','Iron 3','Bronze 1','Bronze 2','Bronze 3','Silver 1','Silver 2','Silver 3','Gold 1','Gold 2','Gold 3','Platinum 1','Platinum 2','Platinum 3','Diamond 1','Diamond 2','Diamond 3','Ascendant 1','Ascendant 2','Ascendant 3','Immortal 1','Immortal 2','Immortal 3','Radiant'] },
  { name:'Counter-Strike 2', category:'FPS', roles:['Entry Fragger','AWPer','Rifler','Support','Lurker','IGL'], ranks:['Silver','Gold Nova','Master Guardian','DMG','Legendary Eagle','Supreme','Global Elite','Premier 0-5K','Premier 5-10K','Premier 10-15K','Premier 15-20K','Premier 20K+'] },
  { name:'Point Blank', category:'FPS', roles:['Rusher','Sniper','Support','Bombacı','IGL','Flex'], ranks:['Acemi','Orta Seviye','İyi','Çok İyi','Pro','Turnuva Oyuncusu','E-spor Seviyesi'] },
  { name:'Rainbow Six Siege', category:'FPS', roles:['Entry','Breacher','Support','Roamer','Anchor','IGL'], ranks:['Copper','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Champion'] },
  { name:'Overwatch 2', category:'FPS', roles:['Tank','Damage','Support','Flex'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Master','Grandmaster','Champion','Top 500'] },
  { name:'Call of Duty Warzone', category:'Battle Royale', roles:['Entry','Sniper','Support','IGL','Flex'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Crimson','Iridescent','Top 250'] },
  { name:'Delta Force', category:'FPS', roles:['Assault','Medic','Engineer','Recon','Sniper','Flex'], ranks:['Recruit','Bronze','Silver','Gold','Platinum','Diamond','Elite','Legend'] },
  { name:'League of Legends', category:'MOBA', roles:['Top','Jungle','Mid','ADC','Support','Coach'], ranks:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'] },
  { name:'Dota 2', category:'MOBA', roles:['Carry','Mid','Offlane','Soft Support','Hard Support','Captain'], ranks:['Herald','Guardian','Crusader','Archon','Legend','Ancient','Divine','Immortal'] },
  { name:'Mobile Legends: Bang Bang', category:'Mobil', roles:['Tank','Fighter','Assassin','Mage','Marksman','Support','Roamer'], ranks:['Warrior','Elite','Master','Grandmaster','Epic','Legend','Mythic','Mythical Honor','Mythical Glory','Mythical Immortal'] },
  { name:'Wild Rift', category:'Mobil', roles:['Baron','Jungle','Mid','Dragon','Support'], ranks:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger','Sovereign'] },
  { name:'Arena of Valor', category:'Mobil', roles:['Dark Slayer Lane','Jungle','Mid','Dragon Lane','Support'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Veteran','Master','Conqueror'] },
  { name:'PUBG: Battlegrounds', category:'Battle Royale', roles:['IGL','Scout','Sniper','Fragger','Support','Driver'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Master','Grandmaster'] },
  { name:'PUBG Mobile', category:'Mobil', roles:['IGL','Entry','Sniper','Support','Scout','Fragger'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Crown','Ace','Ace Master','Ace Dominator','Conqueror'] },
  { name:'Fortnite', category:'Battle Royale', roles:['IGL','Fragger','Builder','Support','Duo Partner'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Elite','Champion','Unreal'] },
  { name:'Apex Legends', category:'Battle Royale', roles:['Entry','Support','Recon','Controller','IGL','Flex'], ranks:['Rookie','Bronze','Silver','Gold','Platinum','Diamond','Master','Predator'] },
  { name:'Rocket League', category:'Spor', roles:['Striker','Defender','Rotator','Goalkeeper','Duo Partner'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Champion','Grand Champion','Supersonic Legend'] },
  { name:'EA Sports FC', category:'Spor', roles:['ST','LW/RW','CAM','CM','CDM','CB','GK','Pro Clubs'], ranks:['Division 10-7','Division 6-4','Division 3-2','Division 1','Elite','Weekend League'] },
  { name:'eFootball', category:'Spor', roles:['Forvet','Kanat','Orta Saha','Defans','Kaleci'], ranks:['Beginner','Amateur','Professional','Expert','Elite','Champion'] },
  { name:'Teamfight Tactics', category:'Strateji', roles:['Tempo','Reroll','Fast 8','Flex','Analist'], ranks:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'] },
  { name:'Hearthstone', category:'Kart', roles:['Standard','Wild','Battlegrounds','Arena'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Legend'] },
  { name:'FiveM', category:'Roleplay', roles:['Aile Üyesi','Lider','Şoför','Koruma','Keskin Nişancı','Mekanik','Polis','EMS','Yönetici'], ranks:['Yeni','Orta','Deneyimli','Profesyonel','Ekip Lideri','Aile Lideri','Yönetici'] },
  { name:'GTA Online', category:'Roleplay', roles:['Heist','Racer','PvP','Crew Leader','Support'], ranks:['Yeni','Orta','Deneyimli','Profesyonel','Crew Lideri'] },
  { name:'Zula', category:'FPS', roles:['Rusher','Sniper','Support','IGL','Flex'], ranks:['Bronze','Silver','Gold','Platinum','Diamond','Elite','Legend'] },
  { name:'Metin2 PvP', category:'MMO / PvP', roles:['Savaşçı','Ninja','Sura','Şaman','Lycan','Lonca Lideri'], ranks:['Yeni','Orta','Deneyimli','PvP Oyuncusu','Lonca Lideri','Turnuva Seviyesi'] },
  { name:'Minecraft PvP', category:'MMO / PvP', roles:['Sword PvP','Bedwars','Skywars','UHC','Builder','Team Leader'], ranks:['Yeni','Orta','İyi','Çok İyi','Pro','Turnuva Seviyesi'] },
  { name:'Roblox Competitive', category:'MMO / PvP', roles:['FPS','Obby','Arena','Team Leader','Support'], ranks:['Yeni','Orta','İyi','Pro','Elite'] },
  { name:'Brawl Stars', category:'Mobil', roles:['Damage Dealer','Tank','Support','Controller','Assassin'], ranks:['Bronze','Silver','Gold','Diamond','Mythic','Legendary','Masters'] },
  { name:'Clash Royale', category:'Mobil', roles:['Ladder','Clan War','2v2','Deck Builder'], ranks:['Arena','League','Master','Champion','Ultimate Champion'] },
  { name:'Clash of Clans', category:'Mobil', roles:['Attack Leader','Base Designer','War Player','Clan Leader','Donator'], ranks:['Yeni','Orta','TH10+','TH12+','TH14+','TH16+','Legend League'] },
  { name:'Tekken 8', category:'Dövüş', roles:['Main','Secondary','Lab Player','Tournament Player'], ranks:['Beginner','Green','Yellow','Orange','Red','Purple','Blue','Tekken King','God of Destruction'] },
  { name:'Street Fighter 6', category:'Dövüş', roles:['Main','Secondary','Lab Player','Tournament Player'], ranks:['Rookie','Iron','Bronze','Silver','Gold','Platinum','Diamond','Master','Legend'] },
  { name:'Mortal Kombat', category:'Dövüş', roles:['Main','Secondary','Combo Lab','Tournament Player'], ranks:['Yeni','Orta','İyi','Pro','Turnuva Seviyesi'] }
];

export const PLATFORMS = ['PC','PlayStation','Xbox','Nintendo Switch','Mobil','Cross-platform'];
export const MIC_OPTIONS = ['Mikrofon var','Mikrofon yok','Sadece dinleyebilirim'];
export const TEAM_STATUS = ['Takım arıyorum','Takımım var','Yedek oyuncu olurum','Koç/analist arıyorum','Sadece turnuva arıyorum'];
export const AVAILABILITY = ['Hafta içi akşam','Hafta sonu','Gece aktif','Gündüz aktif','Her gün aktif','Yoğunluk durumuna göre'];

export const DEMO_PLAYERS = [
  { uid:'demo-1', playerName:'RaiZela', city:'Çanakkale', game:'FiveM', rank:'Aile Lideri', gameRole:'Lider', platform:'PC', mic:'Mikrofon var', teamStatus:'Takımım var', availability:'Gece aktif', verified:true, bio:'Roleplay düzeni kuran, ekip yönetimi ve aile organizasyonu deneyimi yüksek oyuncu.' },
  { uid:'demo-2', playerName:'ClutchNova', city:'İstanbul', game:'Valorant', rank:'Ascendant 2', gameRole:'Controller', platform:'PC', mic:'Mikrofon var', teamStatus:'Takım arıyorum', availability:'Hafta içi akşam', verified:true, bio:'Smoker havuzum geniş, IGL çağrılarına uyumlu, düzenli scrim arıyorum.' },
  { uid:'demo-3', playerName:'HeadLine', city:'Ankara', game:'Counter-Strike 2', rank:'Premier 15-20K', gameRole:'AWPer', platform:'PC', mic:'Mikrofon var', teamStatus:'Yedek oyuncu olurum', availability:'Hafta sonu', verified:false, bio:'AWP + rifle hibrit oynarım. Turnuva disiplini olan takım arıyorum.' },
  { uid:'demo-4', playerName:'MaviKurt', city:'İzmir', game:'League of Legends', rank:'Diamond', gameRole:'Jungle', platform:'PC', mic:'Mikrofon var', teamStatus:'Takım arıyorum', availability:'Her gün aktif', verified:false, bio:'Objektif odaklı jungle, shotcall desteği verebilirim.' },
  { uid:'demo-5', playerName:'Barrett', city:'Bursa', game:'PUBG Mobile', rank:'Ace Master', gameRole:'Sniper', platform:'Mobil', mic:'Mikrofon var', teamStatus:'Takım arıyorum', availability:'Gece aktif', verified:true, bio:'Sniper ve scout rolünde aktif, düzenli turnuva kadrosu arıyor.' },
  { uid:'demo-6', playerName:'BoostLine', city:'Antalya', game:'Rocket League', rank:'Grand Champion', gameRole:'Rotator', platform:'PC', mic:'Mikrofon var', teamStatus:'Duo Partner', availability:'Hafta sonu', verified:false, bio:'Duo/3v3 takım disipliniyle oynarım, replay analizi severim.' }
];

export const DEMO_TEAMS = [
  { id:'team-demo-1', teamName:'EIGHT7 ESPOR', game:'Point Blank', wantedRole:'Sniper', minRank:'Pro', city:'Çanakkale', contact:'Discord', description:'Disiplinli maç takvimi olan, turnuva odaklı Point Blank kadrosu. Sniper ve support aranıyor.', verified:true },
  { id:'team-demo-2', teamName:'NG CARTEL', game:'FiveM', wantedRole:'Koruma', minRank:'Deneyimli', city:'İstanbul', contact:'Discord', description:'Roleplay aile düzeninde aktif, iletişimi güçlü ekip arkadaşları aranıyor.', verified:true },
  { id:'team-demo-3', teamName:'Nova Five', game:'Valorant', wantedRole:'Initiator', minRank:'Diamond 2', city:'Fark etmez', contact:'Discord', description:'Haftada 3 scrim, VOD analizi ve turnuva katılım hedefi olan ciddi takım.', verified:false }
];

export const DEMO_TOURNAMENTS = [
  { id:'t-1', name:'EsporGO Valorant Open Cup', game:'Valorant', date:'Yakında', format:'5v5', prize:'Sponsor ödül havuzu', status:'Kayıt yakında', teams:'32 takım', level:'Orta / ileri' },
  { id:'t-2', name:'Türkiye FiveM Roleplay Showcase', game:'FiveM', date:'Planlanıyor', format:'Ekip etkinliği', prize:'Topluluk vitrini', status:'Ön başvuru', teams:'16 ekip', level:'RP kalite odaklı' },
  { id:'t-3', name:'CS2 Clutch Night', game:'Counter-Strike 2', date:'Yakında', format:'5v5 eleme', prize:'Discord sponsorluğu', status:'Kayıt yakında', teams:'24 takım', level:'Premier 10K+' },
  { id:'t-4', name:'Mobile Legends TR Arena', game:'Mobile Legends: Bang Bang', date:'Planlanıyor', format:'5v5', prize:'Topluluk ödülü', status:'Ön başvuru', teams:'32 takım', level:'Epic+' }
];
