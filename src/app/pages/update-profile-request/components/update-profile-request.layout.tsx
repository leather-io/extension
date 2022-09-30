import { Stack } from '@stacks/ui';
import { PageTop } from './page-top';

interface ProfileUpdaterRequestLayoutProps {
  children: React.ReactNode;
}
export function ProfileUpdaterRequestLayout({ children }: ProfileUpdaterRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} spacing="loose" width="100%">
      <PageTop />
      {children}
    </Stack>
  );
}
