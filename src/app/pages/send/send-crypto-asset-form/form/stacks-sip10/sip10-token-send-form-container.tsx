import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useSip10SendForm } from './use-sip10-send-form';

interface Sip10TokenSendFormContainerProps {
  symbol: string;
  contractId: string;
}
export function Sip10TokenSendFormContainer({
  symbol,
  contractId,
}: Sip10TokenSendFormContainerProps) {
  const {
    availableTokenBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stacksFtFees: fees,
    validationSchema,
    avatar,
  } = useSip10SendForm({ symbol, contractId });

  const amountField = (
    <AmountField
      balance={availableTokenBalance}
      bottomInputOverlay={
        <SendMaxButton balance={availableTokenBalance} sendMaxBalance={sendMaxBalance.toString()} />
      }
      tokenSymbol={symbol}
      autoComplete="off"
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
