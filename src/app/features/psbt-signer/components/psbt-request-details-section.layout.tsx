import { Stack, StackProps, color } from '@stacks/ui';

import { HasChildren } from '@app/common/has-children';

export function PsbtRequestDetailsSectionLayout({ children, ...props }: HasChildren & StackProps) {
  return (
    <Stack
      border="4px solid"
      borderColor={color('border')}
      borderRadius="16px"
      p="loose"
      spacing="extra-tight"
      width="100%"
      {...props}
    >
      {children}
    </Stack>
  );
}
