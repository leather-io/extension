import { useLocation } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Stack } from 'leather-styles/jsx';

import { analytics } from '@shared/utils/analytics';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useStacksExplorerLink } from '@app/common/hooks/use-stacks-explorer-link';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCardAssetValue,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { Card, Content, Page, SummaryFooter } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useToast } from '@app/features/toasts/use-toast';

import { TxDone } from '../send-crypto-asset-form/components/tx-done';

export function StxSentSummary() {
  const { state } = useLocation();
  const toast = useToast();

  const {
    txValue,
    txFiatValue,
    txFiatValueSymbol,
    symbol,
    txLink,
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
    <>
      <PageHeader title="Sent" isSummaryPage />
      <Content>
        <Page>
          <Card
            data-testid={SendCryptoAssetSelectors.SentTransactionSummary}
            contentStyle={{
              p: 'space.00',
            }}
            footer={<SummaryFooter onClickCopy={onClickCopy} onClickLink={onClickLink} />}
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
            </Stack>
          </Card>
        </Page>
      </Content>
    </>
  );
}
