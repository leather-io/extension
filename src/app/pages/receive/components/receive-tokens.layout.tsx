import { useNavigate } from 'react-router-dom';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { AddressDisplayer } from '@app/components/address-displayer/address-displayer';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { LeatherButton } from '@app/ui/components/button';

import { QrCode } from './address-qr-code';

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
    <BaseDrawer title="Receive" isShowing onClose={() => navigate(backgroundLocation ?? '..')}>
      {warning && warning}
      <Flex alignItems="center" flexDirection="column" pb={['space.05', 'space.08']} px="space.05">
        <styled.h2 mt="space.05" textStyle="heading.03">
          {title}
        </styled.h2>
        <Box mt="space.06" mx="auto">
          <QrCode principal={address} />
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
            lineHeight={1.8}
            maxWidth="280px"
            mt="space.04"
          >
            <AddressDisplayer address={address} />
          </Flex>
        </Flex>
        <LeatherButton fullWidth mt="space.05" onClick={() => onCopyAddressToClipboard(address)}>
          Copy address
        </LeatherButton>
      </Flex>
    </BaseDrawer>
  );
}
