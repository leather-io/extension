import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather.io/models';
import { StxAvatarIcon } from '@leather.io/ui';

import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useSip10SendForm } from './use-sip10-send-form';

interface Sip10TokenSendFormContainerProps {
  info: Sip10CryptoAssetInfo;
  balance: CryptoAssetBalance;
  marketData: MarketData;
}
export function Sip10TokenSendFormContainer({
  info,
  balance,
  marketData,
}: Sip10TokenSendFormContainerProps) {
  const {
    availableTokenBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stacksFtFees: fees,
    validationSchema,
    avatar,
    decimals,
    symbol,
  } = useSip10SendForm({ info, balance });

  const amountField = (
    <AmountField
      balance={availableTokenBalance}
      bottomInputOverlay={
        <SendMaxButton balance={availableTokenBalance} sendMaxBalance={sendMaxBalance.toString()} />
      }
      tokenSymbol={symbol}
      autoComplete="off"
      switchableAmount={
        marketData ? (
          <SendFiatValue marketData={marketData} assetSymbol={symbol} assetDecimals={decimals} />
        ) : undefined
      }
    />
  );
  const selectedAssetField = (
    <SelectedAssetField
      icon={
        avatar ? (
          <StacksAssetAvatar gradientString={avatar.avatar} img={avatar.imageCanonicalUri} />
        ) : (
          <StxAvatarIcon />
        )
      }
      name={symbol}
      symbol={symbol}
    />
  );

  return (
    <StacksCommonSendForm
      onSubmit={previewTransaction}
      initialValues={initialValues}
      validationSchema={validationSchema}
      amountField={amountField}
      selectedAssetField={selectedAssetField}
      fees={fees}
      availableTokenBalance={availableTokenBalance}
    />
  );
}
