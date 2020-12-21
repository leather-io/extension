import React from 'react';
import { Box, Text, Button, ArrowIcon, BoxProps, Flex } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { getIdentityDisplayName } from '@common/stacks-utils';
import { AccountInfo } from '@components/popup/account-info';
import { LoadingRectangle } from '@components/loading-rectangle';

interface TxButtonProps extends BoxProps {
  variant: 'send' | 'receive';
}

const TxButton: React.FC<TxButtonProps> = ({ variant, onClick }) => {
  return (
    <Button
      onClick={onClick}
      mode="primary"
      mr="base-tight"
      color="blue"
      customStyles={{
        primary: {
          backgroundColor: '#F2F2FF',
        },
        secondary: {},
        tertiary: {},
      }}
    >
      <ArrowIcon
        direction={variant === 'send' ? ('up' as any) : ('down' as any)}
        mr="base-tight"
        height="12px"
      />
      {variant === 'send' ? 'Send' : 'Receive'}
    </Button>
  );
};

const HomeLoading: React.FC = () => {
  return (
    <Flex flexDirection="column" mt="extra-loose">
      <Box width="100%">
        <LoadingRectangle width="60%" height="80px" />
      </Box>
      <Box width="100%" mt="loose" mb="extra-loose">
        <LoadingRectangle width="100%" height="120px" />
      </Box>
    </Flex>
  );
};

export const PopupHome: React.FC = () => {
  const { currentIdentity, currentIdentityIndex } = useWallet();
  const { doChangeScreen } = useAnalytics();
  console.log(useWallet());

  if (!currentIdentity || currentIdentityIndex === undefined) {
    return null;
  }
  return (
    <PopupContainer>
      <Box width="100%" mt="loose">
        <Text
          fontSize="24px"
          fontWeight="600"
          lineHeight="40px"
          fontFamily="heading"
          color="ink.1000"
          display="block"
        >
          {getIdentityDisplayName(currentIdentity, currentIdentityIndex)}
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {currentIdentity.getStxAddress()}
        </Text>
      </Box>
      <Box width="100%" mt="loose">
        <Box>
          <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_SEND)} variant="send" />
          <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_RECEIVE)} variant="receive" />
        </Box>
      </Box>
      <React.Suspense fallback={<HomeLoading />}>
        <AccountInfo />
      </React.Suspense>
    </PopupContainer>
  );
};
