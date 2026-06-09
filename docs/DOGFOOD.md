# Dogfood

Dogfood proves Hafizalar can install into a new project and guide a small implementation loop.

It tests this scenario:

```text
empty project -> Hafizalar install -> product request -> implementation -> test -> report
```

## Run

```powershell
npm.cmd run dogfood
```

JSON output:

```powershell
npm.cmd run dogfood -- --json
```

Keep the temporary project for manual inspection:

```powershell
npm.cmd run dogfood -- --keep
```

## What It Verifies

- installer dry-run works,
- installer real run works,
- Codex and ChatGPT contracts are installed,
- agentic pattern map is installed,
- install report is created,
- a tiny product module is implemented in the temporary project,
- target project test passes through `node --test`,
- `REVIEW.md` records the proof.

## What It Does Not Claim

This is a synthetic scenario. It proves the operating loop and installer behavior. It does not prove Hafizalar has been validated on every stack or real product type.

## CI

The GitHub Actions workflow runs:

```text
npm test
npm run dogfood -- --json
```

Dogfood is part of the repo's required proof path.
