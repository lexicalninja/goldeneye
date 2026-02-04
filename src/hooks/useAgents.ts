import { useState, useEffect } from 'react';
import type { Agent } from '../types.js';
import { detectAgents, getInstalledAgents } from '../utils/detectAgents.js';
import { assignCharacters } from '../utils/characters.js';

interface UseAgentsResult {
  agents: Agent[];
  installedAgents: Agent[];
  loading: boolean;
  error: string | null;
}

export function useAgents(): UseAgentsResult {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [installedAgents, setInstalledAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const detected = await detectAgents();
        if (mounted) {
          setAgents(detected);
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
    agents,
    installedAgents,
    loading,
    error,
  };
}
