import { ReactNode } from 'react';

import { Stack } from 'leather-styles/jsx';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';

interface VirtuosoWrapperSheetProps {
  children: ReactNode;
}

export function VirtuosoWrapperSheet({ children }: VirtuosoWrapperSheetProps) {
  const isAtLeastMd = useViewportMinWidth('md');
  const height = isAtLeastMd ? '70vh' : '100vh';

  return (
    <Stack gap="0" height={height}>
      {children}
    </Stack>
  );
}
