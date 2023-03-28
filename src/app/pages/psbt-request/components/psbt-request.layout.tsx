import { Stack } from '@stacks/ui';

interface PsbtRequestLayoutProps {
  children: React.ReactNode;
}
export function PsbtRequestLayout({ children }: PsbtRequestLayoutProps) {
  return (
    <Stack pb="loose" px={['loose', 'unset']} spacing="base-loose" width="100%">
      {children}
    </Stack>
  );
}
