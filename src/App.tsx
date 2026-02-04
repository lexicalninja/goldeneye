import React from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Header } from './components/Header.js';
import { AgentList } from './components/AgentList.js';
import { StatusBar } from './components/StatusBar.js';
import { useAgents } from './hooks/useAgents.js';
import type { Agent } from './types.js';

interface AppProps {
  onSelectAgent: (agent: Agent | null) => void;
}

export function App({ onSelectAgent }: AppProps): React.ReactElement {
  const { exit } = useApp();
  const { installedAgents, loading, error } = useAgents();

  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      onSelectAgent(null);
      exit();
    }
  });

  const handleSelect = (agent: Agent | null) => {
    onSelectAgent(agent);
    exit();
  };

  if (loading) {
    return (
      <Box flexDirection="column">
        <Header />
        <Box paddingX={2} paddingY={1}>
          <Text color="yellow">Detecting agents...</Text>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column">
        <Header />
        <Box paddingX={2} paddingY={1}>
          <Text color="red">Error: {error}</Text>
        </Box>
      </Box>
    );
  }

  if (installedAgents.length === 0) {
    return (
      <Box flexDirection="column">
        <Header />
        <Box flexDirection="column" paddingX={2} paddingY={1}>
          <Text color="yellow">No coding agents detected.</Text>
          <Text color="gray">Install one of: claude, aider, gh copilot, cursor, continue, cody</Text>
        </Box>
        <StatusBar />
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Header />
      <AgentList agents={installedAgents} onSelect={handleSelect} />
      <StatusBar />
    </Box>
  );
}
