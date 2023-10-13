import { Stack, StackProps } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function PsbtRequestDetailsSectionLayout({ children, ...props }: HasChildren & StackProps) {
  return (
    <Stack border="default" borderRadius="16px" gap="space.01" p="space.05" width="100%" {...props}>
      {children}
    </Stack>
  );
}
