import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { Text } from '@stacks/ui';
import { HStack } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { satToBtc } from '@app/common/money/unit-conversion';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
} from '@app/components/info-card/info-card';
import { ModalHeader } from '@app/components/modal-header';
import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { ExternalLinkIcon } from '@app/ui/components/icons/external-link-icon';

export function LockBitcoinSummary() {
  const { state } = useLocation();

  const { txId, txMoney, txFiatValue, txFiatValueSymbol, symbol, txLink } = state;

  const { onCopy } = useClipboard(txId);
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'BTC' });
    handleOpenTxLink(txLink);
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  useRouteHeader(<ModalHeader hideActions defaultClose title="Locked Bitcoin" />);

  return (
    <InfoCard>
      <InfoCardAssetValue
        fiatSymbol={txFiatValueSymbol}
        fiatValue={txFiatValue}
        icon={<CheckmarkIcon size="32px" />}
        my="space.05"
        px="space.05"
        symbol={symbol}
        value={Number(satToBtc(txMoney.amount))}
      />
      <Text fontSize={2} fontWeight={200} padding={'25px'} textAlign={'justify'}>
        <span style={{ fontWeight: 500 }}>Success!</span> Your bitcoin has been locked securely. All
        that's left is for it to be confirmed on the blockchain. After confirmation, you can proceed
        with borrowing against it.
      </Text>
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
