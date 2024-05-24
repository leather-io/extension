import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';

import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useStxSendForm } from './use-stx-send-form';

const symbol = 'STX';

export function StxSendForm() {
  const stxMarketData = useCryptoCurrencyMarketDataMeanAverage(symbol);

  const {
    availableUnlockedBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stxFees: fees,
    validationSchema,
    fee,
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
      // FIXME 4370 - need to fix this as fee is actually  NumberSchema<number | undefined, AnyObject>; in FeeValidatorFactoryArgs
      // this needs to be the STX fee so it can be validated against HIGH_FEE_AMOUNT_STX
      fee={fee as unknown as string}
      availableTokenBalance={availableUnlockedBalance}
    />
  );
}
