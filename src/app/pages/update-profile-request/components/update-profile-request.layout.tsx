import { Stack } from '@stacks/ui';
import { PageTop } from './page-top';

interface UpdateProfileRequestLayoutProps {
  children: React.ReactNode;
}
export function UpdateProfileRequestLayout({ children }: UpdateProfileRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} spacing="loose" width="100%">
      <PageTop />
      {children}
    </Stack>
  );
}
