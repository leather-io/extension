import { Stack } from '@stacks/ui';

import { PageTop } from './page-top';

interface MessageSigningRequestLayoutProps {
  children: React.ReactNode;
}
export function MessageSigningRequestLayout({ children }: MessageSigningRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} spacing="loose" width="100%">
      <PageTop />
      {children}
    </Stack>
  );
}
