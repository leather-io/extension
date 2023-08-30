import { Stack, StackProps } from '@stacks/ui';

export function SwapAssetListLayout({ children }: StackProps) {
  return (
    <Stack p="extra-loose" spacing="extra-loose" width="100%">
      {children}
    </Stack>
  );
}
