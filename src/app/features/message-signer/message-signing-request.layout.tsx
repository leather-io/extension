import { Stack } from '@stacks/ui';

interface MessageSigningRequestLayoutProps {
  children: React.ReactNode;
}
export function MessageSigningRequestLayout({ children }: MessageSigningRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} spacing="loose" width="100%">
      {children}
    </Stack>
  );
}
