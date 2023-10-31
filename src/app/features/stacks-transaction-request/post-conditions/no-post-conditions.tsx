import { FiLock } from 'react-icons/fi';

import { Box, Circle, Stack } from '@stacks/ui';
import { color } from '@stacks/ui-utils';
import { styled } from 'leather-styles/jsx';

export function NoPostConditions(): React.JSX.Element {
  return (
    <Stack alignItems="center" spacing="base" p="base-loose" isInline>
      <Circle bg={color('bg-4')} flexShrink={0}>
        <FiLock />
      </Circle>
      <Box flexGrow={1}>
        <styled.span textStyle="body.02">
          No transfers (besides fees) will be made from your account or the transaction will abort.
        </styled.span>
      </Box>
    </Stack>
  );
}
