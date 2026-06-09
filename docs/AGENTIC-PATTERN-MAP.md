# Agentic Pattern Map

Source reviewed: `Agentic_Design_Patterns.pdf`

Drive source: https://drive.google.com/file/d/1-5ho2aSZ-z0FcW8W_jMUoFSQ5hTKvJ43/view

Date reviewed: 2026-06-09

This file translates agentic design patterns into Hafizalar operating rules. It does not republish the source text.

## Adoption Matrix

| Pattern | Hafizalar Use |
| --- | --- |
| Prompt chaining | Break messy requests into inspect, decide, implement, verify, report. |
| Routing | Choose the right surface: ChatGPT for shaping, Codex for local proof, Figma for visual artifacts, GitHub for repo evidence. |
| Parallelization | Run independent reads and checks in parallel when it reduces time without increasing risk. |
| Reflection | Review the diff, evidence, and risk before claiming done. |
| Tool use | Prefer tools that create evidence: tests, CI, browser proof, GitHub status, Figma links, Drive sources. |
| Planning | Use short plans for medium/high-risk tasks and keep one in-progress step at a time. |
| Multi-agent | Use specialist tools or sub-agents only when the task benefits from role separation. Keep one accountable final reporter. |
| Memory management | Store durable decisions, risks, run steps, and definition of done in project files, not only chat history. |
| Learning and adaptation | When a repeated workflow improves, update Hafizalar docs, templates, or tests. |
| MCP | Treat connectors as evidence and context bridges, not magic authority. Report unavailable connectors honestly. |
| Goal monitoring | Tie every task to a definition of done and a verification path. |
| Exception recovery | On failure, identify the failed step, preserve evidence, choose the smallest next fix, and retest. |
| Human-in-the-loop | Ask only at real gates: destructive, paid, credential, production, legal, or security-critical actions. |
| Knowledge retrieval | Use source-backed context packs and cite the source used for decisions. |
| Inter-agent communication | Use compact handoffs with goal, files, constraints, commands, proof, and risks. |
| Resource-aware optimization | Minimize token and tool waste through targeted reads, local commands, and small context packs. |
| Reasoning techniques | Select the reasoning style by risk: direct fix for low risk, plan-execute-review for higher risk. |
| Guardrails | Make unsafe actions explicit gates and keep secrets/private data out of docs and reports. |
| Evaluation and monitoring | Prefer deterministic tests, CI, screenshots, logs, and install reports over subjective confidence. |
| Prioritization | Fix install/build blockers before runtime, type, UI, and docs issues. |
| Exploration and discovery | Inspect the repo and environment before changing files. |

## Hafizalar Operating Loop

```text
route -> inspect -> plan -> act -> observe -> reflect -> recover or report
```

The loop is intentionally local-first:

- route the work to the correct surface,
- inspect only the context needed,
- plan enough for the risk level,
- act with focused changes,
- observe through deterministic proof,
- reflect before reporting,
- recover from the smallest confirmed failure.

## Design Rules Added To Hafizalar

- Every tool call should have a reason: context, mutation, proof, or publication.
- Every meaningful mutation should leave a trail: changed files, evidence, risks, rollback.
- Every source-backed update should name the source and avoid copying source text.
- Every install path should be tested outside the active workspace when possible.
- Every agentic shortcut must still pass the no-fake-done rule.

## What Hafizalar Avoids

- Fully autonomous destructive actions.
- Hidden release or deploy assumptions.
- Broad option menus when one practical path is enough.
- Long source dumps instead of compact source-backed decisions.
- Treating ChatGPT planning as local execution proof.

## Future Hardening

- Add trajectory-style logs for installer runs if the installer grows.
- Add a release checklist that records source refreshes and agentic-pattern changes.
- Add optional eval fixtures for Hafizalar prompt behavior without requiring private user data.
