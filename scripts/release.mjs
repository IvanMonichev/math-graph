import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

export function nextVersion(current, bump) {
  const valid = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
  if (!valid.test(current)) throw new Error('Текущая версия должна иметь вид X.Y.Z.');
  const parts = current.split('.').map(Number);
  let next;
  if (bump === 'patch') next = [parts[0], parts[1], parts[2] + 1];
  else if (bump === 'minor') next = [parts[0], parts[1] + 1, 0];
  else if (bump === 'major') next = [parts[0] + 1, 0, 0];
  else if (valid.test(bump)) next = bump.split('.').map(Number);
  else throw new Error('Укажите patch, minor, major или версию X.Y.Z.');
  if (!next.every(Number.isSafeInteger)) throw new Error('Слишком большой номер версии.');
  const firstDifference = next.findIndex((part, index) => part !== parts[index]);
  if (firstDifference === -1 || next[firstDifference] < parts[firstDifference])
    throw new Error('Новая версия должна быть больше текущей.');
  return next.join('.');
}

function release() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log(
      'npm run release -- patch|minor|major|X.Y.Z [--dry-run]\nПроверки → версия → коммит → тег → atomic push ветки и тега в origin.',
    );
    return;
  }
  const bump = args.find((arg) => !arg.startsWith('--')) ?? 'patch';
  if (
    args.some((arg) => arg.startsWith('--') && arg !== '--dry-run') ||
    args.filter((arg) => !arg.startsWith('--')).length > 1
  )
    throw new Error('Неизвестные аргументы. Используйте --help.');
  const cwd = fileURLToPath(new URL('..', import.meta.url));
  const git = (...command) =>
    execFileSync('git', command, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  const root = git('rev-parse', '--show-toplevel');
  const canonicalPath = (path) => {
    const resolved = realpathSync.native(path);
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
  };
  if (canonicalPath(root) !== canonicalPath(cwd))
    throw new Error('Проект должен находиться в корне своего Git-репозитория.');
  if (git('status', '--porcelain'))
    throw new Error('Сначала закоммитьте или сохраните все изменения.');
  const branch = git('symbolic-ref', '--quiet', '--short', 'HEAD');
  git('remote', 'get-url', 'origin');
  const pkgPath = join(cwd, 'package.json');
  const lockPath = join(cwd, 'package-lock.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  if (pkg.version !== lock.version || pkg.version !== lock.packages?.['']?.version)
    throw new Error('Версии package.json и package-lock.json не совпадают.');
  const version = nextVersion(pkg.version, bump);
  const tag = `v${version}`;
  if (git('tag', '--list', tag)) throw new Error(`Тег ${tag} уже существует локально.`);
  if (git('ls-remote', '--tags', 'origin', `refs/tags/${tag}`))
    throw new Error(`Тег ${tag} уже существует в origin.`);
  const remoteHead = git('ls-remote', '--heads', 'origin', `refs/heads/${branch}`).split(/\s+/)[0];
  if (!remoteHead) throw new Error(`Сначала опубликуйте ветку: git push -u origin ${branch}`);
  if (git('rev-parse', 'HEAD') !== remoteHead)
    throw new Error('Локальная ветка и origin различаются. Сначала синхронизируйте их.');
  git('var', 'GIT_AUTHOR_IDENT');
  git('var', 'GIT_COMMITTER_IDENT');
  console.log(`${pkg.version} → ${version}\nВетка: ${branch}\nТег: ${tag}`);
  if (args.includes('--dry-run')) {
    console.log(
      'Dry run: файлы не изменены, команды commit/tag/push не выполнялись.\nБудут выполнены npm run check, npm run test:e2e, обновление двух файлов, коммит и atomic push.',
    );
    return;
  }
  // Invoke npm's JavaScript entry point directly; no shell interpolation on Windows.
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('Запускайте скрипт через npm run release.');
  for (const script of ['check', 'test:e2e'])
    execFileSync(process.execPath, [npmCli, 'run', script], { cwd, stdio: 'inherit' });
  if (git('status', '--porcelain'))
    throw new Error('Проверки изменили рабочее дерево. Сохраните изменения и повторите.');
  pkg.version = version;
  lock.version = version;
  lock.packages[''].version = version;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
  execFileSync(
    process.execPath,
    [join(cwd, 'node_modules/prettier/bin/prettier.cjs'), '--write', pkgPath],
    { cwd, stdio: 'inherit' },
  );
  git('add', '--', 'package.json', 'package-lock.json');
  git('commit', '-m', `chore: release ${tag}`, '--', 'package.json', 'package-lock.json');
  git('tag', '-a', tag, '-m', `MathGraph ${tag}`);
  try {
    execFileSync(
      'git',
      ['push', '--atomic', 'origin', `HEAD:refs/heads/${branch}`, `refs/tags/${tag}`],
      { cwd, stdio: 'inherit' },
    );
  } catch {
    throw new Error(
      `Push не выполнен. Локальные коммит и тег сохранены. После устранения причины повторите: git push --atomic origin HEAD:refs/heads/${branch} refs/tags/${tag}`,
    );
  }
  console.log(`Опубликована версия ${tag}. GitHub Actions проверит и соберёт архив приложения.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    release();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
