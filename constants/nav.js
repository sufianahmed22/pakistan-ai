export const PUBLIC_NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Articles', to: '/articles' },
  { label: 'Regions', to: '/regions' },
  { label: 'Cities', to: '/cities' },
  { label: 'History', to: '/history' },
  { label: 'Culture', to: '/culture' },
  { label: 'Tourism', to: '/tourism' },
  { label: 'Statistics', to: '/statistics' },
];

export const FOOTER_LINKS = {
  Explore: [
    { label: 'Regions', to: '/regions' },
    { label: 'Cities', to: '/cities' },
    { label: 'Places to Visit', to: '/places' },
    { label: 'Geography', to: '/geography' },
    { label: 'Mountains', to: '/mountains' },
    { label: 'Rivers', to: '/rivers' },
  ],
  Learn: [
    { label: 'Articles', to: '/articles' },
    { label: 'History', to: '/history' },
    { label: 'Culture', to: '/culture' },
    { label: 'Tourism', to: '/tourism' },
    { label: 'Statistics', to: '/statistics' },
    { label: 'Facts', to: '/facts' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Use', to: '/terms' },
    { label: 'Ask Pakistan AI', to: '/ask' },
  ],
};

export const ADMIN_NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', icon: 'LayoutDashboard' }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Cities', to: '/admin/cities', icon: 'Building2' },
      { label: 'Regions', to: '/admin/regions', icon: 'Map' },
      { label: 'Destinations', to: '/admin/destinations', icon: 'MapPin' },
      { label: 'Mountains', to: '/admin/mountains', icon: 'Mountain' },
      { label: 'Rivers', to: '/admin/rivers', icon: 'Waves' },
      { label: 'Historical Events', to: '/admin/history', icon: 'ScrollText' },
      { label: 'Articles', to: '/admin/articles', icon: 'Newspaper' },
      { label: 'Facts', to: '/admin/facts', icon: 'Sparkles' },
      { label: 'FAQs', to: '/admin/faqs', icon: 'CircleHelp' },
    ],
  },
  {
    label: 'AI',
    items: [
      { label: 'Conversations', to: '/admin/conversations', icon: 'MessagesSquare' },
      { label: 'Knowledge Base', to: '/admin/knowledge', icon: 'BrainCircuit' },
      { label: 'Refresh Queue', to: '/admin/knowledge-refresh', icon: 'RefreshCcw' },
      { label: 'AI Analytics', to: '/admin/analytics', icon: 'ChartSpline' },
      { label: 'Site Traffic', to: '/admin/traffic', icon: 'Eye' },
    ],
  },
  {
    label: 'Users',
    items: [
      { label: 'Users', to: '/admin/users', icon: 'Users' },
      { label: 'Telegram Users', to: '/admin/telegram', icon: 'Send' },
    ],
  },
  {
    label: 'Support',
    items: [
      { label: 'Tickets', to: '/admin/tickets', icon: 'Ticket' },
      { label: 'Contact Messages', to: '/admin/tickets?type=contact', icon: 'Mail' },
      { label: 'Review Reports', to: '/admin/review-reports', icon: 'Flag' },
    ],
  },
  {
    label: 'Statistics',
    items: [
      { label: 'Population', to: '/admin/statistics?tab=population', icon: 'Users2' },
      { label: 'Geography', to: '/admin/statistics?tab=geography', icon: 'Mountain' },
      { label: 'Economy', to: '/admin/statistics?tab=economy', icon: 'TrendingUp' },
      { label: 'Demographics', to: '/admin/statistics?tab=demographics', icon: 'PieChart' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', to: '/admin/settings', icon: 'Cog' },
      { label: 'Sitemap & SEO', to: '/admin/settings?tab=seo', icon: 'Globe' },
      { label: 'Logs', to: '/admin/settings?tab=logs', icon: 'FileClock' },
    ],
  },
];
