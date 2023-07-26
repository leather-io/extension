import { Stack } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function PsbtRequestDetailsLayout({ children }: HasChildren) {
  return (
    <Stack spacing="loose" width="100%">
      {children}
    </Stack>
  );
}
