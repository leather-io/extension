import { Stack } from 'leather-styles/jsx';

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
      px="space.05"
      gap="space.02"
      width="100%"
    >
      {children}
    </Stack>
  );
}
