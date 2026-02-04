import React from 'react';
import { Box, Text } from 'ink';

interface UpdateBannerProps {
  currentVersion: string;
  latestVersion: string;
}

export function UpdateBanner({ currentVersion, latestVersion }: UpdateBannerProps): React.ReactElement {
  return (
    <Box
      borderStyle="single"
      borderColor="yellow"
      paddingX={1}
      marginX={2}
      marginBottom={1}
    >
      <Text color="yellow">
        Update available: {currentVersion} → {latestVersion}
        {' '}
        <Text color="gray">Run: goldeneye update</Text>
      </Text>
    </Box>
  );
}
