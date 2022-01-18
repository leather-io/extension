import React, { memo } from 'react';
import { Box, Button } from '@stacks/ui';

import { PopupContainer } from '@components/popup/container';
import { Text } from '@components/typography';

import { RouteUrls } from '@routes/route-urls';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { Header } from '@components/header';

export const SignedOut = memo(() => {
  const changeScreen = useChangeScreen();
  return (
    <PopupContainer header={<Header hideActions />}>
      <Box width="100%" mt="extra-loose" textAlign="center">
        <Text textStyle="display.large" display="block">
          You're logged out!
        </Text>
        <Button
          my="extra-loose"
          onClick={() => {
            changeScreen(RouteUrls.Installed);
          }}
        >
          Get started
        </Button>
      </Box>
    </PopupContainer>
  );
});
