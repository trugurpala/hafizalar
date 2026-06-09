#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const args = {
    target: process.cwd(),
    surface: 'both',
    dryRun: false,
    force: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--target') {
      args.target = argv[index + 1];
      index += 1;
    } else if (token === '--surface') {
      args.surface = argv[index + 1];
      index += 1;
    } else if (token === '--dry-run') {
      args.dryRun = true;
    } else if (token === '--force') {
      args.force = true;
    } else if (token === '--help' || token === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Hafizalar installer

Usage:
  node scripts/install-hafizalar.mjs --target C:\\path\\project --surface both

Options:
  --target <path>       Project folder. Defaults to current directory.
  --surface <value>     codex | chatgpt | both. Defaults to both.
  --dry-run             Print planned writes without writing.
  --force               Overwrite existing files.
`);
}

function selectedFiles(surface) {
  const common = [
    ['README.md', '.hafizalar/README.md'],
    ['HAFIZALAR-CODEX-SHORT.md', '.hafizalar/HAFIZALAR-CODEX-SHORT.md'],
    ['docs/OPENAI-SURFACE-LIMITS.md', '.hafizalar/OPENAI-SURFACE-LIMITS.md'],
    ['templates/HAFIZALAR.md', 'HAFIZALAR.md'],
    ['templates/TASKS.md', 'TASKS.md'],
    ['templates/REVIEW.md', 'REVIEW.md'],
    ['templates/GOLDEN-PATH.md', 'docs/GOLDEN-PATH.md'],
    ['templates/PROJECT-SETUP.md', 'docs/PROJECT-SETUP.md'],
  ];

  const codex = [['HAFIZALAR-CODEX.md', '.hafizalar/HAFIZALAR-CODEX.md']];
  const chatgpt = [['HAFIZALAR-CHATGPT.md', '.hafizalar/HAFIZALAR-CHATGPT.md']];

  if (surface === 'codex') {
    return [...common, ...codex];
  }
  if (surface === 'chatgpt') {
    return [...common, ...chatgpt];
  }
  if (surface === 'both') {
    return [...common, ...codex, ...chatgpt];
  }

  throw new Error(`Invalid --surface value: ${surface}`);
}

function ensureSourceExists(files) {
  for (const [source] of files) {
    const sourcePath = path.join(root, source);
    if (!existsSync(sourcePath)) {
      throw new Error(`Missing source file: ${source}`);
    }
  }
}

function install(args) {
  const target = path.resolve(args.target);
  const files = selectedFiles(args.surface);
  ensureSourceExists(files);

  const planned = [];
  const skipped = [];
  const written = [];
  const wouldWrite = [];

  for (const [source, destination] of files) {
    const sourcePath = path.join(root, source);
    const destinationPath = path.join(target, destination);
    const exists = existsSync(destinationPath);

    planned.push({ source, destination });

    if (exists && !args.force) {
      skipped.push({ destination, reason: 'exists' });
      continue;
    }

    if (args.dryRun) {
      wouldWrite.push({ source, destination });
      continue;
    }

    mkdirSync(path.dirname(destinationPath), { recursive: true });
    copyFileSync(sourcePath, destinationPath);
    written.push({ source, destination });
  }

  const report = {
    ok: true,
    target,
    surface: args.surface,
    dryRun: args.dryRun,
    force: args.force,
    planned,
    wouldWrite,
    written,
    skipped,
  };

  if (!args.dryRun) {
    const reportPath = path.join(target, '.hafizalar', 'INSTALL-REPORT.json');
    mkdirSync(path.dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    report.installReport = reportPath;

    const readmePath = path.join(target, '.hafizalar', 'README.md');
    if (existsSync(readmePath)) {
      const readme = readFileSync(readmePath, 'utf8');
      if (!readme.includes('HAFIZALAR-CODEX.md') && args.surface !== 'chatgpt') {
        throw new Error('Installed README does not mention Codex contract');
      }
    }
  }

  return report;
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }
  const report = install(args);
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
