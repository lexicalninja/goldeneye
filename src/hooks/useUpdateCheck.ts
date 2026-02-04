import { useState, useEffect } from 'react';
import { checkForUpdates } from '../utils/updateChecker.js';

interface UpdateCheckResult {
  updateAvailable: boolean;
  latestVersion: string | null;
  currentVersion: string | null;
  checking: boolean;
}

export function useUpdateCheck(): UpdateCheckResult {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const result = await checkForUpdates();

      if (mounted && result) {
        setUpdateAvailable(result.updateAvailable);
        setLatestVersion(result.latestVersion);
        setCurrentVersion(result.currentVersion);
      }

      if (mounted) {
        setChecking(false);
      }
    }

    check();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    updateAvailable,
    latestVersion,
    currentVersion,
    checking,
  };
}
