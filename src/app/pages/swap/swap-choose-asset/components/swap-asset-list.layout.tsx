import { Stack, StackProps } from '@stacks/ui';

export function SwapAssetListLayout({ children }: StackProps) {
  return (
    <Stack spacing="extra-loose" width="100%">
      {children}
    </Stack>
  );
}
