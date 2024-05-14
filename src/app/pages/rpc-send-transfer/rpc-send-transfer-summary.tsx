import { useLocation } from 'react-router-dom';

import { HStack, Stack } from 'leather-styles/jsx';

import type { TransferRecipient } from '@shared/models/form.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { useToast } from '@app/features/toasts/use-toast';
import { CheckmarkIcon } from '@app/ui/icons/checkmark-icon';
import { CopyIcon } from '@app/ui/icons/copy-icon';
import { ExternalLinkIcon } from '@app/ui/icons/external-link-icon';
import { Card } from '@app/ui/layout/card/card';

export function RpcSendTransferSummary() {
  const { state } = useLocation();
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();
  const analytics = useAnalytics();
  const toast = useToast();

  const {
    txId,
    txValue,
    txFiatValue,
    txFiatValueSymbol,
    symbol,
    txLink,
    arrivesIn,
    sendingValue,
    recipients,
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
      <Card>
        <InfoCardAssetValue
          fiatSymbol={txFiatValueSymbol}
          fiatValue={txFiatValue}
          icon={<CheckmarkIcon width="lg" />}
          mb="space.05"
          symbol={symbol}
          value={txValue}
        />
        <Stack pb="space.06" width="100%">
          <Stack>
            {recipients.map((recipient: TransferRecipient, index: number) => (
              <InfoCardRow
                key={index}
                title="To"
                value={<FormAddressDisplayer address={recipient.address} />}
              />
            ))}
          </Stack>
          <InfoCardSeparator />
          <InfoCardRow title="Total spend" value={totalSpend} />
          <InfoCardRow title="Sending" value={sendingValue} />
          <InfoCardRow title="Fee" value={feeRowValue} />
          {arrivesIn && <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />}
        </Stack>
      </Card>
      <InfoCardFooter>
        <HStack gap="space.04" width="100%">
          <InfoCardBtn icon={<ExternalLinkIcon />} label="View details" onClick={onClickLink} />
          <InfoCardBtn icon={<CopyIcon />} label="Copy ID" onClick={onClickCopy} />
        </HStack>
      </InfoCardFooter>
    </>
  );
}
