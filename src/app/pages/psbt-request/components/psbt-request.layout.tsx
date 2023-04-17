import { Stack } from '@stacks/ui';

interface PsbtRequestLayoutProps {
  children: React.ReactNode;
}
export function PsbtRequestLayout({ children }: PsbtRequestLayoutProps) {
  return (
    <Stack
      alignItems="center"
      maxHeight="calc(100vh - 72px)"
      overflowY="scroll"
      pb="120px"
      px="loose"
      spacing="base-loose"
      width="100%"
    >
      {children}
    </Stack>
  );
}
