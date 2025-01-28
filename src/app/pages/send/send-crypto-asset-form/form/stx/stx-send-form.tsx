import type { CryptoCurrency } from '@leather.io/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather.io/query';
import { StxAvatarIcon } from '@leather.io/ui';

import { Content } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useStxSendForm } from './use-stx-send-form';

const symbol = 'STX' satisfies CryptoCurrency;

export function StxSendForm() {
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage(symbol);
  const {
    availableBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stxFees: fees,
    validationSchema,
  } = useStxSendForm();

  const amountField = (
    <AmountField
      balance={availableBalance}
      switchableAmount={<SendFiatValue marketData={stxMarketData} assetSymbol={symbol} />}
      bottomInputOverlay={
        <SendMaxButton balance={availableBalance} sendMaxBalance={sendMaxBalance.toString()} />
      }
    />
  );

  const selectedAssetField = (
    <SelectedAssetField icon={<StxAvatarIcon />} name="Stacks" symbol={symbol} />
  );

  return (
    <>
      <PageHeader title="Send" />
      <Content>
        <StacksCommonSendForm
          onSubmit={previewTransaction}
          initialValues={initialValues}
          validationSchema={validationSchema}
          amountField={amountField}
          selectedAssetField={selectedAssetField}
          fees={fees}
          availableTokenBalance={availableBalance}
        />
      </Content>
    </>
  );
}
