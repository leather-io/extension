import { Stack } from '@stacks/ui';
import { PageTop } from './page-top';

interface SignatureRequestLayoutProps {
  children: React.ReactNode;
}
export function SignatureRequestLayout({ children }: SignatureRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} spacing="loose" width="100%">
      <PageTop />
      {children}
    </Stack>
  );
}
