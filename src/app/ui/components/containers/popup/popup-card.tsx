import { Stack } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function PopupCard({ children }: HasChildren) {
  return (
    <Stack
      alignItems="center"
      // #4140 = maxHeight needs to consider header
      // FIXME - get this to calc using footerHeight + headerHeight?
      // maxHeight="calc(100vh - (headerHeight + footerHeight ))"
      maxHeight="calc(100vh - 167px)"
      overflowY="auto"
      px="space.05"
      gap="space.02"
      width="100%"
    >
      {children}
    </Stack>
  );
}
