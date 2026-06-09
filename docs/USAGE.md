# Usage

Hafizalar is a working discipline, not a product name.

Use it to keep ChatGPT and Codex focused on the right jobs.

## Daily Flow

1. Use ChatGPT to shape the product outcome when the request is vague.
2. Use Codex to inspect the local repo and make changes.
3. Run local verification.
4. Push and let CI prove the repo still works.
5. Report changed files, evidence, remaining risk, and next action.

## ChatGPT Surface

Use ChatGPT for:

- product framing,
- architecture review,
- writing docs and prompts,
- UI/UX direction,
- compact Codex handoffs,
- reviewing pasted code or command output.

Do not let ChatGPT claim local implementation is done unless it has real proof from command output, CI, screenshots, uploaded files, or connectors.

## Codex Surface

Use Codex for:

- repo inspection,
- file edits,
- tests,
- build/debug,
- browser or Playwright proof,
- Git and GitHub source work.

Codex should inspect before editing and report proof before claiming done.

## Compact Handoff Template

Use this when moving from ChatGPT to Codex:

```text
Goal:
Repo:
Files likely involved:
Constraints:
Commands to run:
Expected proof:
Risks:
```

## Evidence Template

Use this when reporting back:

```text
Done:
Changed files:
Verification:
CI:
Risks left:
Next best action:
```

## Budget Discipline

Codex and ChatGPT have separate practical limits.

Keep both efficient:

- pass only the smallest useful context,
- avoid pasting the whole repo,
- prefer file paths and command output,
- use CI links instead of long logs when CI is green,
- keep screenshots and diagrams tied to a specific decision.
