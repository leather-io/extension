import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { BitcoinFeesList } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { ModalHeader } from '@app/components/modal-header';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';

import { useSendBitcoinAssetContextState } from '../../family/bitcoin/components/send-bitcoin-asset-container';
import { useBtcChooseFee } from './use-btc-choose-fee';

export function useBtcChooseFeeState() {
  const location = useLocation();
  return {
    isSendingMax: get(location.state, 'isSendingMax') as boolean,
    txValues: get(location.state, 'values') as BitcoinSendFormValues,
  };
}

export function BtcChooseFee() {
  const { isSendingMax, txValues } = useBtcChooseFeeState();
  const { selectedFeeType, setSelectedFeeType } = useSendBitcoinAssetContextState();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: Number(txValues.amount),
    isSendingMax,
    recipient: txValues.recipient,
  });
  const { amountAsMoney, onGoBack, previewTransaction } = useBtcChooseFee();
  const { showInsufficientBalanceError, onValidateBitcoinAmountSpend } =
    useValidateBitcoinSpend(amountAsMoney);

  useRouteHeader(<ModalHeader hideActions onGoBack={onGoBack} title="Choose fee" />);

  return (
    <BitcoinChooseFee
      amount={amountAsMoney}
      feesList={
        <BitcoinFeesList
          feesList={feesList}
          isLoading={isLoading}
          onChooseFee={previewTransaction}
          onSetSelectedFeeType={(value: BtcFeeType) => setSelectedFeeType(value)}
          onValidateBitcoinSpend={onValidateBitcoinAmountSpend}
          selectedFeeType={selectedFeeType}
        />
      }
      recommendedFeeRate={feesList[1].feeRate}
      onValidateBitcoinSpend={onValidateBitcoinAmountSpend}
      onChooseFee={previewTransaction}
      recipient={txValues.recipient}
      isSendingMax={isSendingMax}
      showError={showInsufficientBalanceError}
    />
  );
}
