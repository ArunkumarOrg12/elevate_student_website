// ──────────────────────────────────────────────────────────────
// EmployIQ Mock Data (matches Figma exactly)
// ──────────────────────────────────────────────────────────────

export const student = {
  name: 'Arjun Sharma',
  firstName: 'Arjun',
  initials: 'AS',
  id: 'STU-2021-4892',
  year: 'Final Year (4th Year)',
  college: 'National Institute of Technology, Trichy',
  batch: '2021–2025',
  branch: 'Computer Science Engineering',
  email: 'arjun.sharma@nitrichy.ac.in',
  phone: '+91 98765 43210',
  cgpa: '8.4',
  updatedAt: 'Feb 26, 2026',
  status: 'Employment Ready',
  mentor: 'Dr. Priya Menon',
};

export const dashboardStats = [
  { id: 1, label: 'Employability Index', value: '78', unit: '/100', change: '+5pts', up: true, icon: 'TrendingUp' },
  { id: 2, label: 'Percentile Rank',     value: '82', unit: 'th',   change: '+3pts', up: true, icon: 'Award' },
  { id: 3, label: 'Growth Velocity',     value: '+4.2', unit: 'pts/sem', change: '+1.1pts', up: true, icon: 'Rocket' },
  { id: 4, label: 'Assessments Taken',   value: '24',  unit: '',    change: '+4',    up: true, icon: 'ClipboardList' },
  { id: 5, label: 'Risk Indicator',      value: 'Low', unit: '',    change: '↓ Low', up: false, icon: 'ShieldCheck' },
];

export const progressTimeline = [
  { semester: 'Yr1 S1', Overall: 42, Aptitude: 40, Technical: 38, Behavioral: 48, Communication: 36 },
  { semester: 'Yr1 S2', Overall: 48, Aptitude: 46, Technical: 44, Behavioral: 52, Communication: 42 },
  { semester: 'Yr2 S1', Overall: 55, Aptitude: 54, Technical: 50, Behavioral: 60, Communication: 49 },
  { semester: 'Yr2 S2', Overall: 60, Aptitude: 62, Technical: 56, Behavioral: 65, Communication: 54 },
  { semester: 'Yr3 S1', Overall: 66, Aptitude: 68, Technical: 63, Behavioral: 71, Communication: 58 },
  { semester: 'Yr3 S2', Overall: 70, Aptitude: 72, Technical: 68, Behavioral: 76, Communication: 63 },
  { semester: 'Yr4 S1', Overall: 74, Aptitude: 75, Technical: 71, Behavioral: 80, Communication: 65 },
  { semester: 'Yr4 S2', Overall: 78, Aptitude: 78, Technical: 74, Behavioral: 85, Communication: 68 },
];

export const topSkills = [
  { name: 'Teamwork & Collaboration',    category: 'Behavioral',    score: 88, change: +3 },
  { name: 'Leadership & Conflict Mgmt',  category: 'Behavioral',    score: 85, change: +3 },
  { name: 'DSA & System Design',         category: 'Technical',     score: 80, change: +8 },
  { name: 'Quantitative Reasoning',      category: 'Aptitude',      score: 78, change: +4 },
  { name: 'Verbal Ability',              category: 'Aptitude',      score: 72, change: +7 },
  { name: 'Group Discussion',            category: 'Communication',  score: 65, change: -3 },
];

export const improvementActions = [
  {
    id: 1,
    priority: 'High',
    category: 'Technical',
    title: 'Deepen Database & SQL Knowledge',
    description: 'Focus on query optimization, indexing strategies, and advanced joins. Practice on LeetCode SQL track and HackerRank.',
    points: '+8 to +12',
    days: 60,
    effort: 'High',
  },
  {
    id: 2,
    priority: 'High',
    category: 'Communication',
    title: 'Complete Mock Group Discussion Sessions',
    description: 'Join structured GD simulations. Practice structured argumentation, listening, and time-managed speaking.',
    points: '+5 to +8',
    days: 30,
    effort: 'Medium',
  },
  {
    id: 3,
    priority: 'Medium',
    category: 'Technical',
    title: 'Master System Design Concepts',
    description: 'Study scalable architectures, load balancing, caching, and distributed systems from Grokking the System Design Interview.',
    points: '+6 to +10',
    days: 60,
    effort: 'High',
  },
  {
    id: 4,
    priority: 'Medium',
    category: 'Aptitude',
    title: 'Strengthen Numerical Ability',
    description: 'Practice data interpretation, speed math, and logical reasoning under timed conditions to improve aptitude score.',
    points: '+5 to +8',
    days: 90,
    effort: 'Low',
  },
];

export const milestone = {
  title: 'Employment Ready Badge',
  description: 'Score 80+ Employability Index',
  current: 78,
  target: 80,
  locked: true,
};

// ──────────────────────────────────────────────────────────────
// Assessment History
// ──────────────────────────────────────────────────────────────
export const assessments = [
  { id: 1,  title: 'DSA & System Design',        category: 'Technical',     attempt: 3, date: 'Feb 10, 2026', duration: '60 min', questions: 40, prevScore: 72, score: 80, percentile: 78, change: +8 },
  { id: 2,  title: 'Quantitative + Reasoning',   category: 'Aptitude',      attempt: 4, date: 'Jan 28, 2026', duration: '45 min', questions: 30, prevScore: 74, score: 78, percentile: 82, change: +4 },
  { id: 3,  title: 'Group Discussion Simulation', category: 'Communication', attempt: 2, date: 'Jan 15, 2026', duration: '30 min', questions: 20, prevScore: 68, score: 65, percentile: 55, change: -3 },
  { id: 4,  title: 'Leadership & Conflict Mgmt', category: 'Behavioral',    attempt: 2, date: 'Dec 20, 2025', duration: '40 min', questions: 25, prevScore: 82, score: 85, percentile: 88, change: +3 },
  { id: 5,  title: 'Web Technologies',           category: 'Technical',     attempt: 2, date: 'Dec 05, 2025', duration: '50 min', questions: 35, prevScore: 68, score: 74, percentile: 72, change: +6 },
  { id: 6,  title: 'Verbal Ability',             category: 'Aptitude',      attempt: 3, date: 'Nov 22, 2025', duration: '35 min', questions: 25, prevScore: 65, score: 72, percentile: 75, change: +7 },
  { id: 7,  title: 'Database & SQL',             category: 'Technical',     attempt: 2, date: 'Nov 10, 2025', duration: '45 min', questions: 30, prevScore: 60, score: 68, percentile: 65, change: +8 },
  { id: 8,  title: 'Teamwork & Collaboration',   category: 'Behavioral',    attempt: 1, date: 'Oct 28, 2025', duration: '35 min', questions: 25, prevScore: 85, score: 88, percentile: 92, change: +3 },
  { id: 9,  title: 'Data Interpretation',        category: 'Aptitude',      attempt: 2, date: 'Oct 10, 2025', duration: '40 min', questions: 28, prevScore: 70, score: 74, percentile: 76, change: +4 },
];

export const assessmentStats = {
  average: 75,
  best: 88,
  avgPercentile: 75,
  improvementRate: '+9.2',
};

// ──────────────────────────────────────────────────────────────
// Skill Insights
// ──────────────────────────────────────────────────────────────
export const radarData = [
  { axis: 'Leadership',       you: 80, batch: 65 },
  { axis: 'Teamwork',         you: 90, batch: 72 },
  { axis: 'Communication',    you: 65, batch: 68 },
  { axis: 'Time Mgmt',        you: 70, batch: 63 },
  { axis: 'Problem Solving',  you: 85, batch: 70 },
  { axis: 'Adaptability',     you: 75, batch: 66 },
  { axis: 'Initiative',       you: 78, batch: 60 },
  { axis: 'Critical Thinking',you: 88, batch: 74 },
];

export const skillHeatmap = {
  categories: ['Aptitude', 'Technical', 'Behavioral', 'Communication'],
  semesters: ['Yr1S1', 'Yr2S1', 'Yr2S2', 'Yr3S1', 'Yr3S2', 'Yr4S2'],
  data: [
    [40, 54, 62, 68, 72, 78],
    [38, 50, 56, 63, 68, 74],
    [48, 60, 65, 71, 76, 85],
    [36, 49, 54, 58, 63, 68],
  ],
};

export const individualSkills = [
  { name: 'Leadership',       score: 80 },
  { name: 'Teamwork',         score: 90 },
  { name: 'Adaptability',     score: 75 },
  { name: 'Problem Solving',  score: 85 },
  { name: 'Communication',    score: 65 },
  { name: 'Time Management',  score: 70 },
  { name: 'Initiative',       score: 78 },
  { name: 'Critical Thinking',score: 88 },
];

export const roadmapActions = {
  '30': [
    { id: 1, title: 'Complete 5 mock verbal communication sessions', category: 'Communication', priority: 'High', status: 'in-progress' },
    { id: 2, title: 'Join on-campus GD practice group (Tue/Thu)',    category: 'Communication', priority: 'High', status: 'in-progress' },
    { id: 3, title: 'Practice STAR-method response structuring',     category: 'Communication', priority: 'High', status: 'done' },
    { id: 4, title: 'Retake Communication Assessment (target 72+)',  category: 'Communication', priority: 'Medium', status: 'pending' },
  ],
  '60': [
    { id: 1, title: 'Deep dive into Database & SQL optimization',    category: 'Technical',     priority: 'High', status: 'pending' },
    { id: 2, title: 'Complete 3 System Design mock interviews',      category: 'Technical',     priority: 'High', status: 'pending' },
    { id: 3, title: 'Solve 50 LeetCode medium problems',            category: 'Technical',     priority: 'Medium', status: 'pending' },
    { id: 4, title: 'Practice 10 timed aptitude test sessions',     category: 'Aptitude',      priority: 'Medium', status: 'pending' },
  ],
  '90': [
    { id: 1, title: 'Complete full mock placement drive cycle',      category: 'Behavioral',    priority: 'High', status: 'pending' },
    { id: 2, title: 'Build 2 production-grade portfolio projects',   category: 'Technical',     priority: 'High', status: 'pending' },
    { id: 3, title: 'Retake all category assessments',              category: 'Aptitude',      priority: 'Medium', status: 'pending' },
    { id: 4, title: 'Achieve 80+ overall employability score',      category: 'Behavioral',    priority: 'High', status: 'pending' },
  ],
};

// ──────────────────────────────────────────────────────────────
// Growth Timeline
// ──────────────────────────────────────────────────────────────
export const assessmentFrequency = [
  { semester: 'Yr1S2', count: 1 },
  { semester: 'Yr2S1', count: 2 },
  { semester: 'Yr2S2', count: 3 },
  { semester: 'Yr3S1', count: 3 },
  { semester: 'Yr3S2', count: 4 },
  { semester: 'Yr4S1', count: 5 },
  { semester: 'Yr4S2', count: 6 },
];

export const categoryComparison = [
  { category: 'Aptitude',      you: 78, top10: 92, batch: 65 },
  { category: 'Technical',     you: 74, top10: 94, batch: 62 },
  { category: 'Behavioral',    you: 85, top10: 91, batch: 70 },
  { category: 'Communication', you: 68, top10: 88, batch: 67 },
  { category: 'Overall',       you: 78, top10: 91, batch: 66 },
];

export const periodComparison = [
  {
    label: 'Y4S2',
    date: 'Feb 2026',
    current: true,
    scores: { Overall: 78, Aptitude: 78, Technical: 74, Behavioral: 85, Communication: 68 },
  },
  {
    label: 'Y4S1',
    date: 'Sep 2025',
    current: false,
    scores: { Overall: 74, Aptitude: 75, Technical: 71, Behavioral: 80, Communication: 65 },
  },
  {
    label: 'Y3S2',
    date: 'Feb 2025',
    current: false,
    scores: { Overall: 70, Aptitude: 72, Technical: 68, Behavioral: 76, Communication: 63 },
  },
];

// ──────────────────────────────────────────────────────────────
// Recommendations
// ──────────────────────────────────────────────────────────────
export const recommendations = [
  {
    id: 1,
    priority: 'High',
    category: 'Technical',
    title: 'Deepen Database & SQL Knowledge',
    description: 'Focus on query optimization, indexing strategies, and advanced joins. Practice on LeetCode SQL track and HackerRank SQL challenges to improve both speed and accuracy.',
    points: '+8 to +12',
    days: 60,
    effort: 'High',
    expanded: false,
    steps: [
      'Complete HackerRank SQL Easy & Medium tracks (2 weeks)',
      'Study indexing & query optimization concepts',
      'Solve 30 LeetCode DB problems',
      'Retake Database & SQL Assessment (target 80+)',
    ],
  },
  {
    id: 2,
    priority: 'Medium',
    category: 'Technical',
    title: 'Master System Design Concepts',
    description: 'Study scalable architectures, load balancing, caching strategies, and distributed systems fundamentals from Grokking the System Design Interview.',
    points: '+6 to +10',
    days: 60,
    effort: 'High',
    expanded: false,
    steps: [
      'Read Grokking the System Design Interview (chapters 1–8)',
      'Design 5 systems end-to-end (URL shortener, Twitter feed, etc.)',
      'Join weekly system design mock interview sessions',
      'Create architecture diagram portfolio',
    ],
  },
  {
    id: 3,
    priority: 'Medium',
    category: 'Aptitude',
    title: 'Strengthen Numerical Ability',
    description: 'Practice data interpretation, speed math, and logical reasoning under timed conditions to improve your aptitude component score.',
    points: '+5 to +8',
    days: 90,
    effort: 'Low',
    expanded: false,
    steps: [
      'Practice 10 timed DI sets per week',
      'Complete IndiaBix arithmetic section',
      'Daily 15-minute speed math drills',
      'Retake Aptitude Assessment (target 85+)',
    ],
  },
];

export const quickWins = {
  '30': [
    { id: 1, title: 'Complete 5 mock verbal communication sessions', category: 'Communication', status: 'active' },
    { id: 2, title: 'Join on-campus GD practice group (Tue/Thu)',    category: 'Communication', status: 'active' },
    { id: 3, title: 'Practice STAR-method response structuring',     category: 'Communication', status: 'done'   },
    { id: 4, title: 'Retake Communication Assessment (target 72+)', category: 'Communication', status: 'pending' },
  ],
  '60': [
    { id: 1, title: 'Complete SQL optimization challenge set',       category: 'Technical',     status: 'pending' },
    { id: 2, title: 'Design 3 systems from Grokking guide',         category: 'Technical',     status: 'pending' },
    { id: 3, title: 'Practice 10 aptitude timed sets',              category: 'Aptitude',      status: 'pending' },
    { id: 4, title: 'Take DSA Assessment again (target 85+)',       category: 'Technical',     status: 'pending' },
  ],
  '90': [
    { id: 1, title: 'Full mock placement drive cycle',              category: 'Behavioral',    status: 'pending' },
    { id: 2, title: 'Build 2 portfolio projects',                   category: 'Technical',     status: 'pending' },
    { id: 3, title: 'Retake all assessments',                       category: 'Aptitude',      status: 'pending' },
    { id: 4, title: 'Achieve 80+ overall employability index',      category: 'Behavioral',    status: 'pending' },
  ],
};

export const proTips = {
  '30': 'Your Communication score is the biggest short-term lever. Even a 5-point boost here will lift your overall Employability Index above 80.',
  '60': 'Technical assessments carry the highest weight in placement cell reports. Focus on SQL and System Design for maximum ROI.',
  '90': 'Combine all improvements with a full mock placement cycle to simulate real interview pressure before the actual season.',
};

// ──────────────────────────────────────────────────────────────
// Reports
// ──────────────────────────────────────────────────────────────
export const reportSections = [
  { category: 'Aptitude',      score: 78, label: 'Strong',      change: +4 },
  { category: 'Technical',     score: 72, label: 'Good',        change: +4 },
  { category: 'Behavioral',    score: 85, label: 'Excellent',   change: +3 },
  { category: 'Communication', score: 68, label: 'Needs Work',  change: +2 },
];
