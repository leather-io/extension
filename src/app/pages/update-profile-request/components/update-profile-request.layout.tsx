import { Stack } from '@stacks/ui';

import { PageTop } from './page-top';

interface ProfileUpdateRequestLayoutProps {
  children: React.ReactNode;
}
export function ProfileUpdateRequestLayout({ children }: ProfileUpdateRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} spacing="loose" width="100%">
      <PageTop />
      {children}
    </Stack>
  );
}
