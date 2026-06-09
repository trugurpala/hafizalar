# Diagrams

This page is the repo-native visual source for Hafizalar.

FigJam diagram:

https://www.figma.com/board/7dd9CaDt2kOUSjf06j36JJ?utm_source=codex&utm_content=edit_in_figjam&oai_id=&request_id=63af9a57-a475-465b-9f89-6ef40fe4150d

## Product Builder Flow

```mermaid
flowchart LR
  A["Short user request"] -->|"Shape outcome"| B["ChatGPT planning surface"]
  B -->|"Compact handoff"| C["Codex local surface"]
  C -->|"Inspect repo"| D["Repo audit"]
  D -->|"Install Hafizalar"| E[".hafizalar project files"]
  E -->|"Implement task"| F["Focused source changes"]
  F -->|"Run checks"| G["Local verification"]
  G -->|"Push"| H["GitHub Actions"]
  H -->|"Evidence"| I["Report package"]
  I -->|"Improve next project"| B
  G -->|"Failure"| J["Fix loop"]
  J -->|"Retest"| G
```

## Installer File Map

```mermaid
flowchart LR
  A["Hafizalar repo"] --> B["scripts/install-hafizalar.mjs"]
  B --> C["Target project"]
  C --> D[".hafizalar contracts"]
  C --> E["HAFIZALAR.md"]
  C --> F["TASKS.md"]
  C --> G["REVIEW.md"]
  C --> H["docs/GOLDEN-PATH.md"]
  C --> I["docs/PROJECT-SETUP.md"]
  B --> J[".hafizalar/INSTALL-REPORT.json"]
```

## Evidence Loop

```mermaid
sequenceDiagram
  participant User
  participant ChatGPT
  participant Codex
  participant CI
  participant Repo

  User->>ChatGPT: Messy product request
  ChatGPT->>Codex: Compact handoff
  Codex->>Repo: Inspect and edit
  Codex->>Codex: Run local checks
  Codex->>CI: Push changes
  CI->>Repo: Record result
  Codex->>User: Report files, proof, risk
```

## Social Card

Repo card asset:

```text
assets/brand/hafizalar-repo-card.svg
```

Use it as GitHub social preview or in docs when a visual summary is needed.
