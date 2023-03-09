import { Stack } from '@stacks/ui';

import { PsbtRequestHeader } from './psbt-request-header';

interface PsbtRequestLayoutProps {
  children: React.ReactNode;
}
export function PsbtRequestLayout({ children }: PsbtRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} spacing="base-loose" width="100%">
      <PsbtRequestHeader />
      {children}
    </Stack>
  );
}
