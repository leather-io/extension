import { useNavigate } from 'react-router-dom';
import { Box, useClipboard, Stack, color, Button } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { PrimaryButton } from '@app/components/primary-button';
import { Header } from '@app/components/header';
import { Caption, Text, Title } from '@app/components/typography';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { RouteUrls } from '@shared/route-urls';
import { getAccountDisplayName } from '@app/common/utils/get-account-display-name';

import { QrCode } from './components/address-qr-code';

export const ReceiveTokens = () => {
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const navigate = useNavigate();
  const address = currentAccountStxAddress || '';
  const analytics = useAnalytics();
  const { onCopy, hasCopied } = useClipboard(address);

  useRouteHeader(<Header title="Receive" onClose={() => navigate(RouteUrls.Home)} />);

  const copyToClipboard = () => {
    void analytics.track('copy_address_to_clipboard');
    onCopy();
  };

  return (
    <CenteredPageContainer>
      <Stack
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        px={['loose', 'base-loose']}
        spacing="loose"
        textAlign="center"
      >
        <Text textAlign={['left', 'center']}>
          Share your unique address to receive any token or collectible. Including a memo is not
          required.
        </Text>
        <Box mx="auto">
          <QrCode principal={address} />
        </Box>
        {currentAccount && (
          <Title fontSize={3} lineHeight="1rem">
            {getAccountDisplayName(currentAccount)}
          </Title>
        )}
        <Caption userSelect="none">{truncateMiddle(address, 4)}</Caption>
        {!hasCopied ? (
          <PrimaryButton onClick={copyToClipboard}>Copy your address</PrimaryButton>
        ) : (
          <Button
            _hover={{
              boxShadow: 'none',
            }}
            border="1px solid"
            borderColor={color('border')}
            borderRadius="10px"
            boxShadow="none"
            color={color('accent')}
            height="48px"
            mode="tertiary"
          >
            Copied to clipboard!
          </Button>
        )}
      </Stack>
    </CenteredPageContainer>
  );
};
