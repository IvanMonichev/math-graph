import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const invalid = [];
function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(entry.name))
      invalid.push(path);
    if (entry.isDirectory()) check(path);
  }
}
['src', 'data', 'content', 'scripts', 'tests', 'public', '.github/workflows'].forEach(check);
if (invalid.length) {
  console.error('Используйте kebab-case:\n' + invalid.join('\n'));
  process.exitCode = 1;
} else console.log('Имена файлов и каталогов соответствуют kebab-case.');
