import type { ReactNode } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Stack } from 'leather-styles/jsx';

import type { Money } from '@leather.io/models';
import { type HasChildren, LoadingSpinner } from '@leather.io/ui';

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

import { TxDone } from '../../send-crypto-asset-form/components/tx-done';

function StacksChainTxSummaryContainerLayout({ children }: HasChildren) {
  return (
    <>
      <PageHeader title="Sent" isSummaryPage />
      <Content>
        <Page>{children}</Page>
      </Content>
    </>
  );
}

export function StacksChainTxSummaryLoading({ txid }: { txid: string }) {
  const toast = useToast();
  const { handleOpenStacksTxLink } = useStacksExplorerLink();
  const { onCopy } = useClipboard(txid);

  function onClickLink() {
    void analytics.untypedTrack('view_transaction_confirmation_while_loading', { symbol: 'STX' });
    handleOpenStacksTxLink({ txid });
  }

  function onClickCopy() {
    toast.success('ID copied!');
    onCopy();
  }
  return (
    <StacksChainTxSummaryContainerLayout>
      <Card
        height="680px"
        alignItems="center"
        justifyContent="center"
        footer={<SummaryFooter onClickCopy={onClickCopy} onClickLink={onClickLink} />}
      >
        <LoadingSpinner />
      </Card>
    </StacksChainTxSummaryContainerLayout>
  );
}

interface StacksChainTxSummaryLayoutProps {
  txid: string;
  token: string;
  recipient?: string;
  value: Money;
  txFiatValue?: string;
  metadata: [string, ReactNode][];
}
export function StacksChainTxSummaryLayout(props: StacksChainTxSummaryLayoutProps) {
  const { txid, token, recipient, value, txFiatValue, metadata } = props;

  const { onCopy } = useClipboard(txid);
  const { handleOpenStacksTxLink } = useStacksExplorerLink();
  const toast = useToast();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'STX' });
    handleOpenStacksTxLink({ txid });
  }

  function onClickCopy() {
    toast.success('ID copied!');
    onCopy();
  }

  return (
    <StacksChainTxSummaryContainerLayout>
      <Card
        data-testid={SendCryptoAssetSelectors.SentTransactionSummary}
        contentStyle={{ p: 'space.00' }}
        footer={<SummaryFooter onClickCopy={onClickCopy} onClickLink={onClickLink} />}
      >
        <TxDone />

        <InfoCardAssetValue
          fiatSymbol="USD"
          fiatValue={txFiatValue}
          px="space.05"
          symbol={token.toUpperCase()}
          value={value}
        />

        <Stack pb="space.06" px="space.06" width="100%">
          {recipient && (
            <>
              <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
              <InfoCardSeparator />
            </>
          )}

          {metadata.map(([title, value]) => (
            <InfoCardRow key={title} title={title} value={value} />
          ))}
        </Stack>
      </Card>
    </StacksChainTxSummaryContainerLayout>
  );
}
