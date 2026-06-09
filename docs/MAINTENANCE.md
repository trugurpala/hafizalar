# Maintenance

Hafizalar should stay small, current, and proven.

## Weekly

- Check GitHub Actions.
- Review Dependabot suggestions.
- Run `npm.cmd test` on the main branch.
- Run `npm.cmd run dogfood -- --json` before meaningful release notes.
- Confirm issue templates still match the repo workflow.

## Monthly

- Re-check official OpenAI help pages linked from `docs/OPENAI-SURFACE-LIMITS.md`.
- Refresh the dated source snapshot if limits or wording changed.
- Run a real installer smoke into a temporary project.
- Review README for stale status notes.

## Release Checklist

1. `git status --short`
2. `npm.cmd test`
3. `npm.cmd run dogfood -- --json`
4. Installer dry-run into a temporary project
5. Real installer smoke into a temporary project
6. GitHub Actions green on main
7. Changelog or release notes prepared
8. No credentials or local-only private data included
9. Tag created only after CI passes

## Versioning

Current package version: `0.2.0`

No npm publish has been performed.

Recommended future path:

- `0.1.x` for docs and installer hardening,
- `0.2.x` for dogfood proof hardening and cross-platform install polish,
- `1.0.0` only after several real project installs prove the contract.

## Updating Installer Behavior

When installer behavior changes:

- update `docs/INSTALLATION.md`,
- update `README.md` if user-facing commands changed,
- update `test/hafizalar.test.mjs`,
- run a dry-run and real install into a temporary project,
- include `INSTALL-REPORT.json` behavior in the review.
