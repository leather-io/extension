import toast from 'react-hot-toast';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { Stack } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';

export function RpcSendTransferSummary() {
  const { state } = useLocation();
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();

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
    feeRowValue,
    totalSpend,
  } = state;

  const { onCopy } = useClipboard(txId);

  function onClickLink() {
    void analytics.track('view_rpc_send_transfer_confirmation', { symbol: 'BTC' });
    handleOpenTxLink(txLink);
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  return (
    <>
      <InfoCard>
        <InfoCardAssetValue
          value={txValue}
          fiatValue={txFiatValue}
          fiatSymbol={txFiatValueSymbol}
          symbol={symbol}
          icon={FiCheck}
          mb="loose"
        />
        <Stack pb="extra-loose" width="100%">
          <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
          <InfoCardSeparator />
          <InfoCardRow title="Total spend" value={totalSpend} />
          <InfoCardRow title="Sending" value={sendingValue} />
          <InfoCardRow title="Fee" value={feeRowValue} />
          {arrivesIn && <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />}
        </Stack>
        <InfoCardFooter>
          <Stack isInline spacing="base" width="100%">
            <InfoCardBtn icon={FiExternalLink} label="View Details" onClick={onClickLink} />
            <InfoCardBtn icon={FiCopy} label="Copy ID" onClick={onClickCopy} />
          </Stack>
        </InfoCardFooter>
      </InfoCard>
    </>
  );
}
