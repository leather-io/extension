import { Stack, color } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function SwapAssetsPairLayout({ children }: HasChildren) {
  return (
    <Stack
      border="4px solid"
      borderColor={color('border')}
      borderRadius="16px"
      mb="loose"
      mt="base"
      p="loose"
      spacing="extra-tight"
      width="100%"
    >
      {children}
    </Stack>
  );
}
