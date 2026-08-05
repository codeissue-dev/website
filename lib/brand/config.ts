export const brandConfig = {
  name: 'codeissue',
  legalName: 'codeissue',
  url: 'https://codeissue.dev',
  email: 'codeissue@outlook.com',
  description:
    'codeissue designs and builds digital products with focused systems, careful engineering, and human review.',
  localeCookie: 'codeissue-locale',
  workspace: {
    name: 'codeissue',
    slug: 'codeissue',
  },
  routes: {
    home: '/',
    account: '/account',
    dashboard: '/dashboard',
    login: '/login',
    register: '/register',
    newIssue: '/issues/new',
    admin: '/admin',
  },
} as const;
