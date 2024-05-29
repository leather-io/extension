import { useLocation } from 'react-router-dom';

import { Card, CardContent, CopyIcon, ExternalLinkIcon, Footer } from '@leather-wallet/ui';
import { HStack, Stack } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useStacksExplorerLink } from '@app/common/hooks/use-stacks-explorer-link';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { useToast } from '@app/features/toasts/use-toast';

import { TxDone } from '../send-crypto-asset-form/components/tx-done';

export function StxSentSummary() {
  const { state } = useLocation();
  const analytics = useAnalytics();
  const toast = useToast();

  const {
    txValue,
    txFiatValue,
    txFiatValueSymbol,
    symbol,
    txLink,
    arrivesIn,
    fee,
    recipient,
    txId,
    totalSpend,
    sendingValue,
  } = state;

  const { onCopy } = useClipboard(txId || '');
  const { handleOpenStacksTxLink } = useStacksExplorerLink();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'STX' });
    handleOpenStacksTxLink(txLink);
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  return (
    <Card
      footer={
        <Footer variant="card">
          <HStack gap="space.04" width="100%">
            <InfoCardBtn icon={<ExternalLinkIcon />} label="View details" onClick={onClickLink} />
            <InfoCardBtn icon={<CopyIcon />} label="Copy ID" onClick={onClickCopy} />
          </HStack>
        </Footer>
      }
    >
      <CardContent p="space.00">
        <TxDone />

        <InfoCardAssetValue
          fiatSymbol={txFiatValueSymbol}
          fiatValue={txFiatValue}
          px="space.05"
          symbol={symbol}
          value={txValue}
        />

        <Stack pb="space.06" px="space.06" width="100%">
          <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
          <InfoCardSeparator />
          <InfoCardRow title="Total spend" value={totalSpend} />

          <InfoCardRow title="Sending" value={sendingValue} />
          <InfoCardRow title="Fee" value={fee} />
          <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />
        </Stack>
      </CardContent>
    </Card>
  );
}
