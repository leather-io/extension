import { Flex, styled } from 'leather-styles/jsx';

import { BtcAvatarIcon, Button, Callout, Dialog } from '@leather.io/ui';

import { Footer } from '@app/components/layout';
import { Card } from '@app/components/layout';
import { DialogHeader } from '@app/components/layout/dialog-header';

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
    <Dialog
      isShowing
      header={<DialogHeader />}
      onClose={() => onClose()}
      footer={
        <Footer flexDirection="row">
          <Button onClick={onApproveTransaction} aria-busy={isBroadcasting} width="100%">
            Retrieve bitcoin
          </Button>
        </Footer>
      }
    >
      <Card>
        <Flex
          alignItems="start"
          flexDirection="column"
          mx="space.06"
          mt="space.05"
          textAlign="left"
        >
          <BtcAvatarIcon />
          <styled.span mt="space.04" textStyle="label.01">
            Retrieve Bitcoin deposited to <br /> Taproot addresses
          </styled.span>
          <styled.span mt="space.05" textStyle="body.02">
            Taproot addresses are used by Leather for Ordinal inscriptions, but they can also
            contain bitcoin.
          </styled.span>
          <styled.span mt="space.04" textStyle="body.02">
            As we don't support tranferring from Taproot addresses yet, you can retrieve funds to
            your account's main Native SegWit balance here.
          </styled.span>
          <styled.span my="space.04" textStyle="body.02">
            This transaction may take upwards of 30 minutes to confirm.
          </styled.span>
          {children}
          <Callout variant="warning" mt="space.05" mb="space.05">
            We recommend you check the URL for each "Uninscribed UTXO" listed above to ensure it
            displays no inscription. If it does display one, do not proceed with retrieval or you
            may lose it!
          </Callout>
        </Flex>
      </Card>
    </Dialog>
  );
}
