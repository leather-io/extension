import { Stack } from '@stacks/ui';

import { PageTop } from './page-top';

interface PsbtRequestLayoutProps {
  children: React.ReactNode;
}
export function PsbtRequestLayout({ children }: PsbtRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} spacing="base-loose" width="100%">
      <PageTop />
      {children}
    </Stack>
  );
}
