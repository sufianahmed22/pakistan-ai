// Truly static facts that don't change (used for the "Pakistan at a Glance" cards
// on the homepage). Anything that *can* change over time is fetched from the API
// and rendered with an explicit "as of <year>" label instead of living here.
export const PAKISTAN_GLANCE = [
  { label: 'Capital', value: 'Islamabad' },
  { label: 'Currency', value: 'Pakistani Rupee (PKR)' },
  { label: 'Highest Peak', value: 'K2 (8,611 m)' },
  { label: 'Major River', value: 'Indus River' },
  { label: 'Provinces', value: '4 Provinces + Territories' },
  { label: 'Official Language', value: 'Urdu (English co-official)' },
];

export const SUGGESTED_QUESTIONS = [
  'What is Pakistan famous for?',
  'Tell me about Hunza Valley',
  "What are Pakistan's provinces?",
  'Tell me about Lahore',
  'What is the history of Pakistan?',
];

export const REGIONS_SCHEMATIC = [
  { slug: 'punjab', name: 'Punjab', capital: 'Lahore' },
  { slug: 'sindh', name: 'Sindh', capital: 'Karachi' },
  { slug: 'khyber-pakhtunkhwa', name: 'Khyber Pakhtunkhwa', capital: 'Peshawar' },
  { slug: 'balochistan', name: 'Balochistan', capital: 'Quetta' },
  { slug: 'gilgit-baltistan', name: 'Gilgit-Baltistan', capital: 'Gilgit' },
  { slug: 'azad-kashmir', name: 'Azad Jammu & Kashmir', capital: 'Muzaffarabad' },
  { slug: 'islamabad-capital-territory', name: 'Islamabad Capital Territory', capital: 'Islamabad' },
];
