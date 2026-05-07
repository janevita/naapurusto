export const NEIGHBOURHOODS = [
  'All Helsinki','Kallio','Töölö','Kamppi','Vallila','Sörnäinen','Kruununhaka','Punavuori','Katajanokka',
]

export const POST_TYPES = {
  news:   { label: 'News',   color: 'bg-primary text-white', dot: 'bg-primary' },
  report: { label: 'Report', color: 'bg-red-600 text-white', dot: 'bg-red-500' },
  idea:   { label: 'Idea',   color: 'bg-accent text-dark',   dot: 'bg-accent'  },
  event:  { label: 'Event',  color: 'bg-mid text-white',     dot: 'bg-mid'     },
}

export const MOCK_USERS = [
  { id:'u1', name:'Jane Vita',  initials:'JV', neighbourhood:'Kallio',      bio:'Founder of Naapurusto. Making cities more connected.',     posts:12, votes:134, badge:'Founder',       verified:true  },
  { id:'u2', name:'Matti K.',   initials:'MK', neighbourhood:'Kallio',      bio:'Lifelong Kallio resident. Cyclist, urban planner nerd.',   posts:34, votes:312, badge:'Local Hero',    verified:true  },
  { id:'u3', name:'Aino V.',    initials:'AV', neighbourhood:'Kamppi',      bio:'Urban journalist. Covering Helsinki neighbourhood life.',  posts:28, votes:220, badge:'Verified Local', verified:true  },
  { id:'u4', name:'Sanna P.',   initials:'SP', neighbourhood:'Töölö',       bio:'Community organiser & park advocate.',                    posts:22, votes:189, badge:'Idea Maker',    verified:false },
  { id:'u5', name:'Leena M.',   initials:'LM', neighbourhood:'Katajanokka', bio:'History teacher. Passionate about Helsinki heritage.',     posts:19, votes:144, badge:'News Watcher',  verified:true  },
  { id:'u6', name:'Petri H.',   initials:'PH', neighbourhood:'Vallila',     bio:'Resident since 2008. Running the local street committee.', posts:15, votes:98,  badge:'Campaigner',   verified:false },
]

export const MOCK_NOTIFICATIONS = [
  { id:'n1', type:'vote',    text:'Matti K. supported your post "New cycle lane on Fleminginkatu"',              timeAgo:'5 min ago',  read:false },
  { id:'n2', type:'status',  text:'Your report "Broken streetlight — Vaasankatu" was updated: City notified',    timeAgo:'1 hr ago',   read:false },
  { id:'n3', type:'comment', text:'Hanna K. commented on your idea "Free outdoor gym equipment"',                timeAgo:'2 hrs ago',  read:false },
  { id:'n4', type:'post',    text:'New post in Kallio: "Street cleaning day — Sat 17 May"',                      timeAgo:'3 hrs ago',  read:true  },
  { id:'n5', type:'vote',    text:'Your idea "Outdoor gym at Töölönlahti" crossed 90 votes!',                    timeAgo:'5 hrs ago',  read:true  },
  { id:'n6', type:'post',    text:'New report in Sörnäinen: "Graffiti on building facade"',                      timeAgo:'8 hrs ago',  read:true  },
  { id:'n7', type:'comment', text:'Timo V. replied to your comment in "Pothole at Liisankatu"',                  timeAgo:'1 day ago',  read:true  },
]

export const MOCK_POSTS = [
  {
    id:1, type:'news', authorId:'u2',
    author:{ name:'Matti K.', initials:'MK', verified:true },
    neighbourhood:'Kallio', timeAgo:'12 min ago',
    title:'New cycle lane opens on Fleminginkatu this weekend',
    body:'The long-awaited protected cycle lane between Hämeentie and Sörnäisten rantatie opens Saturday morning. Parking will be removed from the east side. City engineers say the paint markings are weather-permitting.',
    imageUrl:'https://picsum.photos/seed/cycling-hki/600/340',
    votes:47, commentCount:14, tags:['cycling','transport'], anonymous:false, voted:null,
    lat:60.1848, lng:24.9512,
  },
  {
    id:2, type:'report', authorId:null,
    author:{ name:'Anonymous', initials:'?', verified:false },
    neighbourhood:'Kallio', timeAgo:'34 min ago',
    title:'Broken streetlight — Vaasankatu corner',
    body:'The lamp at the corner of Vaasankatu and Porthaninkatu has been out for 3 nights. The intersection is dark and feels unsafe, especially after rain.',
    imageUrl:null,
    votes:23, commentCount:5, tags:['lighting','safety'], anonymous:true, status:'City notified', voted:null,
    lat:60.1831, lng:24.9487,
  },
  {
    id:3, type:'idea', authorId:'u4',
    author:{ name:'Sanna P.', initials:'SP', verified:false },
    neighbourhood:'Töölö', timeAgo:'1 hr ago',
    title:'Free outdoor gym equipment at Töölönlahti park?',
    body:'Other Helsinki parks have outdoor gym stations. Töölönlahti draws thousands of joggers daily — would love to see some pull-up bars and benches added near the south entrance. Budget estimate ~€8,000.',
    imageUrl:'https://picsum.photos/seed/outdoor-gym-hki/600/340',
    votes:91, commentCount:32, tags:['parks','fitness','infrastructure'], anonymous:false, voted:'up',
    lat:60.1742, lng:24.9218,
  },
  {
    id:4, type:'event', authorId:'u2',
    author:{ name:'Kallio Residents Assoc.', initials:'KR', verified:true },
    neighbourhood:'Kallio', timeAgo:'2 hrs ago',
    title:'Street cleaning day — Sat 17 May, 10:00',
    body:"Join us for the spring clean-up of Torkkelinmäki park. Gloves, bags and coffee provided. All ages welcome. We'll finish with a shared lunch at the community centre.",
    imageUrl:'https://picsum.photos/seed/cleanup-kallio/600/340',
    votes:38, commentCount:9, tags:['community','environment'], anonymous:false, voted:null,
    lat:60.1862, lng:24.9531,
  },
  {
    id:5, type:'report', authorId:null,
    author:{ name:'Anonymous', initials:'?', verified:false },
    neighbourhood:'Sörnäinen', timeAgo:'3 hrs ago',
    title:'Graffiti on building facade — Hämeentie 42',
    body:'Large tags appeared overnight on the apartment building facade. Not the first time this wall has been hit. Reported to the property manager but no response yet.',
    imageUrl:'https://picsum.photos/seed/graffiti-sorn/600/340',
    votes:12, commentCount:3, tags:['graffiti','maintenance'], anonymous:true, status:'Under review', voted:null,
    lat:60.1814, lng:24.9623,
  },
  {
    id:6, type:'news', authorId:'u3',
    author:{ name:'Aino V.', initials:'AV', verified:true },
    neighbourhood:'Kamppi', timeAgo:'4 hrs ago',
    title:'New co-working space opening in old post office building',
    body:'The renovated post office on Simonkatu gets a second life as a 1,200 m² shared workspace. Monthly desks from €180. Opening event on 22 May — free day passes for neighbourhood residents.',
    imageUrl:'https://picsum.photos/seed/cowork-kamppi/600/340',
    votes:64, commentCount:21, tags:['business','workspace'], anonymous:false, voted:null,
    lat:60.1682, lng:24.9325,
  },
  {
    id:7, type:'idea', authorId:'u6',
    author:{ name:'Petri H.', initials:'PH', verified:false },
    neighbourhood:'Vallila', timeAgo:'5 hrs ago',
    title:'Resident petition: no trucks on Sturenkatu before 7am',
    body:'Early morning deliveries to the construction site are waking up the whole street from 5:30am. 40 residents have already signed. We need 100 signatures to bring this to the district council.',
    imageUrl:null,
    votes:55, commentCount:18, tags:['noise','petition','construction'], anonymous:false, voted:null,
    lat:60.1912, lng:24.9571,
  },
  {
    id:8, type:'event', authorId:null,
    author:{ name:'Punavuori Pub Quiz', initials:'PQ', verified:false },
    neighbourhood:'Punavuori', timeAgo:'6 hrs ago',
    title:'Monthly neighbourhood pub quiz — Wed 14 May',
    body:'The 6th edition of the Punavuori pub quiz at Bar Loose. Free entry, teams of 2–6. Winner gets a bar tab. Questions cover local history, city trivia, and general knowledge.',
    imageUrl:'https://picsum.photos/seed/pubquiz-puna/600/340',
    votes:29, commentCount:7, tags:['social','quiz'], anonymous:false, voted:null,
    lat:60.1614, lng:24.9392,
  },
  {
    id:9, type:'report', authorId:null,
    author:{ name:'Anonymous', initials:'?', verified:false },
    neighbourhood:'Kruununhaka', timeAgo:'8 hrs ago',
    title:'Pothole at Liisankatu / Unioninkatu — causing bike falls',
    body:"Large pothole at the intersection has caused at least two bike falls this week. Very visible during rush hour. The tram rails nearby make it dangerous to swerve.",
    imageUrl:null,
    votes:34, commentCount:11, tags:['roads','cycling','safety'], anonymous:true, status:'City notified', voted:null,
    lat:60.1714, lng:24.9534,
  },
  {
    id:10, type:'news', authorId:'u5',
    author:{ name:'Leena M.', initials:'LM', verified:true },
    neighbourhood:'Katajanokka', timeAgo:'10 hrs ago',
    title:'Uspenskin Cathedral evening tours start 1 June',
    body:'The cathedral is opening for free guided evening tours every Friday in June and July. Tours run at 18:00 and 19:30, max 20 people per group. Sign-up opens on the city culture website Monday.',
    imageUrl:'https://picsum.photos/seed/cathedral-hki/600/340',
    votes:41, commentCount:6, tags:['culture','events','history'], anonymous:false, voted:null,
    lat:60.1652, lng:24.9601,
  },
]

export const MOCK_IDEAS = [
  { id:101, title:'Add a dog water station at Hakaniemi market square',           author:'Tuula R.',  neighbourhood:'Kallio',      votes:142, comments:28, budget:'€400',   status:'voting',   daysLeft:8,  userVoted:false },
  { id:102, title:'Monthly neighbourhood skill-swap event',                       author:'Jussi L.',  neighbourhood:'Töölö',       votes:98,  comments:15, budget:'€0',     status:'voting',   daysLeft:14, userVoted:true  },
  { id:103, title:'Community seed library in Vallila library',                    author:'Mirja T.',  neighbourhood:'Vallila',     votes:87,  comments:19, budget:'€1,200', status:'voting',   daysLeft:5,  userVoted:false },
  { id:104, title:'Public outdoor chess tables in Esplanadi park',                author:'Risto H.',  neighbourhood:'Kamppi',      votes:203, comments:44, budget:'€2,500', status:'approved', daysLeft:0,  userVoted:false },
  { id:105, title:'Street art wall — commissioned murals on Sörnäinen underpass', author:'Anonymous', neighbourhood:'Sörnäinen',   votes:176, comments:37, budget:'€5,000', status:'approved', daysLeft:0,  userVoted:true  },
  { id:106, title:'Night-time lighting at Eläintarhanlahti bay path',             author:'Kaisa V.',  neighbourhood:'Kallio',      votes:54,  comments:11, budget:'€3,200', status:'voting',   daysLeft:21, userVoted:false },
]

export const COMMUNITY_STATS = {
  members:1247, activeThisWeek:312, postsThisMonth:94, issuesResolved:23,
  topContributors:[
    { name:'Matti K.',  initials:'MK', posts:34, badge:'Local Hero'    },
    { name:'Aino V.',   initials:'AV', posts:28, badge:'Verified Local' },
    { name:'Sanna P.',  initials:'SP', posts:22, badge:'Idea Maker'    },
    { name:'Leena M.',  initials:'LM', posts:19, badge:'News Watcher'  },
    { name:'Petri H.',  initials:'PH', posts:15, badge:'Campaigner'    },
  ],
  recentlyResolved:[
    { title:'Broken swing at Linnanmäki entrance path',         resolvedIn:'4 days' },
    { title:'Overflowing bins at Hakaniemi tram stop',          resolvedIn:'2 days' },
    { title:'Missing pedestrian sign at Sturenkatu junction',   resolvedIn:'6 days' },
  ],
}
