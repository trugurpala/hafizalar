# GitHub Repo Checklist

Use this checklist to keep Hafizalar from becoming stale or incomplete.

## Current Status

| Area | Status | Evidence |
| --- | --- | --- |
| README | Complete | Main page includes install, docs, surfaces, CI badge, and graphic. |
| License | Complete | MIT license exists. |
| CI | Complete | GitHub Actions tests Ubuntu and Windows on Node 22 and 24. |
| Installer | Complete | Node installer and PowerShell wrapper exist. |
| Tests | Complete | Node test suite covers required files, contracts, docs links, and installer behavior. |
| Dogfood | Complete | `npm run dogfood -- --json` validates a temporary project loop. |
| Real project dogfood | Complete | `npm run dogfood:real -- --json` validates temp local/GitHub project installs. |
| Issue templates | Complete | Bug, feature, and docs issue forms exist. |
| PR template | Complete | Pull request checklist exists. |
| Security | Complete | Security policy exists. |
| Support | Complete | Support path exists. |
| Visual docs | Complete | Mermaid diagrams, SVG card, and FigJam link exist. |
| Package release | Not done | No npm publish or release tag yet. |

## Before Every Meaningful Change

- Run `git status --short`.
- Identify changed and new files.
- Run `npm.cmd test`.
- Run installer smoke when installer or templates changed.
- Run `npm.cmd run dogfood:real -- --json` before claiming real project coverage.
- Update docs if commands, files, or behavior changed.
- Keep official-source docs dated when limits or external behavior are mentioned.

## Before A Public Release

- Confirm README install commands still work.
- Confirm `docs/INSTALLATION.md` matches installer output.
- Confirm `docs/REAL-PROJECT-DOGFOOD.md` matches the current local and GitHub target list.
- Confirm GitHub Actions is green.
- Confirm no credentials or private local paths are included.
- Add a release note with changed files and verification proof.
- Create a tag only after CI passes.

## Repo Settings To Review Manually

- Social preview image: `assets/brand/hafizalar-repo-card.svg`
- About description: `Reusable Codex and ChatGPT product-builder operating memory.`
- Website: README or future docs site URL
- Topics: `codex`, `chatgpt`, `ai-agents`, `developer-tools`, `prompt-engineering`, `software-delivery`
- Security advisories: enable if private vulnerability reports are desired
