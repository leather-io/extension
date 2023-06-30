import { Stack } from '@stacks/ui';

interface PsbtSignerLayoutProps {
  children: React.ReactNode;
}
export function PsbtSignerLayout({ children }: PsbtSignerLayoutProps) {
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
