import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

function getPackageJsonPath(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  // Go up from src/utils to project root
  return join(currentDir, '..', '..', 'package.json');
}

export function getVersion(): string {
  try {
    const packageJson = JSON.parse(readFileSync(getPackageJsonPath(), 'utf-8'));
    return packageJson.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}
