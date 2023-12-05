import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { HStack, Stack } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useStacksExplorerLink } from '@app/common/hooks/use-stacks-explorer-link';
import { whenPageMode } from '@app/common/utils';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { CopyIcon } from '@app/ui/icons/copy-icon';
import { ExternalLinkIcon } from '@app/ui/icons/external-link-icon';

import { TxDone } from '../send-crypto-asset-form/components/tx-done';

export function StxSentSummary() {
  const { state } = useLocation();

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
  const { handleOpenStacksTxLink: handleOpenTxLink } = useStacksExplorerLink();
  const analytics = useAnalytics();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'STX' });
    handleOpenTxLink(txLink);
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  return (
    <InfoCard
      pb={whenPageMode({
        full: '0px',
        popup: '120px',
      })}
    >
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

      <InfoCardFooter>
        <HStack gap="space.04" width="100%">
          <InfoCardBtn icon={<ExternalLinkIcon />} label="View details" onClick={onClickLink} />
          <InfoCardBtn icon={<CopyIcon />} label="Copy ID" onClick={onClickCopy} />
        </HStack>
      </InfoCardFooter>
    </InfoCard>
  );
}
