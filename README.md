# Hafizalar

[![Hafizalar Test](https://github.com/trugurpala/hafizalar/actions/workflows/test.yml/badge.svg)](https://github.com/trugurpala/hafizalar/actions/workflows/test.yml)

Hafizalar is a reusable Codex operating memory for building software.

It is not the name of the product you are building.

It is the discipline you paste into Codex so a short, messy request becomes:

```text
inspect repo -> decide one path -> implement -> verify -> report
```

Core rule:

```text
Instruction explains.
Skill executes.
MCP connects.
Hook/CI/Gate blocks.
Evidence proves.
```

## Use

1. Open a project folder.
2. Open Codex in that folder.
3. Paste `HAFIZALAR-CODEX.md` into Codex.
4. Describe the product or task.

Codex should start with a repo audit, choose a path, make the smallest useful change, run verification, and report proof.

## Fast Start

Use the short version when you need a compact prompt:

```text
HAFIZALAR-CODEX-SHORT.md
```

Use the full version for serious project work:

```text
HAFIZALAR-CODEX.md
```

Use the ChatGPT version when you are working in ChatGPT instead of Codex:

```text
HAFIZALAR-CHATGPT.md
```

## Install Into A Project

Dry-run first:

```powershell
npm.cmd run install:hafizalar -- --target C:\path\to\project --surface both --dry-run
```

Install:

```powershell
npm.cmd run install:hafizalar -- --target C:\path\to\project --surface both
```

PowerShell wrapper:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\install-hafizalar.ps1 -Target C:\path\to\project -Surface both
```

Installed files go under:

```text
<project>/.hafizalar/
```

The installer does not overwrite existing files unless you pass `--force`.

## Codex vs ChatGPT Limits

Codex and ChatGPT do not have identical limits.

- Codex usage depends on your ChatGPT plan and the size/complexity of coding tasks.
- ChatGPT model messages, uploads, Projects, GPTs, image/voice tools, and Agent mode can have separate limits.
- Do not assume a ChatGPT file/upload/image/voice banner applies to Codex.
- Do not assume Codex remaining usage means ChatGPT file uploads or Agent mode are available.

See:

```text
docs/OPENAI-SURFACE-LIMITS.md
```

## What Hafizalar Enforces

- inspect before editing,
- choose one practical path,
- ask only for destructive/paid/secret/production/legal/security-critical actions,
- never claim done without proof,
- prefer local deterministic tools,
- keep unrelated git changes separate,
- report changed files, verification, risks, and next action.

## Minimal Project Files

When useful, copy or adapt:

```text
templates/HAFIZALAR.md
templates/TASKS.md
templates/REVIEW.md
templates/GOLDEN-PATH.md
```

Do not create these in a project that already has better equivalents.

## Test

Run:

```powershell
npm.cmd test
```

or:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/test-hafizalar.ps1
```

The tests verify required files, required contract sections, ASCII portability, README links, template presence, and a small sandbox Node test.

## Status

Community starter: ready.

Release/package publish: not performed.
