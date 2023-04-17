import { Stack } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function BitcoinFeesListLayout({ children }: HasChildren) {
  return (
    <Stack alignItems="center" p="extra-loose" spacing="extra-loose" width="100%">
      {children}
    </Stack>
  );
}
