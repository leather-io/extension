import { Box } from '@stacks/ui';

import { figmaTheme } from '@app/common/utils/figma-theme';

interface AddressDisplayerLayoutProps {
  isEven: boolean;
  children: React.ReactNode;
}
export function AddressDisplayerLayout({ isEven, ...props }: AddressDisplayerLayoutProps) {
  return (
    <Box
      as="span"
      color={isEven ? figmaTheme.textSubdued : figmaTheme.text}
      fontFamily="Fira Code"
      mr="tight"
      {...props}
    />
  );
}
