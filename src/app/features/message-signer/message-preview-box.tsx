import { Stack, styled } from 'leather-styles/jsx';

import { HashDrawer } from './hash-drawer';

interface MessageBoxProps {
  message: string;
  hash?: string;
}
export function MessagePreviewBox({ message, hash }: MessageBoxProps) {
  return (
    <Stack
      bg="accent.background-primary"
      border="active"
      borderRadius="sm"
      paddingBottom={hash ? 'space.02' : 0}
    >
      <Stack
        bg="accent.background-primary"
        borderRadius="lg"
        gap="space.02"
        px="space.05"
        py="space.05"
        overflowX="auto"
      >
        {message.split(/\r?\n/).map(line => (
          <styled.span key={line} textStyle="label.01">
            {line}
          </styled.span>
        ))}
      </Stack>
      {hash ? <HashDrawer hash={hash} /> : null}
    </Stack>
  );
}
