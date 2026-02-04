import React from 'react';
import { Box, Text } from 'ink';

export function StatusBar(): React.ReactElement {
  return (
    <Box
      paddingX={2}
      paddingY={1}
      borderStyle="single"
      borderColor="gray"
      justifyContent="center"
    >
      <Text color="gray">
        <Text color="white">↑↓</Text> Navigate{'  '}
        <Text color="white">⏎</Text> Select{'  '}
        <Text color="white">q</Text> Quit
      </Text>
    </Box>
  );
}
