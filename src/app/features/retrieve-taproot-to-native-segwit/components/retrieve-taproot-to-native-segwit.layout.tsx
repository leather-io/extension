import { Flex, styled } from 'leather-styles/jsx';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { WarningLabel } from '@app/components/warning-label';
import { Button } from '@app/ui/components/button/button';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';

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
      <Flex alignItems="start" flexDirection="column" mt="-45px" mx="space.06" textAlign="left">
        <BtcIcon />
        <styled.span mt="space.04" textStyle="label.01">
          Retrieve Bitcoin deposited to <br /> Taproot addresses
        </styled.span>
        <styled.span mt="space.05" textStyle="body.02">
          Taproot addresses are used by Leather for Ordinal inscriptions, but they can also contain
          bitcoin.
        </styled.span>
        <styled.span mt="space.04" textStyle="body.02">
          As we don't support tranferring from Taproot addresses yet, you can retrieve funds to your
          account's main Native SegWit balance here.
        </styled.span>
        <styled.span mt="space.04" textStyle="body.02">
          This transaction may take upwards of 30 minutes to confirm.
        </styled.span>
        {children}
        <WarningLabel mt="space.05">
          We recommend you check the URL for each "Uninscribed UTXO" listed above to ensure it
          displays no inscription. If it does display one, do not proceed with retrieval or you may
          lose it!
        </WarningLabel>
        <Button
          onClick={onApproveTransaction}
          aria-busy={isBroadcasting}
          width="100%"
          my="space.05"
        >
          Retrieve bitcoin
        </Button>
      </Flex>
    </BaseDrawer>
  );
}
