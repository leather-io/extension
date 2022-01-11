import { Box, Stack } from '@stacks/ui';

import { Caption } from '@components/typography';
import { NoActivityIllustration } from '@components/vector/no-activity';

export function NoAccountActivity() {
  return (
    <Stack py="extra-loose" spacing="extra-loose" justifyContent="center" alignItems="center">
      <Box mx="auto">
        <NoActivityIllustration />
      </Box>

      <Caption maxWidth="23ch" textAlign="center">
        No activity yet.
      </Caption>
    </Stack>
  );
}
