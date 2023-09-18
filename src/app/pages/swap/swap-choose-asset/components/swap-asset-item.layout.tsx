import { Stack } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';
import { Flag } from '@app/components/layout/flag';

export function SwapAssetItemLayout({
  children,
  icon,
  ...rest
}: HasChildren & { icon: React.JSX.Element }) {
  return (
    <Flag align="middle" img={icon} {...rest}>
      <Stack gap="none">{children}</Stack>
    </Flag>
  );
}
