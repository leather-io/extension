import { Stack } from '@stacks/ui';

interface BitcoinContractRequestLayoutProps {
  children: React.ReactNode;
}
export function BitcoinContractRequestLayout({ children }: BitcoinContractRequestLayoutProps) {
  return (
    <Stack
      alignItems="center"
      maxHeight="calc(100vh - 72px)"
      overflowY="scroll"
      pb="120px"
      px="loose"
      spacing="tight"
      width="100%"
    >
      {children}
    </Stack>
  );
}
