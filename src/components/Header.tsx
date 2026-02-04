import React from 'react';
import { Box, Text } from 'ink';

export function Header(): React.ReactElement {
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
      <Text color="gray">Coding Agent Launcher</Text>
    </Box>
  );
}
