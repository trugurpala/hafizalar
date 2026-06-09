# Security Policy

## Supported Scope

This repository contains prompts, docs, templates, and installer scripts.

Security-sensitive areas:

- installer file-copy behavior,
- accidental credential exposure in docs or examples,
- unsafe destructive workflow guidance,
- CI and GitHub configuration.

## Reporting A Concern

Do not post private credentials or exploit details in a public issue.

Open a minimal GitHub issue that describes the affected area without sensitive data, or use GitHub private security reporting if it is enabled for this repository.

## Baseline Rules

- Do not commit `.env` files.
- Do not paste credentials into examples.
- Do not add `curl | sh` or `wget | sh` install paths.
- Do not add destructive commands as default behavior.
- Keep installer overwrites opt-in via `--force`.
