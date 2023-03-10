import { Flex } from '@stacks/ui';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { PrimaryButton } from '@app/components/primary-button';
import { Body, Title } from '@app/components/typography';
import { WarningLabel } from '@app/components/warning-label';

interface RetrieveTaprootToNativeSegwitLayoutProps {
  isBroadcasting: boolean;
  children: React.ReactNode;
  onClose(): void;
  onApproveTransaction(): void;
}

export function RetrieveTaprootToNativeSegwitLayout(
  props: RetrieveTaprootToNativeSegwitLayoutProps
) {
  const { onClose, onApproveTransaction, isBroadcasting, children } = props;
  return (
    <BaseDrawer isShowing onClose={() => onClose()}>
      <Flex flexDirection="column" alignItems="start" textAlign="left" mx="extra-loose" mt="-45px">
        <BtcIcon />
        <Title fontSize="20px" lineHeight="1.6" mt="base">
          Retrieve Bitcoin deposited to <br /> Taproot addresses
        </Title>
        <Body mt="loose">
          Taproot addresses are used by Hiro Wallet for Ordinal inscriptions, but they can also
          contain bitcoin.
        </Body>
        <Body mt="base">
          As we don't support tranferring from Taproot addresses yet, you can retrieve funds to your
          account's main Native SegWit balance here.
        </Body>
        <Body mt="base">This transaction may take upwards of 30 minutes to confirm.</Body>
        {children}
        <WarningLabel mt="loose">
          We recommend you check the UTXOs to ensure they contain no inscriptions
        </WarningLabel>
        <PrimaryButton
          onClick={onApproveTransaction}
          isLoading={isBroadcasting}
          width="100%"
          my="loose"
        >
          Retreive bitcoin
        </PrimaryButton>
      </Flex>
    </BaseDrawer>
  );
}
