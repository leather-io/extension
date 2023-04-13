import { toast } from 'react-hot-toast';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { Stack, useClipboard } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
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

  useRouteHeader(<ModalHeader hideActions defaultClose title="Sent" />);

  return (
    <InfoCard>
      <InfoCardAssetValue
        value={txValue}
        fiatValue={txFiatValue}
        fiatSymbol={txFiatValueSymbol}
        symbol={symbol}
        icon={FiCheck}
        my="loose"
        px="loose"
      />

      <Stack width="100%" px="extra-loose" pb="extra-loose">
        <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
        <InfoCardSeparator />
        <InfoCardRow title="Total spend" value={totalSpend} />

        <InfoCardRow title="Sending" value={sendingValue} />
        <InfoCardRow title="Fee" value={fee} />
        <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />
      </Stack>

      <InfoCardFooter>
        <Stack spacing="base" isInline width="100%">
          <InfoCardBtn onClick={onClickLink} icon={FiExternalLink} label="View Details" />
          <InfoCardBtn onClick={onClickCopy} icon={FiCopy} label="Copy ID" />
        </Stack>
      </InfoCardFooter>
    </InfoCard>
  );
}
