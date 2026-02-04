import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import type { Agent } from '../types.js';

interface AgentListProps {
  agents: Agent[];
  onSelect: (agent: Agent | null) => void;
}

// Store agent mapping outside of component to access in handler
const agentMap = new Map<string, Agent | null>();

export function AgentList({ agents, onSelect }: AgentListProps): React.ReactElement {
  // Build items and populate agent map
  agentMap.clear();
  const items = [
    ...agents.map((agent) => {
      agentMap.set(agent.command, agent);
      return {
        label: agent.displayName ?? agent.name,
        value: agent.command,
      };
    }),
    { label: '─────────────', value: 'separator' },
    { label: 'Skip → Terminal', value: 'skip' },
  ];
  agentMap.set('separator', null);
  agentMap.set('skip', null);

  const handleSelect = (item: { label: string; value: string }) => {
    if (item.value === 'separator') {
      return;
    }
    if (item.value === 'skip') {
      onSelect(null);
      return;
    }
    onSelect(agentMap.get(item.value) ?? null);
  };

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <SelectInput
        items={items}
        onSelect={handleSelect}
        itemComponent={({ isSelected, label }) => {
          const item = items.find((i) => i.label === label);
          if (item?.value === 'separator') {
            return <Text color="gray">{label}</Text>;
          }
          return (
            <Text color={isSelected ? 'green' : undefined}>
              {isSelected ? '❯ ' : '  '}
              {label}
            </Text>
          );
        }}
        indicatorComponent={() => null}
      />
    </Box>
  );
}
