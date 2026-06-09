import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
  '.editorconfig',
  '.gitattributes',
  'HAFIZALAR-CODEX.md',
  'HAFIZALAR-CODEX-SHORT.md',
  'HAFIZALAR-CHATGPT.md',
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'SUPPORT.md',
  'assets/brand/hafizalar-repo-card.svg',
  'docs/DIAGRAMS.md',
  'docs/FIGMA-HANDOFF.md',
  'docs/GITHUB-REPO-CHECKLIST.md',
  'docs/INSTALLATION.md',
  'docs/MAINTENANCE.md',
  'docs/OPENAI-SURFACE-LIMITS.md',
  'docs/USAGE.md',
  'scripts/install-hafizalar.mjs',
  'scripts/install-hafizalar.ps1',
  'templates/HAFIZALAR.md',
  'templates/TASKS.md',
  'templates/REVIEW.md',
  'templates/GOLDEN-PATH.md',
  'templates/PROJECT-SETUP.md',
  'scripts/test-hafizalar.ps1',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/docs_improvement.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/dependabot.yml',
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

test('chatgpt contract keeps ChatGPT separate from Codex and local proof', () => {
  const contract = read('HAFIZALAR-CHATGPT.md');
  for (const phrase of [
    'ChatGPT is not Codex.',
    'Do not pretend you can inspect or modify local files',
    'ChatGPT and Codex have separate practical limits.',
    'Verification not run: no local/CI proof available in ChatGPT.',
    '# Hafizalar ChatGPT Intake',
  ]) {
    assert.equal(contract.includes(phrase), true, phrase);
  }
});

test('surface limits doc records separate Codex and ChatGPT limits with official sources', () => {
  const limits = read('docs/OPENAI-SURFACE-LIMITS.md');
  for (const phrase of [
    'Codex and ChatGPT are separate working surfaces.',
    'ChatGPT upload/image/voice banners do not apply to Codex.',
    'https://help.openai.com/en/articles/11369540-codex-in-chatgpt-faq',
    'https://help.openai.com/en/articles/8555545-uploading-files-in-chatgpt',
    'https://help.openai.com/en/articles/11752874-chatgpt-agent',
  ]) {
    assert.equal(limits.includes(phrase), true, phrase);
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
  assert.equal(readme.includes('HAFIZALAR-CHATGPT.md'), true);
  assert.equal(readme.includes('install:hafizalar'), true);
  assert.equal(readme.includes('docs/OPENAI-SURFACE-LIMITS.md'), true);
  assert.equal(readme.includes('docs/INSTALLATION.md'), true);
  assert.equal(readme.includes('assets/brand/hafizalar-repo-card.svg'), true);
  assert.equal(readme.includes('npm.cmd test'), true);
});

test('templates are intentionally small and project-adaptable', () => {
  assert.equal(read('templates/HAFIZALAR.md').includes('Inspect first.'), true);
  assert.equal(read('templates/TASKS.md').includes('## Active'), true);
  assert.equal(read('templates/REVIEW.md').includes('### Verification'), true);
  assert.equal(read('templates/GOLDEN-PATH.md').includes('From Zero To Local Run'), true);
  assert.equal(read('templates/PROJECT-SETUP.md').includes('## Definition Of Done'), true);
});

test('github community surface is present', () => {
  assert.equal(read('.github/workflows/test.yml').includes('workflow_dispatch'), true);
  assert.equal(read('.github/PULL_REQUEST_TEMPLATE.md').includes('## Verification'), true);
  assert.equal(read('.github/dependabot.yml').includes('github-actions'), true);
  assert.equal(read('SECURITY.md').includes('Security Policy'), true);
  assert.equal(read('SUPPORT.md').includes('docs/INSTALLATION.md'), true);
});

test('documentation includes diagrams, install detail, and figma handoff', () => {
  assert.equal(read('docs/INSTALLATION.md').includes('## Dry-Run First'), true);
  assert.equal(read('docs/USAGE.md').includes('## Compact Handoff Template'), true);
  assert.equal(read('docs/DIAGRAMS.md').includes('```mermaid'), true);
  assert.equal(read('docs/FIGMA-HANDOFF.md').includes('figma.com/board'), true);
  assert.equal(read('docs/GITHUB-REPO-CHECKLIST.md').includes('Repo Settings To Review Manually'), true);
  assert.equal(read('docs/MAINTENANCE.md').includes('## Release Checklist'), true);
  assert.equal(read('assets/brand/hafizalar-repo-card.svg').includes('<svg'), true);
});

test('package metadata supports public github repo usage', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.repository.url, 'git+https://github.com/trugurpala/hafizalar.git');
  assert.equal(pkg.bugs.url, 'https://github.com/trugurpala/hafizalar/issues');
  assert.equal(pkg.bin['hafizalar-install'], './scripts/install-hafizalar.mjs');
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

test('installer dry-run and real install work for Codex and ChatGPT surfaces', () => {
  const sandbox = mkdtempSync(path.join(tmpdir(), 'hafizalar-install-smoke-'));
  try {
    const installer = path.join(root, 'scripts', 'install-hafizalar.mjs');
    const dryRunOutput = execFileSync(process.execPath, [installer, '--target', sandbox, '--surface', 'both', '--dry-run'], {
      encoding: 'utf8',
    });
    const dryRun = JSON.parse(dryRunOutput);
    assert.equal(dryRun.dryRun, true);
    assert.equal(dryRun.wouldWrite.length > 0, true);
    assert.equal(dryRun.written.length, 0);
    assert.equal(existsSync(path.join(sandbox, '.hafizalar', 'HAFIZALAR-CODEX.md')), false);

    const installOutput = execFileSync(process.execPath, [installer, '--target', sandbox, '--surface', 'both'], {
      encoding: 'utf8',
    });
    const install = JSON.parse(installOutput);
    assert.equal(install.ok, true);
    assert.equal(install.surface, 'both');
    assert.equal(existsSync(path.join(sandbox, '.hafizalar', 'HAFIZALAR-CODEX.md')), true);
    assert.equal(existsSync(path.join(sandbox, '.hafizalar', 'HAFIZALAR-CHATGPT.md')), true);
    assert.equal(existsSync(path.join(sandbox, '.hafizalar', 'OPENAI-SURFACE-LIMITS.md')), true);
    assert.equal(existsSync(path.join(sandbox, 'HAFIZALAR.md')), true);
    assert.equal(existsSync(path.join(sandbox, 'docs', 'GOLDEN-PATH.md')), true);
    assert.equal(existsSync(path.join(sandbox, 'docs', 'PROJECT-SETUP.md')), true);
    assert.equal(existsSync(path.join(sandbox, '.hafizalar', 'INSTALL-REPORT.json')), true);

    const secondOutput = execFileSync(process.execPath, [installer, '--target', sandbox, '--surface', 'both'], {
      encoding: 'utf8',
    });
    const second = JSON.parse(secondOutput);
    assert.equal(second.skipped.length > 0, true);
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});
