import { Stack } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function PsbtSignerLayout({ children }: HasChildren) {
  return (
    <Stack
      alignItems="center"
      maxHeight="calc(100vh - 72px)"
      overflowY="auto"
      pb="120px"
      px="loose"
      gap="base-loose"
      width="100%"
    >
      {children}
    </Stack>
  );
}
