import React from 'react';
import { Box, Flex } from '@blockstack/ui';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

interface IOnboardingHeader {
  appIcon?: string;
  appName?: string;
  title: string;
  close: () => void;
  hideIcon?: boolean;
}

const OnboardingHeader = ({
  appIcon,
  close,
  title,
  hideIcon,
  appName,
  ...rest
}: IModalHeader) => {
  return (
    <Flex
      p={[4, 5]}
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      align="center"
      justify="space-between"
      {...rest}
    >
      <Flex align="center">
        {appIcon ? <AppIcon src={appIcon} name={appName || 'loading'} /> : null}
        {appIcon ? (
          <Box pr={1} pl={2} color="ink.300">
            <ChevronRightIcon size={20} />
          </Box>
        ) : null}
        <HeaderTitle hideIcon={hideIcon} title={title} />
      </Flex>
      <HeaderCloseButton onClick={close} />
    </Flex>
  );
};
