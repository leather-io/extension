import React, { Suspense } from 'react';
import { Box, color, Stack } from '@stacks/ui';

import { LoadingRectangle } from '@components/loading-rectangle';
import { CurrentUserAvatar } from '@features/current-user/current-user-avatar';
import { CurrentUsername } from '@features/current-user/current-user-name';
import { CurrentStxAddress } from '@features/current-user/current-stx-address';

import { Balance } from './balance';

function PopupHeaderSuspense(): JSX.Element {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <CurrentUserAvatar size="24px" fontSize="10px" />
          <CurrentUsername as="h3" />
          <CurrentStxAddress />
        </Stack>
        <Balance />
      </Stack>
    </Box>
  );
}

function PopupHeaderFallback(): JSX.Element {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <CurrentUserAvatar size="24px" fontSize="10px" />
          <CurrentUsername as="h3" />
          <CurrentStxAddress />
        </Stack>
        <LoadingRectangle width="72px" height="14px" />
      </Stack>
    </Box>
  );
}

export function PopupHeader(): JSX.Element {
  return (
    <Suspense fallback={<PopupHeaderFallback />}>
      <PopupHeaderSuspense />
    </Suspense>
  );
}
