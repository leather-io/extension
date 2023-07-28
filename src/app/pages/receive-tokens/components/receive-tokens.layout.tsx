import { FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Text, color } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { useBackgroundLocationRedirect } from '@app/common/hooks/use-background-location-redirect';
import { useLocationState } from '@app/common/hooks/use-location-state';
import { AddressDisplayer } from '@app/components/address-displayer/address-displayer';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { Title } from '@app/components/typography';

import { QrCode } from './address-qr-code';

interface ReceiveTokensLayoutProps {
  address: string;
  accountName?: string;
  onCopyAddressToClipboard(address: string): void;
  title: string;
  warning?: React.JSX.Element;
  hasSubtitle?: boolean;
}
export function ReceiveTokensLayout(props: ReceiveTokensLayoutProps) {
  useBackgroundLocationRedirect();
  const { address, accountName, onCopyAddressToClipboard, title, warning, hasSubtitle } = props;
  const navigate = useNavigate();
  const backgroundLocation = useLocationState('backgroundLocation');

  return (
    <BaseDrawer title={title} isShowing onClose={() => navigate(backgroundLocation?.pathname)}>
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
        {hasSubtitle && (
          <Text color={color('text-caption')} mb="tight" textAlign="left">
            Share your account's unique address to receive tokens or collectibles. Including a memo
            is not required.
          </Text>
        )}
        {warning && warning}
        <Box mt="extra-loose" mx="auto">
          <QrCode principal={address} />
        </Box>
        <Flex alignItems="center" flexDirection="column">
          {accountName && (
            <Title fontSize={3} lineHeight="1rem" mt="loose">
              {accountName}
            </Title>
          )}
          <Flex
            data-testid={SharedComponentsSelectors.AddressDisplayer}
            flexWrap="wrap"
            justifyContent="center"
            lineHeight={1.8}
            maxWidth="280px"
            mt="base"
          >
            <AddressDisplayer address={address} />
          </Flex>
          <Button
            borderRadius="10px"
            height="40px"
            mode="tertiary"
            onClick={() => onCopyAddressToClipboard(address)}
            mt="base"
          >
            <FiCopy />
            <Text ml="tight">Copy address</Text>
          </Button>
        </Flex>
      </Flex>
    </BaseDrawer>
  );
}
