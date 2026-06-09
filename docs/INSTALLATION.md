# Installation

This guide installs Hafizalar into a project without treating Hafizalar as that project's product name.

## Requirements

- Git
- Node.js 22 or newer
- PowerShell on Windows, optional on other systems

No package install is required because Hafizalar currently has no runtime dependencies.

## Get Hafizalar

## Fast Install Without Cloning

Use this path when you want to install Hafizalar directly from GitHub into a target project:

```powershell
npm.cmd exec --yes --package github:trugurpala/hafizalar hafizalar-install -- --target C:\path\to\project --surface both --dry-run
npm.cmd exec --yes --package github:trugurpala/hafizalar hafizalar-install -- --target C:\path\to\project --surface both
```

ChatGPT-only:

```powershell
npm.cmd exec --yes --package github:trugurpala/hafizalar hafizalar-install -- --target C:\path\to\project --surface chatgpt
```

This command downloads the GitHub repo into npm's cache and runs the `hafizalar-install` bin from `package.json`.

Use dry-run first. The installer still preserves existing files unless `--force` is used.

## Clone And Verify

Fresh clone:

```powershell
git clone https://github.com/trugurpala/hafizalar.git
cd hafizalar
npm.cmd test
```

Existing clone:

```powershell
cd C:\path\to\hafizalar
git pull --ff-only
npm.cmd test
```

## Pick The Surface

| Surface | Command value | Installs |
| --- | --- | --- |
| Codex only | `--surface codex` | Codex contract and shared project files. |
| ChatGPT only | `--surface chatgpt` | ChatGPT contract and shared project files. |
| Both | `--surface both` | Codex, ChatGPT, and shared project files. |

Use `both` for most projects.

## Dry-Run First

```powershell
npm.cmd run install:hafizalar -- --target C:\path\to\project --surface both --dry-run
```

The JSON output uses:

- `planned` for every candidate file,
- `wouldWrite` for files that would be written,
- `skipped` for existing files that would be preserved,
- `written` empty during dry-run.

## Install

```powershell
npm.cmd run install:hafizalar -- --target C:\path\to\project --surface both
```

PowerShell wrapper:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\install-hafizalar.ps1 -Target C:\path\to\project -Surface both
```

## Installed Files

```text
.hafizalar/README.md
.hafizalar/HAFIZALAR-CODEX-SHORT.md
.hafizalar/HAFIZALAR-CODEX.md
.hafizalar/HAFIZALAR-CHATGPT.md
.hafizalar/OPENAI-SURFACE-LIMITS.md
.hafizalar/INSTALL-REPORT.json
HAFIZALAR.md
TASKS.md
REVIEW.md
docs/GOLDEN-PATH.md
docs/PROJECT-SETUP.md
```

Surface-specific installs omit the other surface contract.

## Verify The Install

```powershell
Test-Path C:\path\to\project\.hafizalar\INSTALL-REPORT.json
Get-Content C:\path\to\project\.hafizalar\INSTALL-REPORT.json
```

For Codex usage, paste:

```text
.hafizalar/HAFIZALAR-CODEX.md
```

For ChatGPT usage, paste:

```text
.hafizalar/HAFIZALAR-CHATGPT.md
```

## Updating A Project

Run dry-run again first:

```powershell
npm.cmd run install:hafizalar -- --target C:\path\to\project --surface both --dry-run
```

If the project already has adapted files, do not overwrite them blindly.

Only use force when you intentionally want Hafizalar source files to replace target files:

```powershell
npm.cmd run install:hafizalar -- --target C:\path\to\project --surface both --force
```

## Troubleshooting

`node is not recognized`

Install Node.js 22 or newer, then reopen the terminal.

`npm.ps1 cannot be loaded`

Use `npm.cmd` on Windows.

Existing files are skipped

This is expected. Use `--force` only when you have reviewed the target files.

Wrong surface installed

Run the installer again with the intended `--surface` value. Existing shared files will be skipped unless `--force` is used.
