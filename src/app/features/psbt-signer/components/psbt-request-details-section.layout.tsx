import { Stack, StackProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { HasChildren } from '@app/common/has-children';

export function PsbtRequestDetailsSectionLayout({ children, ...props }: HasChildren & StackProps) {
  return (
    <Stack
      border="4px solid"
      borderColor={token('colors.accent.background-primary')}
      borderRadius="16px"
      p="space.05"
      gap="space.01"
      width="100%"
      {...props}
    >
      {children}
    </Stack>
  );
}
