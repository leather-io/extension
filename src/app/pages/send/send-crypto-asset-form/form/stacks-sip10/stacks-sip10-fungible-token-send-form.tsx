import { Navigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { isString } from '@shared/utils';

import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';
import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useSip10SendForm } from './use-sip10-send-form';

export function StacksSip10FungibleTokenSendForm() {
  const {
    availableTokenBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stacksFtFees: fees,
    symbol,
    validationSchema,
    avatar,
  } = useSip10SendForm();

  if (!isString(symbol)) {
    return <Navigate to={RouteUrls.SendCryptoAsset} />;
  }

  const amountField = (
    <AmountField
      balance={availableTokenBalance}
      bottomInputOverlay={
        <SendMaxButton balance={availableTokenBalance} sendMaxBalance={sendMaxBalance.toString()} />
      }
    />
  );
  const selectedAssetField = (
    <SelectedAssetField
      icon={
        avatar ? (
          <StacksAssetAvatar
            gradientString={avatar.avatar}
            imageCanonicalUri={avatar.imageCanonicalUri}
          />
        ) : (
          <StxAvatar />
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
