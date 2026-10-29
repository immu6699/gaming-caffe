// Cafe Games Library, Live Battle Station Telemetry, and 30-Year Cafe Wisdom

export interface ClassicCheat {
  code: string;
  effect: string;
  category: 'Chaos' | 'Health' | 'Weapons' | 'Vehicles' | 'Police' | 'LAN Rules' | 'Pro Config';
}

export interface CafeGame {
  id: string;
  title: string;
  subtitle: string;
  category: 'Cafe Classics' | 'Competitive Esports' | 'AAA Graphics' | 'Console Brawler';
  releaseYear: string;
  era: string;
  tagline: string;
  description: string;
  testedFps: string;
  storageGb: number;
  lanSupported: boolean;
  activePlayersInCafe: number;
  activeStations: string[];
  gradient: string;
  accentColor: string;
  badge: string;
  coverImage: string;
  bannerImage: string;
  rating: string;
  developer: string;
  tags: string[];
  demoType?: 'vice-city' | 'cs-aim' | 'nfs-drag';
  classicCheats?: ClassicCheat[];
  seniorWisdomNote: string;
}

export const CAFE_GAMES_CATALOG: CafeGame[] = [
  {
    id: 'gta-vice-city',
    title: 'Grand Theft Auto: Vice City',
    subtitle: '1986 Neon Retro & Next-Gen RTX Remaster',
    category: 'Cafe Classics',
    releaseYear: '2002 / 2024 Remaster',
    era: 'The Golden Cyber Cafe Era',
    tagline: 'Ocean Drive, Infernus, Synthwave Radio & A4 Paper Cheat Sheets',
    description:
      'The undisputed god of Indian cyber cafes. Cruising down Ocean Beach in a white Cheetah with Emotion 98.3 blasting on heavy CRT monitor headphones while the cafe counter bhaiya screams "Bhaiya 1 ghanta ho gaya, time badhana hai kya?!"',
    testedFps: '240 FPS (4K Ultra RTX)',
    storageGb: 45,
    lanSupported: true,
    activePlayersInCafe: 6,
    activeStations: ['PC-01 (Apex Predator VIP)', 'PC-04 (Elite Lounge)', 'PC-08 (Speedway Rig)'],
    gradient: 'from-fuchsia-600 via-pink-500 to-cyan-400',
    accentColor: '#ec4899',
    badge: '🌴 CAFE LEGEND #1',
    coverImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    rating: '10/10 Legend',
    developer: 'Rockstar Games',
    tags: ['Open World', '80s Miami', 'Synthwave', 'Cheat Codes', 'LAN Favorite'],
    demoType: 'vice-city',
    seniorWisdomNote:
      '"In 2003, we had 30 PCs and 28 were running Vice City simultaneously. If you did not know PANZER and ASPIRINE by heart, you were not allowed inside my cafe!"',
    classicCheats: [
      { code: 'PANZER', effect: 'Spawns pink Rhino Tank with 360° cannon', category: 'Chaos' },
      { code: 'ASPIRINE', effect: 'Full 100% Health & fixes body armor', category: 'Health' },
      { code: 'NUTTERTOOLS', effect: 'Heavy weapons pack (Minigun, RPG, Grenades)', category: 'Weapons' },
      { code: 'SEAWAYS', effect: 'Cars glide over ocean waves and water', category: 'Vehicles' },
      { code: 'LEAVEMEALONE', effect: 'Zero Wanted Level instantly', category: 'Police' },
      { code: 'PRECIOUSPROTECTION', effect: '100% Kevlar body armor', category: 'Health' },
      { code: 'BIGBANG', effect: 'Blows up all surrounding traffic into fireballs', category: 'Chaos' },
      { code: 'COMEFLYWITHME', effect: 'Low-gravity flying cars down the avenue', category: 'Vehicles' },
    ],
  },
  {
    id: 'cs-dust2',
    title: 'Counter-Strike 2 & CS 1.6',
    subtitle: 'de_dust2 LAN Cafe Championship Edition',
    category: 'Competitive Esports',
    releaseYear: '1999 - 2024',
    era: 'LAN Party Warfare',
    tagline: 'Rush B Don\'t Stop! Cross-room shouting across PC-01 to PC-10',
    description:
      'The pulse of every cyber cafe across 3 decades. From 100-ping coaxial LAN cables in 1999 to 360Hz Fast-IPS low latency today. AWP snipers holding Long Doors while teammates scream over the partition.',
    testedFps: '380+ FPS (360Hz Locked)',
    storageGb: 65,
    lanSupported: true,
    activePlayersInCafe: 12,
    activeStations: ['PC-02 (Titan Esports)', 'PC-03 (Viper Battle Rig)', 'PC-05 (Challenger)'],
    gradient: 'from-amber-500 via-orange-500 to-red-600',
    accentColor: '#f59e0b',
    badge: '💥 DE_DUST2 LAN',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    rating: '9.9/10 Esports God',
    developer: 'Valve Corporation',
    tags: ['Competitive 5v5', 'Tactical FPS', 'LAN Tournament', 'AWP Sniper', 'Dust 2'],
    demoType: 'cs-aim',
    seniorWisdomNote:
      '"Rule #1 of cyber cafe since 1999: You do NOT peek AWP Long doors if the guy on PC-03 has a 12-round streak, or you will buy him a Mountain Dew!"',
    classicCheats: [
      { code: 'sv_cheats 1; noclip', effect: 'Fly through walls (busted by cafe manager)', category: 'LAN Rules' },
      { code: 'cl_crosshair_size small', effect: 'Classic 1.6 pixel accurate green dot', category: 'Pro Config' },
      { code: 'volume 1; voice_scale 1', effect: 'Full footsteps acoustic clarity', category: 'Pro Config' },
      { code: 'mp_startmoney 16000', effect: 'Warmup buy round for full AWP team buy', category: 'LAN Rules' },
    ],
  },
  {
    id: 'nfs-most-wanted',
    title: 'Need for Speed: Most Wanted',
    subtitle: 'Blacklist #1 BMW M3 GTR Edition',
    category: 'Cafe Classics',
    releaseYear: '2005 / Widescreen HD',
    era: 'Underground Street Racing',
    tagline: 'Heat Level 5 Pursuit & Nitro Purge on Rockport Turnpike',
    description:
      'Razor stole your BMW M3 GTR. Climb the 15 Blacklist rivals with screaming twin-turbo engines, police spike strips, and rock tracks vibrating the cafe desks.',
    testedFps: '165 FPS (4K Widescreen Patch)',
    storageGb: 12,
    lanSupported: true,
    activePlayersInCafe: 5,
    activeStations: ['PC-08 (Speedway Rig)', 'Sim-01 (Racing Rig)'],
    gradient: 'from-blue-600 via-indigo-500 to-amber-400',
    accentColor: '#3b82f6',
    badge: '🏎️ BLACKLIST #1',
    coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    rating: '9.8/10 Racing King',
    developer: 'EA Black Box',
    tags: ['Street Racing', 'Police Pursuit', 'BMW M3 GTR', 'Blacklist', 'Nitro Purge'],
    demoType: 'nfs-drag',
    seniorWisdomNote:
      '"Every kid in 2005 used to bring their own USB pendrive with their NFS MW save file. The moment someone beat Razor, the whole cafe gathered behind his chair!"',
    classicCheats: [
      { code: 'castrol', effect: 'Unlocks Castrol Ford GT in bonus cars', category: 'Vehicles' },
      { code: 'iammostwanted', effect: 'Unlocks all Blacklist rivals instantly', category: 'Pro Config' },
      { code: 'givemethedrag', effect: 'Instant drag nitro boost kit', category: 'Weapons' },
    ],
  },
  {
    id: 'gta-v-fivem',
    title: 'Grand Theft Auto V & FiveM RP',
    subtitle: 'Custom Indian City Roleplay Servers',
    category: 'AAA Graphics',
    releaseYear: '2015 - 2024',
    era: 'Open World Heists',
    tagline: 'High-stakes bank heists, custom cafe liveries, and police pursuits',
    description:
      'Loaded with private FiveM RP servers, custom vehicle packs, Los Santos heist crews, and ultra graphics reshade presets running at blazing framerates.',
    testedFps: '180 FPS (4K Max Settings)',
    storageGb: 120,
    lanSupported: true,
    activePlayersInCafe: 7,
    activeStations: ['PC-04 (Elite Lounge)', 'PC-07 (RayTrace Suite)'],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentColor: '#10b981',
    badge: '🚓 FIVE-M ROLEPLAY',
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    rating: '9.9/10 Masterpiece',
    developer: 'Rockstar North',
    tags: ['Roleplay RP', 'Heists', 'Los Santos', 'Multiplayer', 'Ultra Reshade'],
    seniorWisdomNote:
      '"Kids today spend 6 hours roleplaying as cafe security guards inside GTA V instead of studying! But honestly, their teamwork is world class."',
  },
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077: Phantom Liberty',
    subtitle: 'Full Path Tracing & Overdrive DLSS 3.5',
    category: 'AAA Graphics',
    releaseYear: '2023 - 2024',
    era: 'Next-Gen Ultra Era',
    tagline: 'Night City in 4K HDR Ray Traced Glory with Zero Latency',
    description:
      'Max out Dogtown on our flagship RTX 4090 24GB rigs. Pure visual feast with neon rain reflections, full path tracing, and zero frame stuttering.',
    testedFps: '120 FPS (4K Path Tracing)',
    storageGb: 110,
    lanSupported: false,
    activePlayersInCafe: 5,
    activeStations: ['PC-01 (Apex Predator VIP)', 'PC-07 (RayTrace Suite)'],
    gradient: 'from-yellow-400 via-amber-500 to-cyan-400',
    accentColor: '#eab308',
    badge: '⚡ RTX 4090 SHOWCASE',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    rating: '9.6/10 Ray Tracing King',
    developer: 'CD PROJEKT RED',
    tags: ['Path Tracing', 'Night City', 'Cyberware', 'Keanu Reeves', 'DLSS 3.5'],
    seniorWisdomNote:
      '"Back in 1996, our computers had 16 Megabytes of RAM. Now a single graphics card here has 24 Gigabytes of VRAM! Night City looks realer than the street outside!"',
  },
  {
    id: 'tekken-8',
    title: 'Tekken 8',
    subtitle: 'PS5 Pro Tournament Station & Arcade Sticks',
    category: 'Console Brawler',
    releaseYear: '2024',
    era: 'Fighting Arena Grudge Matches',
    tagline: 'Heat System, Mishima Electric Wind God Fist, Zero Input Lag',
    description:
      'The classic cafe 1v1 grudge match destination! Hooked up to 65" 144Hz Sony Bravia OLED screens with custom Sanwa arcade sticks and DualSense controllers.',
    testedFps: '60 FPS Locked (Zero Jitter)',
    storageGb: 85,
    lanSupported: true,
    activePlayersInCafe: 8,
    activeStations: ['Console-01 (PS5 VIP)', 'Console-02 (PS5 Duo)'],
    gradient: 'from-red-600 via-rose-500 to-purple-600',
    accentColor: '#f43f5e',
    badge: '🥊 1V1 GRUDGE MATCH',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80',
    rating: '9.5/10 Fighter',
    developer: 'Bandai Namco',
    tags: ['1v1 Versus', 'Arcade Stick', 'Mishima Clan', 'Heat Gauge', 'Fighting'],
    seniorWisdomNote:
      '"Tekken 3 in 1998 had Eddie Gordo button smashers. Tekken 8 in 2024 still has people spamming buttons! Some things in gaming cafes never change."',
  },
  {
    id: 'valorant',
    title: 'Valorant Radiant Comp',
    subtitle: '128-Tick Esports Fiber Dedicated Routing',
    category: 'Competitive Esports',
    releaseYear: '2020 - Present',
    era: 'Tactical Esports Era',
    tagline: 'Sub-8ms Ping, 360Hz Monitors & Pro Peripherals',
    description:
      'Pre-tuned for competitive rank push. Custom optical route to Mumbai and Singapore servers with zero packet loss, Razer Huntsman V3 analog switches, and DeathAdder V3 8000Hz mice.',
    testedFps: '450+ FPS',
    storageGb: 38,
    lanSupported: false,
    activePlayersInCafe: 14,
    activeStations: ['PC-02', 'PC-03', 'PC-05', 'PC-06'],
    gradient: 'from-rose-500 via-red-500 to-teal-400',
    accentColor: '#fb7185',
    badge: '🎯 RADIANT 360HZ',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80',
    rating: '9.4/10 Ranked Arena',
    developer: 'Riot Games',
    tags: ['Hero Shooter', '128 Tick', 'Zero Ping', 'Ranked Radiant', 'Esports'],
    seniorWisdomNote:
      '"You missed your Jett knives? Don\'t blame my cafe keyboard, beta! We test these analog switches every morning at 9 AM with digital calibrators!"',
  },
  {
    id: 'ea-fc-24',
    title: 'EA Sports FC 24',
    subtitle: 'PlayStation 5 Tournament 2v2 Couch Derby',
    category: 'Console Brawler',
    releaseYear: '2024',
    era: 'Sports Derby Era',
    tagline: 'Ultimate Team, HyperMotion V & Real-Time Derby Grudges',
    description:
      'The biggest crowd gatherer at the cafe lounge couch! Scream alongside your college friends during 90th-minute stoppage time penalty shootouts.',
    testedFps: '120 FPS (4K DualSense)',
    storageGb: 72,
    lanSupported: true,
    activePlayersInCafe: 6,
    activeStations: ['Console-03 (Lounge PS5)', 'Console-04 (PS5 Pro)'],
    gradient: 'from-green-600 via-emerald-500 to-teal-500',
    accentColor: '#10b981',
    badge: '⚽ 2V2 COUCH DERBY',
    coverImage: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    rating: '9.2/10 Cafe Classic',
    developer: 'EA Sports',
    tags: ['Football Soccer', 'Couch Co-op', '2v2 Derby', 'DualSense', 'Championship'],
    seniorWisdomNote:
      '"Every Friday night, two friends come here as best buddies and leave screaming at each other over an offside goal in the 93rd minute!"',
  },
  {
    id: 'forza-horizon-5',
    title: 'Forza Horizon 5',
    subtitle: 'Direct-Drive Force Feedback Sim-Rig',
    category: 'AAA Graphics',
    releaseYear: '2023 - 2024',
    era: 'Sim Racing Glory',
    tagline: 'Fanatec DD Pro Wheel, Hydraulic Load-Cell Pedals & 4K Triple-Screen',
    description:
      'Blaze across vibrant Mexico with roaring V12 engines, dynamic dust storms, and realistic tactile force feedback that kicks your arms on every turn.',
    testedFps: '144 FPS (Triple-Screen 4K)',
    storageGb: 135,
    lanSupported: true,
    activePlayersInCafe: 4,
    activeStations: ['Sim-01 (Racing Rig)', 'Sim-02 (GT Cockpit)'],
    gradient: 'from-orange-500 via-amber-500 to-red-500',
    accentColor: '#f97316',
    badge: '🏁 SIM COCKPIT PRO',
    coverImage: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    rating: '9.7/10 Sim God',
    developer: 'Playground Games',
    tags: ['Sim Racing', 'Force Feedback', 'V12 Sound', 'Open World', 'Triple Screen'],
    seniorWisdomNote:
      '"If you spin out on the volcano pass, don\'t yank the Fanatec steering wheel! That wheel has 15 Newton-meters of real motor torque!"',
  },
  {
    id: 'cod-warzone',
    title: 'Call of Duty: Warzone & MW3',
    subtitle: 'Quad Battle Royale & Low Ping Fiber',
    category: 'Competitive Esports',
    releaseYear: '2024',
    era: 'Battle Royale Warfare',
    tagline: 'Gulag 1v1 clutches, tactical slide cancels, and squad UAV callouts',
    description:
      'High-octane 120-player Battle Royale warfare. Tuned with low latency optical routing to Singapore/Mumbai and Astro A50 wireless spatial audio.',
    testedFps: '220 FPS (Competitive Low Settings)',
    storageGb: 140,
    lanSupported: false,
    activePlayersInCafe: 9,
    activeStations: ['PC-05 (Challenger Rig)', 'PC-06 (Battle Station)'],
    gradient: 'from-zinc-700 via-zinc-800 to-black',
    accentColor: '#71717a',
    badge: '🪖 120-PLAYER BR',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
    rating: '9.3/10 Battle Royale',
    developer: 'Activision',
    tags: ['Battle Royale', 'Gulag Clutch', 'Tactical Shooter', 'Squad Warfare'],
    seniorWisdomNote:
      '"Hearing 4 boys screaming \'HE IS ONE SHOT, HE IS ONE SHOT!\' across desk 5 is the background music of my life!"',
  },
  {
    id: 'road-rash-retro',
    title: 'Road Rash 95 & Tekken 3 Retro Corner',
    subtitle: 'The 90s Cyber Cafe Origin Legends',
    category: 'Cafe Classics',
    releaseYear: '1995 / 1997',
    era: 'The 90s Coaxial LAN Pioneers',
    tagline: 'Chain whips, kicking motorcycle cops into oncoming trucks',
    description:
      'Where cyber cafe culture was born in India. The sound of revving bikes, kicking Officer O\'Leary off his cruiser, and laughing with your best friend sitting on the wooden chair next to you.',
    testedFps: '60 FPS (100% Nostalgia)',
    storageGb: 2,
    lanSupported: true,
    activePlayersInCafe: 3,
    activeStations: ['PC-09 (Retro Nostalgia Desk)'],
    gradient: 'from-purple-600 via-indigo-600 to-pink-500',
    accentColor: '#a855f7',
    badge: '🕹️ 1995 CAFE ORIGIN',
    coverImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    rating: '10/10 Nostalgia Crown',
    developer: 'Electronic Arts (1995)',
    tags: ['Retro DOS', 'Motorcycle Fight', 'Chain Whip', 'Origin of Indian Cafes'],
    seniorWisdomNote:
      '"This game bought the first motorcycle I ever owned in real life from the cafe profits! Hit \'N\' to kick and \'Space\' to swing the chain whip!"',
  },
];

// Senior Cafe Operator Profile & 30-Year Wisdom
export const SENIOR_CAFE_MASTER = {
  name: 'Bhaiya "Uncle" Jagdish / Master JD',
  title: 'Senior Cyber & Gaming Cafe Operator',
  experienceYears: 30,
  servingSince: 'Est. 1994 (30 Years Behind The Counter)',
  quote:
    '"I have seen floppy disks turn into M.2 NVMe SSDs, mouse balls turn into 8000Hz optical sensors, and dial-up screeching turn into 1-gigabit fiber. But the thrill of hitting Tommy Vercetti\'s PANZER cheat or clutching a 1v4 on de_dust2? That never changes."',
  cafeMemories: [
    {
      era: '1994 - 1998',
      title: 'The Coaxial LAN & Floppy Era',
      story:
        'We started with 6 PCs, Pentium 100MHz, and black-and-white mouse balls that we cleaned every night with cotton buds and aftershave. Doom 2 and Duke Nukem 3D LAN matches where if someone kicked the blue coax cable, all 6 PCs crashed simultaneously!',
    },
    {
      era: '2000 - 2005',
      title: 'The Vice City & CS 1.6 Golden Age',
      story:
        'The era of Xeroxed cheat sheets! Every morning, kids would queue outside by 8 AM with 10-rupee notes. GTA Vice City was running on every single monitor. The counter desk was covered in handwritten notes: ASPIRINE, NUTTERTOOLS, SEAWAYS, PANZER.',
    },
    {
      era: '2006 - 2012',
      title: 'NFS Most Wanted & Dota 1 All-Nighters',
      story:
        'Rockport Blacklist rivalries and 5v5 Dota 1 LAN tournaments that went on until 5 AM. We survived on lukewarm cutting chai, spicy 2-minute Maggi, and cold Limca. That brotherhood formed friendships that last to this day.',
    },
    {
      era: '2016 - 2024+',
      title: 'The 360Hz Esports Arena Era',
      story:
        'Today, you boys and girls play on liquid-cooled RTX 4090s and 360Hz OLED displays. But remember: high FPS doesn\'t give you game sense. Your reflexes, your callouts, and your heart are what make a true cafe champion!',
    },
  ],
  handwrittenCheatSheet: [
    { code: 'PANZER', meaning: 'Spawns Rhino Tank. Destroys anything in your path. Classic cafe chaos.' },
    { code: 'ASPIRINE', meaning: 'Restores 100% Health instantly. Used when Tommy was at 2 HP.' },
    { code: 'NUTTERTOOLS', meaning: 'All heavy weapons: Minigun, RPG, sniper rifle, and grenades.' },
    { code: 'PRECIOUSPROTECTION', meaning: 'Full 100% Kevlar body armor vest.' },
    { code: 'LEAVEMEALONE', meaning: 'Drops all 6 police wanted stars back to zero.' },
    { code: 'SEAWAYS', meaning: 'Drive your sports car right onto the ocean water like a speedboat.' },
    { code: 'BIGBANG', meaning: 'All cars on the road explode at once into giant fireballs.' },
    { code: 'COMEFLYWITHME', meaning: 'Dodo low-gravity flight mode for any car on the street.' },
    { code: 'FANNYMAGNET', meaning: 'All Vice City pedestrians follow Tommy Vercetti.' },
    { code: 'ONSPEED', meaning: 'Everything speeds up at 2x fast-forward tempo.' },
  ],
  rulesOfSeniorCafe: [
    'Rule 1: Never touch the power strip with your shoes off.',
    'Rule 2: No banging the mechanical keyboard if you get headshotted through smoke.',
    'Rule 3: If you shout "RUSH B" inside the cafe, all 5 players must rush B.',
    'Rule 4: Double cheese Maggi + Chilled Energy Drink = +25% reaction speed.',
    'Rule 5: Always say "GG" to your opponent before shutting down your rig.',
  ],
};
