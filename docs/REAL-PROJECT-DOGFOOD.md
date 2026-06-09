# Real Project Dogfood

Real project dogfood proves Hafizalar can install into existing Codex projects and selected GitHub repositories without modifying the active project folders.

The command works in a temporary workspace:

```text
local/GitHub project -> temp clone or copy -> Hafizalar install -> required files check -> optional project test -> temp cleanup
```

## Run

From the Hafizalar repo:

```powershell
npm.cmd run dogfood:real -- --json
```

With an explicit Codex projects folder:

```powershell
npm.cmd run dogfood:real -- --codex-root C:\Users\Pala-Home-1\Desktop\Codex --json
```

Skip GitHub clone checks when offline or when `gh` is not authenticated:

```powershell
npm.cmd run dogfood:real -- --skip-github --json
```

Keep the temporary workspace for inspection:

```powershell
npm.cmd run dogfood:real -- --keep --json
```

## Local Targets

| Target | Mode | Test |
| --- | --- | --- |
| `pala-os-v3` | local git clone | `npm test` |
| `pala-os-v5` | local git clone | `npm test` |
| `pala-os-v6` | local git clone | `npm test` |
| `pala-os-v10` | local copy | install-only |

`pala-os-v4` is intentionally excluded while the local working tree has pre-existing dirty files. Add it back only after that repo is clean or after a separate owner decision.

## GitHub Targets

| Target | Mode | Test |
| --- | --- | --- |
| `trugurpala/pala-os-v3` | `gh repo clone --depth 1` | `npm test` |
| `trugurpala/pala-os-v5` | `gh repo clone --depth 1` | install-only on current default branch |
| `trugurpala/pala-os-v6` | `gh repo clone --depth 1` | `npm test` |
| `trugurpala/pinescriptv6` | `gh repo clone --depth 1` | install-only |

Private repositories require a working GitHub CLI login.

## What It Verifies

- the active Hafizalar installer can run against real project shapes,
- Codex and ChatGPT contracts are installed,
- agentic pattern map and surface-limit docs are installed,
- templates are installed,
- `INSTALL-REPORT.json` is produced,
- selected project test scripts still pass after temp install,
- active local project folders are not written to.

## Safety Boundary

This command does not publish a package, create a release tag, force push, deploy, read secrets, or modify the source project folders.

It may use `--force` inside the temporary clone/copy so the current Hafizalar files are actually installed and verified.

## Release Use

Run this before claiming that Hafizalar works on real projects:

```powershell
npm.cmd test
npm.cmd run dogfood -- --json
npm.cmd run dogfood:real -- --json
```

GitHub Actions does not run `dogfood:real` by default because it depends on local Codex folders and private GitHub access.
