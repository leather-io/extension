import { useLocation } from 'react-router-dom';

import {
  Card,
  CardContent,
  CheckmarkIcon,
  CopyIcon,
  ExternalLinkIcon,
  Footer,
} from '@leather-wallet/ui';
import { satToBtc } from '@leather-wallet/utils';
import { HStack, styled } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { InfoCardAssetValue, InfoCardBtn } from '@app/components/info-card/info-card';
import { useToast } from '@app/features/toasts/use-toast';

export function LockBitcoinSummary() {
  const { state } = useLocation();
  const toast = useToast();

  const { txId, txMoney, txFiatValue, txFiatValueSymbol, symbol, txLink } = state;

  const { onCopy } = useClipboard(txId);
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();
  const analytics = useAnalytics();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'BTC' });
    handleOpenTxLink(txLink);
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
        <InfoCardAssetValue
          fiatSymbol={txFiatValueSymbol}
          fiatValue={txFiatValue}
          icon={<CheckmarkIcon width="lg" />}
          my="space.05"
          px="space.05"
          symbol={symbol}
          value={Number(satToBtc(txMoney.amount))}
        />
        <styled.span textStyle="body.02" p="space.05" textAlign="justify">
          <b>Success!</b> Your bitcoin has been locked securely. All that's left is for it to be
          confirmed on the blockchain. After confirmation, you can proceed with borrowing against
          it.
        </styled.span>
      </CardContent>
    </Card>
  );
}
