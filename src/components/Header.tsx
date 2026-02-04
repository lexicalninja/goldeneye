import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
  version?: string;
}

export function Header({ version }: HeaderProps): React.ReactElement {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      paddingX={2}
      paddingY={1}
      borderStyle="round"
      borderColor="yellow"
    >
      <Text bold color="yellow">
        GOLDENEYE
      </Text>
      <Text color="gray">
        Coding Agent Launcher{version ? ` v${version}` : ''}
      </Text>
    </Box>
  );
}
