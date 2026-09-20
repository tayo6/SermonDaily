import { Contributor, ChurchInfo, Sermon, Devo, NotificationItem } from './types';

export const YOU: Contributor = {
  id: 'you',
  name: 'You',
  ini: 'U',
  col: '#7D5E45',
  church: 'Hope Chapel',
  doc: 'Non-denominational',
  loc: '—',
  focus: ['Adults'],
  notes: 1,
  followers: 12,
  ver: false,
};

export const CONTRIBUTORS: Contributor[] = [
  { id: 'davidc', name: 'David Chen', ini: 'DC', col: '#5E8C7B', church: 'Grace Community Church', doc: 'Reformed', loc: 'Los Angeles', focus: ['Adults'], notes: 7, followers: 88, bio: 'Capturing sound doctrine and sung worship, one service at a time.', ver: false },
  { id: 'mark', name: 'Rev. Mark Thompson', ini: 'MT', col: '#6B7B5E', church: 'City Light Cathedral', doc: 'Charismatic', loc: 'Los Angeles', focus: ['Adults'], notes: 42, followers: 540, bio: 'Preaching Christ-centred purpose for over 20 years.', ver: true },
  { id: 'olumide', name: 'Olumide Adebayo', ini: 'OA', col: '#B0713A', church: 'The Elevation Church', doc: 'Pentecostal', loc: 'Lagos', focus: ['Teens'], notes: 22, followers: 320, bio: 'Youth minister raising bold, Scripture-rooted teenagers.', ver: false },
  { id: 'edward', name: 'Rev. Edward Sterling', ini: 'ES', col: '#4E6E8E', church: 'Holy Trinity Brompton (HTB)', doc: 'Anglican', loc: 'London', focus: ['Adults'], notes: 17, followers: 290, bio: 'Alpha host. Writes on hospitality and everyday evangelism.', ver: true },
  { id: 'blessing', name: 'Blessing Okonjo', ini: 'BO', col: '#8E5E7E', church: 'Daystar Christian Centre', doc: 'Pentecostal', loc: 'Lagos', focus: ['Kids'], notes: 18, followers: 245, bio: 'Children’s pastor making big truths simple for little hearts.', ver: true },
  { id: 'hannah', name: 'Hannah Morales', ini: 'HM', col: '#5E7B8C', church: 'Bethel Church', doc: 'Charismatic', loc: 'Redding', focus: ['Adults'], notes: 12, followers: 215, bio: 'Worshipper and writer on the presence of God.', ver: false },
  { id: 'austin', name: 'Austin Wright', ini: 'AW', col: '#7A6A54', church: 'The Village Church', doc: 'Reformed', loc: 'Dallas', focus: ['Adults'], notes: 14, followers: 195, bio: 'Expository notes, verse by verse.', ver: false },
  { id: 'maria', name: 'Maria Santos', ini: 'MS', col: '#A85A4E', church: 'Grace Christian Church', doc: 'Non-denominational', loc: 'Manila', focus: ['Kids', 'Teens'], notes: 26, followers: 180, bio: 'Curriculum writer for next-gen ministries.', ver: false },
  { id: 'samuel', name: 'Samuel Kariuki', ini: 'SK', col: '#4E7A6A', church: 'Nairobi Chapel', doc: 'Non-denominational', loc: 'Nairobi', focus: ['Adults', 'Teens'], notes: 15, followers: 150, bio: 'Kingdom, culture and marketplace discipleship.', ver: true },
  { id: 'sarah', name: 'Sarah Jenkins', ini: 'SJ', col: '#7A8B6F', church: 'Grace Community Church', doc: 'Reformed', loc: 'Los Angeles', focus: ['Adults'], notes: 9, followers: 120, bio: 'Note-taking member — capturing revelation every Sunday.', ver: false },
  { id: 'david', name: 'David Okafor', ini: 'DO', col: '#3E5E56', church: 'Reality LA', doc: 'Baptist', loc: 'Los Angeles', focus: ['Teens'], notes: 11, followers: 98, bio: 'Campus minister. Sermon notes for students.', ver: false },
  { id: 'abena', name: 'Abena Mensah', ini: 'AM', col: '#8E7A3A', church: 'ICGC Christ Temple', doc: 'Pentecostal', loc: 'Accra', focus: ['Kids'], notes: 8, followers: 76, bio: 'Sunday school teacher and memory-verse enthusiast.', ver: false },
  { id: 'ruth', name: 'Ruth Simmons', ini: 'RS', col: '#6A5E8E', church: 'Riverside Church Sydney', doc: 'Methodist', loc: 'Sydney', focus: ['Adults'], notes: 6, followers: 60, bio: 'Lectionary reflections and quiet-day notes.', ver: false },
];

export function getContributor(id: string): Contributor {
  if (id === 'you') return YOU;
  const found = CONTRIBUTORS.find(c => c.id === id);
  return found || YOU;
}

export const CHURCH_DB: Record<string, ChurchInfo> = {
  'Hope Chapel': { region: 'North America', city: 'Los Angeles', st: 'California', co: 'United States', pastor: '', doc: 'Non-denominational', desc: 'Your home church on Sermon Daily.', home: true },
  'Grace Community Church': { region: 'North America', city: 'Sun Valley', st: 'California', co: 'United States', pastor: 'John MacArthur', doc: 'Reformed', desc: 'A historic Bible-teaching community located in the San Fernando Valley, California.' },
  'Bethel Church': { region: 'North America', city: 'Redding', st: 'California', co: 'United States', pastor: 'Bill Johnson', doc: 'Charismatic', desc: 'A congregation pursuing revival culture, worship and the supernatural work of the Holy Spirit.' },
  'The Elevation Church': { region: 'Africa', city: 'Lagos', st: '', co: 'Nigeria', pastor: 'Poju Oyemade', doc: 'Pentecostal', desc: 'Raising a generation of kingdom-minded believers committed to societal transformation.' },
  'Holy Trinity Brompton (HTB)': { region: 'Europe', city: 'London', st: '', co: 'United Kingdom', pastor: 'Nicky Gumbel', doc: 'Anglican', desc: 'Home of Alpha — a family of churches focused on evangelism and discipleship.' },
  'Daystar Christian Centre': { region: 'Africa', city: 'Lagos', st: '', co: 'Nigeria', pastor: 'Sam Adeyemi', doc: 'Pentecostal', desc: 'Raising successful leaders through practical Bible teaching.' },
  'Nairobi Chapel': { region: 'Africa', city: 'Nairobi', st: '', co: 'Kenya', pastor: 'Oscar Muriu', doc: 'Non-denominational', desc: 'A movement growing deep-rooted, kingdom-impact churches across Africa.' },
  'The Village Church': { region: 'North America', city: 'Dallas', st: 'Texas', co: 'United States', pastor: 'Matt Chandler', doc: 'Baptist', desc: 'A church committed to gospel-centred, expository preaching.' },
  'City Light Cathedral': { region: 'North America', city: 'Los Angeles', st: 'California', co: 'United States', pastor: 'Daniel Kim', doc: 'Non-denominational', desc: 'A city church shining the light of Christ in the heart of LA.' },
  'Reality LA': { region: 'North America', city: 'Los Angeles', st: 'California', co: 'United States', pastor: 'Tim Chaddick', doc: 'Baptist', desc: 'A gospel community for the city — expository teaching, deep community.' },
  'Riverside Church Sydney': { region: 'Oceania', city: 'Sydney', st: '', co: 'Australia', pastor: 'Rev. Thomas Hale', doc: 'Methodist', desc: 'A warm city church in the Methodist tradition — liturgy, justice and open tables.' },
  'Sacred Heart Parish': { region: 'Europe', city: 'Dublin', st: '', co: 'Ireland', pastor: 'Fr. Michael O’Brien', role: 'Parish Priest', doc: 'Catholic', desc: 'A vibrant Catholic parish — Mass, adoration and community life in the heart of Dublin.' },
};

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: 'p9',
    by: 'davidc',
    church: 'Grace Community Church',
    speaker: 'Pastor Chris Tomlin',
    series: 'Heart of Worship',
    focus: 'Adults',
    title: 'The Sound of Worship',
    excerpt: 'It’s not about the music, it’s about the posture of our hearts. When we sing, we are declaring war on the lies of the enemy…',
    tags: ['Worship', 'Praise', 'Spiritual Warfare', 'Prayer'],
    date: 'Sun, 5 Nov',
    read: '2 min read',
    amen: 56,
    media: { v: 1, a: 1 },
    time: '06:00 PM',
    cat: 'General',
    body: [
      '<h3>The Heart of Worship</h3>',
      '<p>It’s not about the music, it’s about the posture of our hearts. When we sing, we are declaring war on the lies of the enemy.</p>',
      '<h3>Why we sing?</h3>',
      '<ul><li>To remember God’s faithfulness.</li><li>To shift our atmosphere.</li><li>To unify the body.</li></ul>',
      '<p>I managed to record the bridge of the final song — it was powerful (check the audio below).</p>',
      '<h3>Practical Application</h3>',
      '<p>Start your day with a song of praise before you look at your phone.</p>',
    ],
    refl: [{ by: 'hannah', txt: 'The bridge moment wrecked me. “Shift our atmosphere” has been my prayer all week.', audio: 'demo', dur: 4 }],
  },
  {
    id: 'p1',
    by: 'sarah',
    church: 'Grace Community Church',
    speaker: 'Pastor Chris Tomlin',
    series: 'Heart of Worship',
    focus: 'Adults',
    title: 'The Secret Place of the Most High',
    excerpt: '<span class="scripture">Psalm 91</span> — “He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty.” Intimacy is not earned in the crowd; it is cultivated in secret…',
    tags: ['Worship', 'Prayer', 'Intimacy'],
    date: 'Sun, 19 Nov',
    read: '1 min read',
    amen: 31,
    media: null,
    time: '10:00 AM',
    cat: 'General',
    body: [
      '<p><span class="scripture">Psalm 91:1–2</span> — “He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty. I will say of the Lord, ‘He is my refuge and my fortress.’”</p>',
      '<h3>Three movements</h3><ul><li>Dwelling — proximity, not visits</li><li>Abiding — staying when it costs</li><li>Declaring — testimony born of intimacy</li></ul>',
      '<p>Worship is not the warm-up for the word; it is the address where the word finds us.</p>',
    ],
    refl: [{ by: 'austin', txt: '“Cultivated in secret” — preach. Needed this before Monday.' }],
  },
  {
    id: 'p2',
    by: 'austin',
    church: 'The Village Church',
    speaker: 'Matt Chandler',
    series: 'Grace & Truth',
    focus: 'Adults',
    title: 'The Weight of Glory & Grace',
    excerpt: '<span class="scripture">Romans 8:1</span> — “There is therefore now no condemnation for those who are in Christ Jesus.” Grace is not the absence of weight; it is a different weight entirely…',
    tags: ['Grace', 'Identity', 'Cross'],
    date: 'Sun, 12 Nov',
    read: '2 min read',
    amen: 27,
    media: null,
    time: '09:00 AM',
    cat: 'General',
    body: [
      '<p><span class="scripture">Romans 8:1</span> — “There is therefore now no condemnation for those who are in Christ Jesus.”</p>',
      '<h3>Grace that outweighs</h3>',
      '<p>The glory we were made for makes present suffering weigh little — and grace is what makes glory possible.</p>',
    ],
    refl: [],
  },
  {
    id: 'p3',
    by: 'olumide',
    church: 'The Elevation Church',
    speaker: 'Pastor Wale Adams',
    series: 'Do Something',
    focus: 'Teens',
    title: 'Raising Daniel-Eyed Teenagers',
    excerpt: '<span class="scripture">Daniel 1:8</span> — “But Daniel purposed in his heart that he would not defile himself.” Conviction is decided before the crisis arrives…',
    tags: ['Courage', 'Youth', 'Conviction'],
    date: 'Sat, 18 Nov',
    read: '2 min read',
    amen: 44,
    media: { v: 1 },
    time: '05:00 PM',
    cat: 'Youth Group',
    body: [
      '<p><span class="scripture">Daniel 1:8</span> — “But Daniel purposed in his heart that he would not defile himself.”</p>',
      '<h3>Convictions before crises</h3>',
      '<p>Teenagers don’t need entertainment; they need a reason. Daniel had one — and it was settled in private long before it was tested in public.</p>',
    ],
    refl: [],
  },
  {
    id: 'p4',
    by: 'mark',
    church: 'City Light Cathedral',
    speaker: 'Rev. Mark Thompson',
    series: 'Identity & Destiny',
    focus: 'Adults',
    title: 'Walking in Divine Purpose',
    excerpt: '<span class="scripture">Ephesians 2:10</span> — “We are God’s handiwork, created in Christ Jesus to do good works.” Purpose is received, not achieved…',
    tags: ['Purpose', 'Holy Spirit', 'Calling'],
    date: 'Sun, 5 Nov',
    read: '1 min read',
    amen: 58,
    media: { v: 1, a: 1 },
    time: '10:00 AM',
    cat: 'General',
    body: [
      '<p><span class="scripture">Ephesians 2:10</span> — “We are God’s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.”</p>',
      '<h3>Purpose is received</h3>',
      '<p>You don’t find your purpose. You follow the Person who wrote it.</p>',
    ],
    refl: [],
  },
  {
    id: 'p5',
    by: 'blessing',
    church: 'Daystar Christian Centre',
    speaker: 'Teacher Blessing',
    series: 'Kingdom Kids',
    focus: 'Kids',
    title: 'Noah’s Big Boat',
    kidsart: 'ark',
    memory: 'Genesis 9:13',
    excerpt: 'A rainbow promise after a very big boat!',
    tags: ['Children', 'Trust'],
    date: 'Sun, 19 Nov',
    read: '1 min read',
    amen: 33,
    media: null,
    time: '09:00 AM',
    cat: 'Kids Ministry',
    body: [
      '<p>God asked Noah to build a HUGE boat! 🚢</p>',
      '<h3>Two by two</h3>',
      '<p>The animals came two by two — lions, sheep, even snails! 🐘🦒</p>',
      '<h3>The rainbow promise</h3>',
      '<p>After the rain, God put a rainbow in the sky. It means: “I always keep my promises!” 🌈</p>',
    ],
    refl: [],
  },
  {
    id: 'p10',
    by: 'maria',
    church: 'Grace Christian Church',
    speaker: 'Teacher Maria',
    series: 'Kingdom Kids',
    focus: 'Kids',
    title: 'The Lost Sheep Party',
    kidsart: 'sheep',
    memory: 'Luke 15:6',
    excerpt: 'One lost sheep. One big party!',
    tags: ['Children', 'Joy'],
    date: 'Sun, 12 Nov',
    read: '1 min read',
    amen: 28,
    media: null,
    time: '09:00 AM',
    cat: 'Kids Ministry',
    body: [
      '<p>A shepherd had 100 sheep — and one got lost! 🐑</p>',
      '<h3>The search</h3>',
      '<p>He looked everywhere. Hills. Bushes. Behind rocks!</p>',
      '<h3>The party</h3>',
      '<p>When he found it, he threw a PARTY! Jesus says heaven parties when one person comes home. 🎉</p>',
    ],
    refl: [],
  },
  {
    id: 'p11',
    by: 'blessing',
    church: 'Daystar Christian Centre',
    speaker: 'Teacher Blessing',
    series: 'Kingdom Kids',
    focus: 'Kids',
    title: 'Jonah and the Big Fish',
    kidsart: 'whale',
    memory: 'Jonah 1:17',
    excerpt: 'You can’t run away from God — and that’s good news!',
    tags: ['Children', 'Obedience'],
    date: 'Sun, 5 Nov',
    read: '1 min read',
    amen: 40,
    media: null,
    time: '09:00 AM',
    cat: 'Kids Ministry',
    body: [
      '<p>God said: “Go to Nineveh!” Jonah said: “No!” and sailed the other way. ⛵</p>',
      '<h3>SPLASH!</h3>',
      '<p>A big fish swallowed Jonah. Three days inside — dark and smelly!</p>',
      '<h3>The second chance</h3>',
      '<p>Jonah prayed, the fish spat him out, and this time he obeyed. God always gives second chances. 🐟</p>',
    ],
    refl: [],
  },
  {
    id: 'p6',
    by: 'edward',
    church: 'Holy Trinity Brompton (HTB)',
    speaker: 'Rev. Edward Sterling',
    series: 'Alpha Foundations',
    focus: 'Adults',
    title: 'The Hospitable Church',
    excerpt: '<span class="scripture">Romans 15:7</span> — “Welcome one another, as Christ welcomed you.” Hospitality is still the widest door into the Kingdom…',
    tags: ['Evangelism', 'Community'],
    date: 'Wed, 9 Nov',
    read: '2 min read',
    amen: 19,
    media: null,
    time: '07:00 PM',
    cat: 'General',
    body: [
      '<p><span class="scripture">Romans 15:7</span> — “Welcome one another, as Christ welcomed you, for the glory of God.”</p>',
      '<h3>Welcome as worship</h3>',
      '<p>Alpha began with food and a question. The table is still the most disarming altar in the house.</p>',
    ],
    refl: [],
  },
  {
    id: 'p7',
    by: 'hannah',
    church: 'Bethel Church',
    speaker: 'Hannah Morales',
    series: 'Atmosphere of Heaven',
    focus: 'Adults',
    title: 'When Worship Becomes Warfare',
    excerpt: '<span class="scripture">2 Chronicles 20</span> — Jehoshaphat put the singers in front of the army. Praise positioned them to watch God fight…',
    tags: ['Worship', 'Spiritual Warfare', 'Praise'],
    date: 'Sun, 29 Oct',
    read: '1 min read',
    amen: 36,
    media: { a: 1 },
    time: '11:00 AM',
    cat: 'General',
    body: [
      '<p><span class="scripture">2 Chronicles 20:21–22</span> — “Jehoshaphat appointed men to sing to the Lord… As they began to sing and praise, the Lord set ambushes.”</p>',
      '<h3>Singers went first</h3>',
      '<p>The choir led the army. Praise is not the absence of the battle — it is the posture that wins it.</p>',
    ],
    refl: [],
  },
  {
    id: 'p8',
    by: 'samuel',
    church: 'Nairobi Chapel',
    speaker: 'Samuel Kariuki',
    series: 'Kingdom Economics',
    focus: 'Adults',
    title: 'Money, Mission & the Kingdom',
    excerpt: '<span class="scripture">2 Corinthians 9:7</span> — “God loves a cheerful giver.” The Kingdom economy runs on generosity — sown, not hoarded…',
    tags: ['Generosity', 'Stewardship'],
    date: 'Sun, 22 Oct',
    read: '3 min read',
    amen: 25,
    media: null,
    time: '09:30 AM',
    cat: 'General',
    body: [
      '<p><span class="scripture">2 Corinthians 9:7</span> — “Each of you should give what you have decided in your heart to give, for God loves a cheerful giver.”</p>',
      '<h3>Cheerful givers, cheerful God</h3>',
      '<p>The Kingdom economy runs on generosity — seed, not surplus; sown, not hoarded.</p>',
    ],
    refl: [],
  },
];

export const PALETTE: [string, string][] = [
  ['#E4571E', '#C74612'],
  ['#7A8B6F', '#5E704F'],
  ['#4E6E8E', '#3A5673'],
  ['#8E5E7E', '#6E4663'],
  ['#B0713A', '#8F5726'],
  ['#3E7A6A', '#2E5F52'],
];

export function devoBG(d: Devo): string {
  if (d.bg !== undefined && typeof d.bg === 'number' && d.bg >= 0 && d.bg < PALETTE.length) {
    return `linear-gradient(135deg, ${PALETTE[d.bg][0]}, ${PALETTE[d.bg][1]})`;
  }
  if (typeof d.bg === 'string' && d.bg.startsWith('linear-gradient')) {
    return d.bg;
  }
  return seriesCol(d.title);
}

export const INITIAL_DEVOS: Devo[] = [
  { id: 'd1', by: 'hannah', title: 'First Light', scr: 'Psalm 5:3', text: '“In the morning, Lord, you hear my voice…” Before the day gets a word in, give God the first word.', time: '2h', amen: 41, bg: 0 },
  { id: 'd2', by: 'hannah', title: 'Oil Before Crowns', scr: '1 Samuel 16:13', text: 'David was anointed long before he was crowned. What God pours in private, He crowns in public.', time: '2h', amen: 38, bg: 3 },
  { id: 'd3', by: 'olumide', title: 'Morning Fire', scr: 'Leviticus 6:12', text: 'The fire on the altar had to be kept burning every morning. Grace lit it — discipleship keeps it.', time: '4h', amen: 57, bg: 4 },
  { id: 'd4', by: 'samuel', title: 'Daily Manna', scr: 'Exodus 16:21', text: 'Manna melted with the morning sun. Some mercies are only collected early. Wake. Gather. Worship.', time: '6h', amen: 29, bg: 2 },
  { id: 'd5', by: 'davidc', title: 'Scan the Skies First', scr: 'Psalm 143:8', text: '“Let the morning bring me word of your unfailing love.” Check the heavens before the headlines.', time: '8h', amen: 33, bg: 1 },
  { id: 'd6', by: 'blessing', title: 'Little Feet, Big Steps', scr: 'Proverbs 22:6', text: 'Start children on the way they should go — one morning at a time. Today with your kids: Mark 10:14.', time: '9h', amen: 21, bg: 0 },
  { id: 'd7', by: 'ruth', title: 'Still Waters First', scr: 'Psalm 23:2', text: 'He makes me lie down — rest is appointed, not earned. Begin today from rest, not for it.', time: '12h', amen: 18, bg: 5 },
];

export const INITIAL_SCHED: Array<{ id: string; when: number; title: string; by: string; church: string }> = [
  { id: 'sd1', when: Date.now() + (9 * 3600 + 17 * 60) * 1000, title: 'The Altar of Fire', by: 'olumide', church: 'The Elevation Church' },
];

export const VERSES: Record<string, string> = {
  'Psalm 91:1–2': 'He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty. I will say of the LORD, “He is my refuge and my fortress, my God, in whom I trust.”',
  'Romans 8:1': 'There is therefore now no condemnation for those who are in Christ Jesus.',
  'Daniel 1:8': 'But Daniel purposed in his heart that he would not defile himself with the king’s delicacies, nor with the wine which he drank.',
  'Ephesians 2:10': 'For we are His workmanship, created in Christ Jesus for good works, which God prepared beforehand that we should walk in them.',
  'Mark 10:14': 'Let the little children come to Me, and do not forbid them; for of such is the kingdom of God.',
  'Romans 15:7': 'Therefore receive one another, just as Christ also received us, to the glory of God.',
  '2 Chronicles 20:21–22': 'When they began to sing and to praise, the LORD set ambushes against the people… and they were defeated.',
  '2 Corinthians 9:7': 'God loves a cheerful giver.',
  'Psalm 5:3': 'My voice You shall hear in the morning, O LORD; in the morning I will direct it to You, and I will look up.',
  '1 Samuel 16:13': '…and the Spirit of the LORD came upon David from that day forward.',
  'Leviticus 6:12': 'The fire on the altar shall be kept burning on it; it shall not be put out. And the priest shall burn wood on it every morning.',
  'Exodus 16:21': 'So they gathered it every morning, every man according to his need. And when the sun became hot, it melted.',
  'Psalm 143:8': 'Cause me to hear Your lovingkindness in the morning, for in You do I trust; cause me to know the way in which I should walk.',
  'Proverbs 22:6': 'Train up a child in the way he should go, and when he is old he will not depart from it.',
  'Psalm 23:2': 'He makes me to lie down in green pastures; He leads me beside the still waters.',
  'Genesis 9:13': 'I set My rainbow in the cloud, and it shall be for the sign of the covenant between Me and the earth.',
  'Luke 15:6': 'Rejoice with me, for I have found my sheep which was lost!',
  'Jonah 1:17': 'Now the LORD had prepared a great fish to swallow Jonah. And Jonah was in the belly of the fish three days and three nights.',
  'John 3:16': 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.',
  'Philippians 4:13': 'I can do all things through Christ who strengthens me.',
  'Jeremiah 29:11': 'For I know the thoughts that I think toward you, says the LORD, thoughts of peace and not of evil, to give you a future and a hope.',
  'Proverbs 3:5–6': 'Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.',
  'Psalm 23:1': 'The LORD is my shepherd; I shall not want.',
  'Isaiah 41:10': 'Fear not, for I am with you; be not dismayed, for I am your God. I will strengthen you, yes, I will help you.',
};

export const INITIAL_NOTIFS: NotificationItem[] = [
  { t: 'note', by: 'davidc', pid: 'p9', txt: 'David Chen shared a new note at Grace Community Church', time: '2h' },
  { t: 'amen', by: 'hannah', txt: 'Hannah Amen-ed your reflection on “The Secret Place”', time: '5h' },
  { t: 'devo', by: 'olumide', txt: 'Olumide posted this morning’s devotion', time: '7h' },
  { t: 'follow', by: 'sarah', txt: 'Sarah Jenkins started following you', time: '1d' },
];

export const TREND = ['Faith', 'Worship', 'Healing', 'Holy Spirit', 'Prayer', 'Purpose', 'Courage', 'Grace'];
export const LOCS = ['All', 'Lagos', 'London', 'Los Angeles', 'Nairobi', 'Accra', 'Manila', 'Dallas', 'Redding', 'Sydney'];
export const DOCS = ['All', 'Pentecostal', 'Charismatic', 'Reformed', 'Baptist', 'Anglican', 'Methodist', 'Non-denominational'];
export const AGES = ['All', 'Kids', 'Teens', 'Adults'];
export const XDOCS = ['All', 'Pentecostal', 'Catholic', 'Anglican', 'Baptist', 'Reformed', 'Methodist', 'Charismatic', 'Non-denominational'];
export const XREGS = ['All', 'Africa', 'Europe', 'North America', 'Oceania'];

export function seriesPair(s?: string): [string, string] {
  let h = 0;
  const str = s || 'Sermon Notes';
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length] as [string, string];
}

export function seriesCol(s?: string): string {
  const p = seriesPair(s);
  return `linear-gradient(135deg, ${p[0]}, ${p[1]})`;
}

export function initials(n: string): string {
  return n.split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

export const KGRAD: Record<string, string> = {
  ark: 'linear-gradient(135deg,#BFE3F2,#8FCBDE)',
  sheep: 'linear-gradient(135deg,#D8EFD3,#A9DDB2)',
  whale: 'linear-gradient(135deg,#CDEBF5,#8FC6DC)',
  lion: 'linear-gradient(135deg,#FDEBD2,#F6CE8F)',
};
