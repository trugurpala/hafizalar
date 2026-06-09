#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  return {
    keep: argv.includes('--keep'),
    json: argv.includes('--json'),
  };
}

function writeJson(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function runNode(args, cwd) {
  return execFileSync(process.execPath, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function assertFile(filePath, label) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
}

function runDogfood(args) {
  const target = mkdtempSync(path.join(tmpdir(), 'hafizalar-dogfood-project-'));
  const evidence = {
    ok: false,
    target,
    kept: args.keep,
    scenario: 'empty project -> Hafizalar install -> product request -> implementation -> test -> report',
    checks: [],
  };

  try {
    const installer = path.join(root, 'scripts', 'install-hafizalar.mjs');

    const dryRun = JSON.parse(runNode([installer, '--target', target, '--surface', 'both', '--dry-run'], root));
    if (!dryRun.dryRun || dryRun.written.length !== 0 || dryRun.wouldWrite.length === 0) {
      throw new Error('Dogfood dry-run did not produce expected plan');
    }
    evidence.checks.push({ name: 'installer dry-run', result: 'PASS', wouldWrite: dryRun.wouldWrite.length });

    const install = JSON.parse(runNode([installer, '--target', target, '--surface', 'both'], root));
    if (!install.ok || install.surface !== 'both') {
      throw new Error('Dogfood install did not complete');
    }
    evidence.checks.push({ name: 'installer real run', result: 'PASS', written: install.written.length });

    for (const [relativePath, label] of [
      ['.hafizalar/HAFIZALAR-CODEX.md', 'Codex contract'],
      ['.hafizalar/HAFIZALAR-CHATGPT.md', 'ChatGPT contract'],
      ['.hafizalar/AGENTIC-PATTERN-MAP.md', 'agentic pattern map'],
      ['.hafizalar/INSTALL-REPORT.json', 'install report'],
      ['docs/PROJECT-SETUP.md', 'project setup template'],
    ]) {
      assertFile(path.join(target, relativePath), label);
    }
    evidence.checks.push({ name: 'installed project files', result: 'PASS' });

    const productRequest = {
      request: 'Build a deterministic greeting module with a local test.',
      route: 'ChatGPT shapes the small product outcome; Codex implements and verifies locally.',
      risk: 'Low',
      definitionOfDone: [
        'module exports a greeting function',
        'unit test proves deterministic behavior',
        'review file records changed files and evidence',
      ],
    };
    writeJson(path.join(target, 'DOGFOOD-REQUEST.json'), productRequest);

    mkdirSync(path.join(target, 'src'), { recursive: true });
    mkdirSync(path.join(target, 'test'), { recursive: true });
    writeFileSync(
      path.join(target, 'package.json'),
      `${JSON.stringify(
        {
          type: 'module',
          scripts: {
            test: 'node --test test/greeting.test.mjs',
          },
        },
        null,
        2,
      )}\n`,
    );
    writeFileSync(
      path.join(target, 'src', 'greeting.mjs'),
      "export function greeting(name) {\n  const cleanName = String(name || '').trim();\n  return `Hello, ${cleanName || 'builder'}.`;\n}\n",
    );
    writeFileSync(
      path.join(target, 'test', 'greeting.test.mjs'),
      "import assert from 'node:assert/strict';\nimport { greeting } from '../src/greeting.mjs';\n\nassert.equal(greeting('Ugur'), 'Hello, Ugur.');\nassert.equal(greeting('  '), 'Hello, builder.');\nconsole.log('dogfood greeting proof pass');\n",
    );

    const testOutput = execFileSync(process.execPath, ['--test', path.join('test', 'greeting.test.mjs')], {
      cwd: target,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (!testOutput.includes('dogfood greeting proof pass')) {
      throw new Error('Dogfood target test output missing proof marker');
    }
    evidence.checks.push({ name: 'target project test', result: 'PASS' });

    const installReport = readJson(path.join(target, '.hafizalar', 'INSTALL-REPORT.json'));
    if (!installReport.ok || installReport.written.length === 0) {
      throw new Error('Installed report is not valid');
    }
    evidence.checks.push({ name: 'install report', result: 'PASS' });

    const review = [
      '# Dogfood Review',
      '',
      '## Done',
      '- Installed Hafizalar into an empty temporary project.',
      '- Implemented deterministic greeting module.',
      '- Ran local target test.',
      '',
      '## Changed Files',
      '- package.json',
      '- src/greeting.mjs',
      '- test/greeting.test.mjs',
      '- DOGFOOD-REQUEST.json',
      '',
      '## Verification',
      '- command: node --test test/greeting.test.mjs',
      '- result: PASS',
      '',
      '## Risks Left',
      '- This is a synthetic dogfood scenario, not a full product app.',
      '',
    ].join('\n');
    const reviewPath = path.join(target, 'REVIEW.md');
    writeFileSync(reviewPath, review);
    assertFile(reviewPath, 'dogfood review');
    evidence.checks.push({ name: 'review report', result: 'PASS' });

    evidence.ok = true;
    evidence.review = {
      verified: true,
      path: args.keep ? reviewPath : null,
      note: args.keep ? 'temporary project kept for inspection' : 'temporary review verified, then removed with the temp project',
    };
    return evidence;
  } finally {
    if (!args.keep) {
      const tempPath = path.resolve(tmpdir());
      const resolved = path.resolve(target);
      if (resolved.toLowerCase().startsWith(tempPath.toLowerCase()) && existsSync(resolved)) {
        rmSync(resolved, { recursive: true, force: true });
      }
      evidence.cleaned = true;
    }
  }
}

try {
  const args = parseArgs(process.argv.slice(2));
  const result = runDogfood(args);
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Hafizalar dogfood ${result.ok ? 'PASS' : 'FAIL'}`);
    console.log(JSON.stringify(result.checks, null, 2));
    if (args.keep) {
      console.log(`Kept target: ${result.target}`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
