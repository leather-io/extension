import { Stack } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function SwapDetailsLayout({ children }: HasChildren) {
  return (
    <Stack alignItems="center" gap="space.03" px="space.04" width="100%">
      {children}
    </Stack>
  );
}
