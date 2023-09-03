import { Stack } from 'leather-styles/jsx';

interface MessageSigningRequestLayoutProps {
  children: React.ReactNode;
}
export function MessageSigningRequestLayout({ children }: MessageSigningRequestLayoutProps) {
  return (
    <Stack px={['space.05', 'space.05', 'unset']} gap="space.05" width="100%">
      {children}
    </Stack>
  );
}
