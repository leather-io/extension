import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useStxSendForm } from './use-stx-send-form';

export function StxSendForm() {
  const stxMarketData = useCryptoCurrencyMarketData('STX');

  const {
    availableStxBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stxFees: fees,
    validationSchema,
  } = useStxSendForm();

  const amountField = (
    <AmountField
      balance={availableStxBalance}
      switchableAmount={<SendFiatValue marketData={stxMarketData} assetSymbol="STX" />}
      bottomInputOverlay={
        <SendMaxButton balance={availableStxBalance} sendMaxBalance={sendMaxBalance.toString()} />
      }
      autoComplete="off"
    />
  );

  const selectedAssetField = <SelectedAssetField icon={<StxAvatar />} name="Stacks" symbol="STX" />;

  return (
    <StacksCommonSendForm
      onSubmit={previewTransaction}
      initialValues={initialValues}
      validationSchema={validationSchema}
      amountField={amountField}
      selectedAssetField={selectedAssetField}
      fees={fees}
      availableTokenBalance={availableStxBalance}
    />
  );
}
