import { brandConfig } from '@/lib/brand/config';

export const siteConfig = brandConfig;

export const adminNavigation = [
  { href: '/admin', key: 'overview', icon: 'overview' },
  { href: '/admin/inbox', key: 'inbox', icon: 'inbox' },
  { href: '/admin/orders', key: 'orders', icon: 'orders' },
  { href: '/admin/integrations', key: 'integrations', icon: 'integrations' },
  { href: '/admin/events', key: 'events', icon: 'events' },
] as const;

export const dashboardNavigation = [
  { href: '/dashboard', key: 'overview' },
  { href: '/dashboard/projects', key: 'projects' },
  { href: '/dashboard/messages', key: 'messages' },
] as const;
