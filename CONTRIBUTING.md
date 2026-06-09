# Contributing

Hafizalar is a small operating contract and installer. Keep changes practical, verifiable, and easy to copy into real projects.

## Contribution Rules

- Preserve inspect-first behavior.
- Preserve no-fake-done behavior.
- Preserve destructive, paid, credential, production, legal, and security approval gates.
- Keep files portable and ASCII unless there is a clear reason.
- Do not add dependencies unless they remove real complexity.
- Add or update tests when changing contracts, installer behavior, templates, or docs navigation.

## Local Check

```powershell
npm.cmd test
```

Installer smoke:

```powershell
npm.cmd run install:hafizalar -- --target C:\path\to\sandbox --surface both --dry-run
npm.cmd run install:hafizalar -- --target C:\path\to\sandbox --surface both
```

## Pull Requests

Include:

- what changed,
- why it changed,
- changed files,
- verification commands,
- remaining risk.

Do not claim a change is done unless at least one local or CI proof exists.
