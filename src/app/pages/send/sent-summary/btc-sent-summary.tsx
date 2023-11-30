import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { HStack, Stack } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { ModalHeader } from '@app/components/modal-header';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { ExternalLinkIcon } from '@app/ui/components/icons/external-link-icon';

import { TxDone } from '../send-crypto-asset-form/components/tx-done';

export function BtcSentSummary() {
  const { state } = useLocation();

  const {
    txId,
    txValue,
    txFiatValue,
    txFiatValueSymbol,
    symbol,
    txLink,
    arrivesIn,
    sendingValue,
    recipient,
    totalSpend,
    feeRowValue,
  } = state;

  const { onCopy } = useClipboard(txId);
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();
  const analytics = useAnalytics();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'BTC' });
    handleOpenTxLink({ txid: txLink.txid });
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  useRouteHeader(<ModalHeader hideActions defaultClose title="Sent" />);

  return (
    <InfoCard>
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
        <InfoCardRow title="Fee" value={feeRowValue} />
        {arrivesIn && <InfoCardRow title="Arrives in" value={arrivesIn} />}
      </Stack>

      <InfoCardFooter>
        <HStack gap="space.04" width="100%">
          <InfoCardBtn
            icon={<ExternalLinkIcon size="14px" />}
            label="View details"
            onClick={onClickLink}
          />
          <InfoCardBtn icon={<CopyIcon size="14px" />} label="Copy ID" onClick={onClickCopy} />
        </HStack>
      </InfoCardFooter>
    </InfoCard>
  );
}
