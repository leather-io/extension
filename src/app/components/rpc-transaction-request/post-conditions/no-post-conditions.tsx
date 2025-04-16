import { Box, styled } from 'leather-styles/jsx';

import { Avatar, Flag, LockIcon } from '@leather.io/ui';

export function NoPostConditions() {
  return (
    <Flag img={<Avatar icon={<LockIcon />} />}>
      <Box flexGrow={1}>
        <styled.span textStyle="body.02">
          Only fees will be transferred from your account or the transaction will abort.
        </styled.span>
      </Box>
    </Flag>
  );
}
