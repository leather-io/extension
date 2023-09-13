import { Box, Stack, styled } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function SwapDetailsLayout({ children }: HasChildren) {
  return (
    <Stack gap="space.04" mt="space.04" width="100%">
      <styled.span alignSelf="flex-start" pt="space.02" textStyle="label.01">
        Swap details
      </styled.span>
      <Box pb="space.06" pr="space.05" width="100%">
        <Stack borderColor="accent.border-default !important" borderLeft="1px solid" gap="space.03">
          {children}
        </Stack>
      </Box>
    </Stack>
  );
}
