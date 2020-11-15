import React from 'react';
import { Box, Text, Button, ArrowIcon, BoxProps, Spinner } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { getIdentityDisplayName } from '@common/stacks-utils';
import { AccountInfo } from '@components/popup/account-info';

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

export const PopupHome: React.FC = () => {
  const { currentIdentity } = useWallet();
  const { doChangeScreen } = useAnalytics();
  return (
    <PopupContainer>
      <Box width="100%" mt="loose">
        <Text fontSize="24px" fontWeight="600" lineHeight="40px">
          {getIdentityDisplayName(currentIdentity, true)}
        </Text>
      </Box>
      <Box width="100%" mt="loose">
        <Box>
          <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_SEND)} variant="send" />
          <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_RECEIVE)} variant="receive" />
        </Box>
      </Box>
      <React.Suspense fallback={<Spinner />}>
        <AccountInfo />
      </React.Suspense>
    </PopupContainer>
  );
};
