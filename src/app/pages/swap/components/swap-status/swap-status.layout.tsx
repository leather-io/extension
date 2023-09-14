import { Stack } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function SwapStatusLayout({ children }: HasChildren) {
  return <Stack my="space.04">{children}</Stack>;
}
