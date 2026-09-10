# AGENTS.md

Guidance for AI coding agents working in this repository.

## Report changes with a commit message

After finishing any set of changes, end your reply with one short suggested
git commit message summarizing them, in Conventional Commits format:

```
<type>: <short imperative summary>
```

- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `build`,
  `chore`, `ci`. Pick the dominant one; do not stack several.
- Lowercase, imperative mood, no trailing period, no scope prefix: match the
  existing history (`feat: refine public site visual system`).
- One line, roughly under 72 characters. If the changes span unrelated areas,
  either pick the most significant one or list one message per area, but keep
  each line in this format.
- The message goes in the chat reply as plain text; do not run
  `git commit` unless the user explicitly asked for a commit.

Examples:

- `feat: add realtime chat to the order page`
- `fix: keep order reference stable after status change`
- `chore: add husky and lint-staged`
