import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function bytes(relativePath) {
  return readFileSync(path.join(root, relativePath));
}

function isAscii(relativePath) {
  return [...bytes(relativePath)].every((byte) => byte <= 127);
}

const requiredFiles = [
  'README.md',
  'HAFIZALAR-CODEX.md',
  'HAFIZALAR-CODEX-SHORT.md',
  'templates/HAFIZALAR.md',
  'templates/TASKS.md',
  'templates/REVIEW.md',
  'templates/GOLDEN-PATH.md',
  'scripts/test-hafizalar.ps1',
  '.github/workflows/test.yml',
  'LICENSE',
  'package.json',
];

test('required community project files exist', () => {
  for (const file of requiredFiles) {
    assert.doesNotThrow(() => read(file), file);
  }
});

test('core contract keeps the non-negotiable behavior', () => {
  const contract = read('HAFIZALAR-CODEX.md');
  for (const phrase of [
    'Instruction explains. Skill executes. MCP connects. Hook/CI/Gate blocks. Evidence proves.',
    'Hafizalar does not override system, developer, repository, security, or legal instructions.',
    '## 2. First Action: Inspect Before Touching',
    'No fake PASS.',
    '## 17. Destructive Guard',
    '# Hafizalar Repo Audit',
    'Verification not run: <reason>',
  ]) {
    assert.equal(contract.includes(phrase), true, phrase);
  }
});

test('short contract is compact but preserves safety gates', () => {
  const short = read('HAFIZALAR-CODEX-SHORT.md');
  assert.equal(short.includes('Ask only for destructive, paid, secret, production, legal, or security-critical actions.'), true);
  assert.equal(short.includes('No Fake Done'), true);
  assert.ok(short.length < read('HAFIZALAR-CODEX.md').length);
});

test('project files are ascii portable and do not contain obvious secret patterns', () => {
  const filesToCheck = requiredFiles.filter((file) => !file.endsWith('.yml'));
  for (const file of filesToCheck) {
    assert.equal(isAscii(file), true, `${file} should be ASCII`);
    const content = read(file);
    assert.equal(/ghp_|api[_ -]?key|secret[_ -]?key|token:\s*\w/i.test(content), false, `${file} should not contain secret-shaped text`);
  }
});

test('readme points users to the full and short contracts', () => {
  const readme = read('README.md');
  assert.equal(readme.includes('HAFIZALAR-CODEX.md'), true);
  assert.equal(readme.includes('HAFIZALAR-CODEX-SHORT.md'), true);
  assert.equal(readme.includes('npm.cmd test'), true);
});

test('templates are intentionally small and project-adaptable', () => {
  assert.equal(read('templates/HAFIZALAR.md').includes('Inspect first.'), true);
  assert.equal(read('templates/TASKS.md').includes('## Active'), true);
  assert.equal(read('templates/REVIEW.md').includes('### Verification'), true);
  assert.equal(read('templates/GOLDEN-PATH.md').includes('From Zero To Local Run'), true);
});

test('sandbox node verification works without dependencies', () => {
  const sandbox = mkdtempSync(path.join(tmpdir(), 'hafizalar-community-smoke-'));
  try {
    mkdirSync(path.join(sandbox, 'test'), { recursive: true });
    writeFileSync(
      path.join(sandbox, 'test', 'smoke.mjs'),
      "import assert from 'node:assert/strict';\nassert.equal(2 + 2, 4);\nconsole.log('sandbox proof pass');\n",
    );
    const output = execFileSync(process.execPath, [path.join(sandbox, 'test', 'smoke.mjs')], {
      encoding: 'utf8',
    });
    assert.match(output, /sandbox proof pass/);
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});
