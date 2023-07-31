import { Stack } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function PsbtSignerLayout({ children }: HasChildren) {
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
