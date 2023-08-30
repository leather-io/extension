import { Stack } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';
import { Flag } from '@app/components/layout/flag';

export function SwapAssetItemLayout({ children, icon }: HasChildren & { icon: React.JSX.Element }) {
  return (
    <Flag align="middle" img={icon} spacing="base">
      <Stack spacing="none">{children}</Stack>
    </Flag>
  );
}
