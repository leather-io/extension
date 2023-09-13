import { Stack, StackProps } from 'leather-styles/jsx';

export function SwapAssetListLayout({ children }: StackProps) {
  return (
    <Stack gap="space.06" p="space.06" width="100%">
      {children}
    </Stack>
  );
}
