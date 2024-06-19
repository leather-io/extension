import type { CryptoCurrencies } from '@leather-wallet/models';
import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';

import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useStxSendForm } from './use-stx-send-form';

const symbol = 'STX' satisfies CryptoCurrencies;

export function StxSendForm() {
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage(symbol);

  const {
    availableUnlockedBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stxFees: fees,
    validationSchema,
  } = useStxSendForm();

  const amountField = (
    <AmountField
      balance={availableUnlockedBalance}
      switchableAmount={<SendFiatValue marketData={stxMarketData} assetSymbol={symbol} />}
      bottomInputOverlay={
        <SendMaxButton
          balance={availableUnlockedBalance}
          sendMaxBalance={sendMaxBalance.toString()}
        />
      }
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
      availableTokenBalance={availableUnlockedBalance}
    />
  );
}
