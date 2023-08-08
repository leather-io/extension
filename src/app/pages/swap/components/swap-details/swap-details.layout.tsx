import { Box, Stack } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function SwapDetailsLayout({ children }: HasChildren) {
  return (
    <Box pb="extra-loose" pr="loose" width="100%">
      <Stack borderLeft="1px solid #DCDDE2" spacing="base-tight">
        {children}
      </Stack>
    </Box>
  );
}
