import { getVersion } from './version.js';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/lexicalninja/goldeneye/main/package.json';
const CHECK_TIMEOUT = 3000; // 3 seconds

interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
}

function compareVersions(current: string, latest: string): boolean {
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const currentPart = currentParts[i] ?? 0;
    const latestPart = latestParts[i] ?? 0;

    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }

  return false;
}

export async function checkForUpdates(): Promise<UpdateInfo | null> {
  const currentVersion = getVersion();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

    const url = `${GITHUB_RAW_BASE}?t=${Date.now()}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'goldeneye-cli',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const packageJson = await response.json() as { version?: string };
    const latestVersion = packageJson.version;

    if (!latestVersion) {
      return null;
    }

    return {
      currentVersion,
      latestVersion,
      updateAvailable: compareVersions(currentVersion, latestVersion),
    };
  } catch {
    // Silently fail - don't block the app if update check fails
    return null;
  }
}
