import { toast } from 'react-hot-toast';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { Stack, useClipboard } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';

export function StxSentSummary() {
  const { state } = useLocation();

  const {
    txValue,
    txFiatValue,
    symbol,
    txLink,
    arrivesIn,
    fee,
    recipient,
    txId,
    totalBalance,
    sendingValue,
  } = state;

  const { onCopy } = useClipboard(txId || '');
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();

  const onClickLink = () => {
    void analytics.track('view_transaction_confirmation', { symbol: 'STX' });
    handleOpenTxLink(txLink);
  };
  const onClickCopy = () => {
    onCopy();
    toast.success('ID copied!');
  };

  return (
    <InfoCard>
      <InfoCardAssetValue
        value={txValue}
        fiatValue={txFiatValue}
        symbol={symbol}
        icon={FiCheck}
      ></InfoCardAssetValue>

      <Stack width="100%" mb="44px">
        <InfoCardRow title="To" value={recipient} isAddressDisplayer />
        <InfoCardSeparator />
        <InfoCardRow title="Total spend" value={totalBalance} />

        <InfoCardRow title="Sending" value={sendingValue} />
        <InfoCardRow title="Fee" value={fee} />
        <InfoCardRow title="Arrives in" value={arrivesIn} />
      </Stack>

      <Stack spacing="base" isInline width="100%">
        <InfoCardBtn onClick={onClickLink} icon={FiExternalLink} label="View Details" />
        <InfoCardBtn onClick={onClickCopy} icon={FiCopy} label="Copy ID" />
      </Stack>
    </InfoCard>
  );
}
