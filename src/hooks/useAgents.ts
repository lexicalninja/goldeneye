import { useState, useEffect } from 'react';
import type { Agent } from '../types.js';
import { detectAgents, getInstalledAgents } from '../utils/detectAgents.js';
import { assignCharacters } from '../utils/characters.js';

interface UseAgentsResult {
  installedAgents: Agent[];
  loading: boolean;
  error: string | null;
}

export function useAgents(): UseAgentsResult {
  const [installedAgents, setInstalledAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const detected = await detectAgents();
        if (mounted) {
          const installed = getInstalledAgents(detected);
          setInstalledAgents(assignCharacters(installed));
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to detect agents');
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    installedAgents,
    loading,
    error,
  };
}
