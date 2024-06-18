import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { AddressDisplayer, Button } from '@leather-wallet/ui';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Header } from '@app/ui/components/containers/headers/header';

interface ReceiveTokensLayoutProps {
  address: string;
  accountName?: string;
  onCopyAddressToClipboard(address: string): void;
  title: string;
  warning?: React.JSX.Element;
}
export function ReceiveTokensLayout(props: ReceiveTokensLayoutProps) {
  useBackgroundLocationRedirect();

  const { address, accountName, onCopyAddressToClipboard, title, warning } = props;
  const navigate = useNavigate();
  const backgroundLocation = useLocationState<Location>('backgroundLocation');

  return (
    <Dialog
      header={
        <Header
          variant="bigTitle"
          title={
            <>
              Receive <br /> {title}
            </>
          }
          onGoBack={() => navigate(backgroundLocation ?? '..')}
        />
      }
      isShowing
      onClose={() => navigate(backgroundLocation ?? '..')}
      footer={
        <Footer>
          <Button fullWidth onClick={() => onCopyAddressToClipboard(address)}>
            Copy address
          </Button>
        </Footer>
      }
    >
      {warning && warning}
      <Flex
        alignItems="center"
        flexDirection="column"
        pb={['space.05', 'space.08']}
        px="space.05"
        style={{ marginBottom: token('sizes.footerHeight') }}
      >
        <Box mt="space.06" mx="auto">
          <Flex alignItems="center" justifyContent="center" mx="auto" position="relative">
            <QRCode
              bgColor={token('colors.ink.background-primary')}
              fgColor={token('colors.ink.text-primary')}
              size={132}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={address}
              viewBox={`0 0 132 132`}
            />
          </Flex>
        </Box>
        <Flex alignItems="center" flexDirection="column">
          {accountName && (
            <styled.span mt="space.05" textStyle="label.01">
              {accountName}
            </styled.span>
          )}
          <Flex
            data-testid={SharedComponentsSelectors.AddressDisplayer}
            flexWrap="wrap"
            justifyContent="center"
            maxWidth="300px"
            mt="space.04"
          >
            <AddressDisplayer address={address} />
          </Flex>
        </Flex>
      </Flex>
    </Dialog>
  );
}
