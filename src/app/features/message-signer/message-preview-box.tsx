import { Stack, styled } from 'leather-styles/jsx';

import { HashDrawer } from './hash-drawer';

interface MessageBoxProps {
  message: string;
  hash?: string;
}
export function MessagePreviewBox({ message, hash }: MessageBoxProps) {
  return (
    <Stack
      bg="ink.background-primary"
      border="active"
      borderRadius="sm"
      pb={hash ? 'space.02' : 0}
      width="100%"
      maxWidth="popupMaxWidth"
    >
      <Stack
        bg="ink.background-primary"
        borderRadius="lg"
        gap="space.02"
        px="space.05"
        py="space.05"
        overflowX="auto"
      >
        {message.split(/\r?\n/).map((line, index) => (
          <styled.span key={`${line}_${index}`} textStyle="label.01">
            {line}
          </styled.span>
        ))}
      </Stack>
      {hash ? <HashDrawer hash={hash} /> : null}
    </Stack>
  );
}
