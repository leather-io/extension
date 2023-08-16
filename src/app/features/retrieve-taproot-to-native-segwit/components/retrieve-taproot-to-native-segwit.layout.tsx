import { Flex } from '@stacks/ui';

import { LeatherButton } from '@app/components/button/button';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { BtcIcon } from '@app/components/icons/btc-icon';
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
          We recommend you check the URL for each "Uninscribed UTXO" listed above to ensure it
          displays no inscription. If it does display one, do not proceed with retrieval or you may
          lose it!
        </WarningLabel>
        <LeatherButton
          onClick={onApproveTransaction}
          aria-busy={isBroadcasting}
          width="100%"
          my="loose"
        >
          Retrieve bitcoin
        </LeatherButton>
      </Flex>
    </BaseDrawer>
  );
}
