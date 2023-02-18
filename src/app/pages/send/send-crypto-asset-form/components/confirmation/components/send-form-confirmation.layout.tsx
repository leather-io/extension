import { Box, StackProps } from '@stacks/ui';

export function SendFormConfirmationLayout({ children }: StackProps) {
  return (
    <Box mt={['36px', '36px', '48px']} pb="extra-loose" px="loose" width="100%">
      {children}
    </Box>
  );
}
