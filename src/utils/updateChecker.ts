import { getVersion } from './version.js';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/lexicalninja/goldeneye/main/package.json';
const CHECK_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 2;

const DEBUG = process.env.GOLDENEYE_DEBUG === '1';

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

async function fetchLatestVersion(): Promise<string | null> {
  const url = `${GITHUB_RAW_BASE}?t=${Date.now()}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'goldeneye-cli',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (DEBUG) console.error(`[goldeneye] Update check failed: HTTP ${response.status}`);
        continue;
      }

      const packageJson = (await response.json()) as { version?: string };
      const latestVersion = packageJson.version;

      if (!latestVersion) {
        if (DEBUG) console.error('[goldeneye] Update check failed: no version in response');
        continue;
      }

      return latestVersion;
    } catch (err) {
      if (DEBUG) console.error('[goldeneye] Update check failed:', (err as Error).message);
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  return null;
}

export async function checkForUpdates(): Promise<UpdateInfo | null> {
  const currentVersion = getVersion();
  const latestVersion = await fetchLatestVersion();

  if (!latestVersion) {
    return null;
  }

  const updateAvailable = compareVersions(currentVersion, latestVersion);

  if (DEBUG) {
    console.error(
      `[goldeneye] Update check: current=${currentVersion} latest=${latestVersion} available=${updateAvailable}`
    );
  }

  return {
    currentVersion,
    latestVersion,
    updateAvailable,
  };
}
