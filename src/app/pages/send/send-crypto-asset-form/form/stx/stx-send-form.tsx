import { CryptoCurrencies } from '@shared/models/currencies.model';

import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useStxSendForm } from './use-stx-send-form';

const symbol: CryptoCurrencies = 'STX';

export function StxSendForm() {
  const stxMarketData = useCryptoCurrencyMarketData(symbol);

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
      switchableAmount={<SendFiatValue marketData={stxMarketData} assetSymbol={symbol} />}
      bottomInputOverlay={
        <SendMaxButton balance={availableStxBalance} sendMaxBalance={sendMaxBalance.toString()} />
      }
      autoComplete="off"
    />
  );

  const selectedAssetField = (
    <SelectedAssetField icon={<StxAvatarIcon />} name="Stacks" symbol={symbol} />
  );

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
