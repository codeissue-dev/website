export const siteConfig = {
  name: 'Codeissue',
  url: 'https://codeissue.dev',
  description:
    'Codeissue designs and builds digital products using AI-assisted workflows, custom systems, and human review.',
  localeCookie: 'codeissue-locale',
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    newIssue: '/issues/new',
    admin: '/admin',
  },
} as const;

export const adminNavigation = [
  { href: '/admin', key: 'overview', icon: 'overview' },
  { href: '/admin/inbox', key: 'inbox', icon: 'inbox' },
  { href: '/admin/orders', key: 'orders', icon: 'orders' },
  { href: '/admin/integrations', key: 'integrations', icon: 'integrations' },
  { href: '/admin/events', key: 'events', icon: 'events' },
] as const;
