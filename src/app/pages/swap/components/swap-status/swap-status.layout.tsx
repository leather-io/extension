import { Stack } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function SwapStatusLayout({ children }: HasChildren) {
  return <Stack my="base">{children}</Stack>;
}
