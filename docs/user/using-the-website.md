# Using the website

## Public and account routes

- `/` - public product website
- `/register` - create an account
- `/login` - sign in
- `/dashboard` - personal overview
- `/dashboard/projects` - projects created by the signed-in user
- `/dashboard/messages` - project discussions
- `/issues/new` - create a project request

Each request creates a project and a linked conversation. Messages written in the personal workspace appear in the administrative inbox, and administrator replies remain attached to the same project.

## Administrative routes

Accounts with the `admin` role can also open:

- `/admin` - operations overview
- `/admin/inbox` - shared conversations
- `/admin/orders` - project and order records
- `/admin/integrations` - connected channels
- `/admin/events` - persisted and live integration events

The language select stores the active locale in the `codeissue-locale` cookie. URLs do not contain locale segments.
