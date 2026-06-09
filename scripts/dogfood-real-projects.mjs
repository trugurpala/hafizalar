#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const localTargets = [
  {
    name: 'konusmalar',
    source: 'konusmalar',
    mode: 'local-git',
    runTest: false,
    reason: 'local conversation memory repo without package test script',
  },
  {
    name: 'pala-os',
    source: 'pala-os',
    mode: 'local-git',
    runTest: false,
    reason: 'private Pala OS monorepo proxy without root test script',
  },
  {
    name: 'pala-os-bilgi-bankasi',
    source: 'pala-os-bilgi-bankasi',
    mode: 'local-git',
    runTest: false,
    reason: 'local knowledge-bank repo without package test script',
  },
  {
    name: 'pala-os-v3',
    source: 'pala-os-v3',
    mode: 'local-git',
    runTest: true,
    reason: 'public Pala OS baseline with Node test script',
  },
  {
    name: 'pala-os-v4',
    source: 'pala-os-v4',
    mode: 'local-copy',
    runTest: false,
    reason: 'dirty-inclusive temp copy; install-only because this local shape needs git metadata and legacy test dependencies',
  },
  {
    name: 'pala-os-v5',
    source: 'pala-os-v5',
    mode: 'local-git',
    runTest: true,
    reason: 'private Pala OS control foundation with smoke test',
  },
  {
    name: 'pala-os-v6',
    source: 'pala-os-v6',
    mode: 'local-git',
    runTest: true,
    reason: 'private Pala OS command center with Node test script',
  },
  {
    name: 'pala-os-v10',
    source: 'pala-os-v10',
    mode: 'local-copy',
    runTest: false,
    reason: 'non-git local project copy without package test script',
  },
];

const githubTargets = [
  {
    repo: 'trugurpala/pala-os-v4',
    runTest: false,
    reason: 'public GitHub clone; install-only because default tests require project-specific dependencies',
  },
  {
    repo: 'trugurpala/pala-os-v3',
    runTest: true,
    reason: 'public GitHub clone with Node test script',
  },
  {
    repo: 'trugurpala/pala-os-v5',
    runTest: false,
    reason: 'private GitHub clone; current default branch is install-only',
  },
  {
    repo: 'trugurpala/pala-os-v6',
    runTest: true,
    reason: 'private GitHub clone with Node test script',
  },
  {
    repo: 'trugurpala/pinescriptv6',
    runTest: false,
    reason: 'public GitHub project without required Node test expectation',
  },
];

function parseArgs(argv) {
  const args = {
    codexRoot: path.resolve(root, '..'),
    keep: false,
    json: false,
    githubAll: false,
    githubOwner: 'trugurpala',
    skipGithub: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--codex-root') {
      args.codexRoot = path.resolve(argv[index + 1]);
      index += 1;
    } else if (token === '--keep') {
      args.keep = true;
    } else if (token === '--json') {
      args.json = true;
    } else if (token === '--github-all') {
      args.githubAll = true;
    } else if (token === '--github-owner') {
      args.githubOwner = argv[index + 1];
      index += 1;
    } else if (token === '--skip-github') {
      args.skipGithub = true;
    } else if (token === '--help' || token === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Hafizalar real-project dogfood

Usage:
  node scripts/dogfood-real-projects.mjs --json
  node scripts/dogfood-real-projects.mjs --codex-root C:\\path\\to\\Codex --json

Options:
  --codex-root <path>  Folder containing local Codex projects. Defaults to this repo's parent.
  --skip-github       Skip GitHub clone checks.
  --github-all        Add every non-archived repo from --github-owner as install-only coverage.
  --github-owner <id> Owner used by --github-all. Defaults to trugurpala.
  --keep              Keep the temporary dogfood workspace for inspection.
  --json              Print full JSON evidence.
`);
}

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: options.timeout ?? 600000,
  });

  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  const commandLine = [command, ...args].join(' ');

  if (result.error) {
    throw new Error(`${commandLine} failed: ${result.error.message}`);
  }

  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${commandLine} failed with exit ${result.status}\n${output}`);
  }

  return {
    command: commandLine,
    cwd,
    exitCode: result.status,
    output: output.slice(-5000),
  };
}

function runNpm(args, cwd) {
  if (process.platform === 'win32') {
    return run('cmd.exe', ['/d', '/s', '/c', 'npm.cmd', ...args], cwd);
  }
  return run('npm', args, cwd);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function hasPackageTest(projectPath) {
  const packagePath = path.join(projectPath, 'package.json');
  if (!existsSync(packagePath)) {
    return { hasPackage: false, hasTest: false };
  }
  const pkg = readJson(packagePath);
  return {
    hasPackage: true,
    hasTest: typeof pkg.scripts?.test === 'string' && pkg.scripts.test.trim().length > 0,
    testScript: pkg.scripts?.test ?? null,
    packageName: pkg.name ?? null,
  };
}

function assertInstalled(projectPath) {
  const required = [
    '.hafizalar/HAFIZALAR-CODEX.md',
    '.hafizalar/HAFIZALAR-CHATGPT.md',
    '.hafizalar/AGENTIC-PATTERN-MAP.md',
    '.hafizalar/OPENAI-SURFACE-LIMITS.md',
    '.hafizalar/INSTALL-REPORT.json',
    'HAFIZALAR.md',
    'TASKS.md',
    'REVIEW.md',
    'docs/GOLDEN-PATH.md',
    'docs/PROJECT-SETUP.md',
  ];

  for (const relativePath of required) {
    const target = path.join(projectPath, relativePath);
    if (!existsSync(target)) {
      throw new Error(`Missing installed file: ${relativePath}`);
    }
  }

  const report = readJson(path.join(projectPath, '.hafizalar', 'INSTALL-REPORT.json'));
  if (!report.ok || report.surface !== 'both') {
    throw new Error('Install report is invalid');
  }

  return {
    requiredFiles: required.length,
    written: report.written.length,
    skipped: report.skipped.length,
    force: report.force,
  };
}

function copyFilter(source) {
  const name = path.basename(source).toLowerCase();
  return ![
    '.git',
    'node_modules',
    '.next',
    '.turbo',
    'dist',
    'build',
    'coverage',
    '.vercel',
  ].includes(name);
}

function localGitStatus(sourcePath) {
  if (!existsSync(path.join(sourcePath, '.git'))) {
    return { isGit: false, dirtyCount: 0, dirtyFiles: [] };
  }

  const status = run('git', ['status', '--short'], sourcePath);
  const dirtyFiles = status.output ? status.output.split(/\r?\n/).filter(Boolean) : [];
  const branch = run('git', ['branch', '--show-current'], sourcePath, { allowFailure: true }).output || null;
  const remote = run('git', ['remote', 'get-url', 'origin'], sourcePath, { allowFailure: true }).output || null;
  const head = run('git', ['rev-parse', '--short', 'HEAD'], sourcePath, { allowFailure: true }).output || null;

  return {
    isGit: true,
    branch,
    remote,
    head,
    dirtyCount: dirtyFiles.length,
    dirtyFiles,
  };
}

function installHafizalar(projectPath) {
  const installer = path.join(root, 'scripts', 'install-hafizalar.mjs');
  return run(process.execPath, [installer, '--target', projectPath, '--surface', 'both', '--force'], root);
}

function runProjectTest(projectPath, target) {
  const packageInfo = hasPackageTest(projectPath);
  if (!target.runTest) {
    return {
      status: 'SKIPPED',
      reason: 'target marked install-only',
      packageInfo,
    };
  }

  if (!packageInfo.hasPackage) {
    return {
      status: 'SKIPPED',
      reason: 'package.json not found',
      packageInfo,
    };
  }

  if (!packageInfo.hasTest) {
    return {
      status: 'SKIPPED',
      reason: 'package.json has no test script',
      packageInfo,
    };
  }

  const test = runNpm(['test'], projectPath);
  return {
    status: 'PASS',
    packageInfo,
    command: test.command,
    outputTail: test.output.slice(-2000),
  };
}

function verifyTarget(projectPath, target) {
  const install = installHafizalar(projectPath);
  const installed = assertInstalled(projectPath);
  const test = runProjectTest(projectPath, target);

  return {
    installCommand: install.command,
    installed,
    test,
  };
}

function dogfoodLocalTarget(target, codexRoot, workRoot) {
  const sourcePath = path.join(codexRoot, target.source);
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing local source: ${sourcePath}`);
  }

  const status = localGitStatus(sourcePath);
  const targetPath = path.join(workRoot, 'local', target.name);
  mkdirSync(path.dirname(targetPath), { recursive: true });

  let copyCommand = null;
  if (target.mode === 'local-git') {
    copyCommand = run('git', ['clone', '--quiet', '--no-hardlinks', sourcePath, targetPath], root);
  } else {
    cpSync(sourcePath, targetPath, {
      recursive: true,
      filter: copyFilter,
    });
    copyCommand = {
      command: `copy ${sourcePath} ${targetPath}`,
      cwd: root,
      exitCode: 0,
      output: 'copied with generated/build/cache folders excluded',
    };
  }

  const verified = verifyTarget(targetPath, target);

  return {
    name: target.name,
    mode: target.mode,
    reason: target.reason,
    sourcePath,
    tempPath: targetPath,
    sourceGit: status,
    copyCommand: copyCommand.command,
    ...verified,
    result: verified.test.status === 'PASS' || verified.test.status === 'SKIPPED' ? 'PASS' : 'FAIL',
  };
}

function dogfoodGithubTarget(target, workRoot) {
  const targetPath = path.join(workRoot, 'github', target.repo.replaceAll('/', '__'));
  mkdirSync(path.dirname(targetPath), { recursive: true });

  const clone = run('gh', ['repo', 'clone', target.repo, targetPath, '--', '--depth', '1'], root);
  const head = run('git', ['rev-parse', '--short', 'HEAD'], targetPath, { allowFailure: true }).output || null;
  const branch = run('git', ['branch', '--show-current'], targetPath, { allowFailure: true }).output || null;
  const verified = verifyTarget(targetPath, {
    name: target.repo,
    runTest: target.runTest,
  });

  return {
    repo: target.repo,
    reason: target.reason,
    tempPath: targetPath,
    cloneCommand: clone.command,
    head,
    branch,
    ...verified,
    result: verified.test.status === 'PASS' || verified.test.status === 'SKIPPED' ? 'PASS' : 'FAIL',
  };
}

function githubInventoryTargets(args) {
  if (!args.githubAll || args.skipGithub) {
    return [];
  }

  const output = run('gh', [
    'repo',
    'list',
    args.githubOwner,
    '--limit',
    '200',
    '--json',
    'name,isArchived',
  ], root).output;
  const repos = JSON.parse(output);
  const known = new Set(githubTargets.map((target) => target.repo));

  return repos
    .filter((repo) => !repo.isArchived)
    .map((repo) => `${args.githubOwner}/${repo.name}`)
    .filter((repo) => !known.has(repo))
    .sort()
    .map((repo) => ({
      repo,
      runTest: false,
      reason: 'dynamic GitHub owner inventory install-only coverage',
    }));
}

function cleanTemp(workRoot) {
  const tempPath = path.resolve(tmpdir());
  const resolved = path.resolve(workRoot);
  if (!resolved.toLowerCase().startsWith(tempPath.toLowerCase())) {
    throw new Error(`Refusing to remove non-temp dogfood workspace: ${resolved}`);
  }
  if (existsSync(resolved)) {
    rmSync(resolved, { recursive: true, force: true });
  }
}

function runDogfood(args) {
  const workRoot = mkdtempSync(path.join(tmpdir(), 'hafizalar-real-projects-'));
  const evidence = {
    ok: false,
    version: readJson(path.join(root, 'package.json')).version,
    root,
    codexRoot: args.codexRoot,
    workRoot,
    kept: args.keep,
    skipGithub: args.skipGithub,
    githubAll: args.githubAll,
    githubOwner: args.githubOwner,
    local: [],
    github: [],
    excludedLocalTargets: [],
    releasePosture: 'local proof only; no npm publish, release tag, production deploy, or force push',
  };

  try {
    for (const target of localTargets) {
      evidence.local.push(dogfoodLocalTarget(target, args.codexRoot, workRoot));
    }

    if (!args.skipGithub) {
      for (const target of [...githubTargets, ...githubInventoryTargets(args)]) {
        evidence.github.push(dogfoodGithubTarget(target, workRoot));
      }
    }

    evidence.ok = [
      ...evidence.local.map((item) => item.result),
      ...evidence.github.map((item) => item.result),
    ].every((result) => result === 'PASS');

    if (!evidence.ok) {
      throw new Error('One or more real-project dogfood targets failed');
    }

    return evidence;
  } finally {
    if (!args.keep) {
      cleanTemp(workRoot);
      evidence.cleaned = true;
    }
  }
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const result = runDogfood(args);
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Hafizalar real-project dogfood ${result.ok ? 'PASS' : 'FAIL'}`);
    console.log(`Local targets: ${result.local.length}`);
    console.log(`GitHub targets: ${result.github.length}`);
    if (args.keep) {
      console.log(`Kept workspace: ${result.workRoot}`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
