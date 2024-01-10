import { Outlet } from 'react-router-dom';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { BitcoinSendFormValues } from '@shared/models/form.model';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { BitcoinFeesList } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { ModalHeader } from '@app/components/modal-header';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';
import { UtxoResponseItem } from '@app/query/bitcoin/bitcoin-client';

import { useSendBitcoinAssetContextState } from '../../family/bitcoin/components/send-bitcoin-asset-container';
import { useBtcChooseFee } from './use-btc-choose-fee';

export function useBtcChooseFeeState() {
  const isSendingMax = useLocationStateWithCache('isSendingMax') as boolean;
  const txValues = useLocationStateWithCache('values') as BitcoinSendFormValues;
  const utxos = useLocationStateWithCache('utxos') as UtxoResponseItem[];

  return { isSendingMax, txValues, utxos };
}

export function BtcChooseFee() {
  const { isSendingMax, txValues, utxos } = useBtcChooseFeeState();
  const { selectedFeeType, setSelectedFeeType } = useSendBitcoinAssetContextState();
  const { amountAsMoney, onGoBack, previewTransaction } = useBtcChooseFee();

  const { feesList, isLoading } = useBitcoinFeesList({
    amount: amountAsMoney,
    isSendingMax,
    recipient: txValues.recipient,
    utxos,
  });
  const recommendedFeeRate = feesList[1]?.feeRate.toString() || '';

  const { showInsufficientBalanceError, onValidateBitcoinAmountSpend } = useValidateBitcoinSpend(
    amountAsMoney,
    isSendingMax
  );

  useRouteHeader(<ModalHeader hideActions onGoBack={onGoBack} title="Choose fee" />);

  return (
    <>
      <BitcoinChooseFee
        amount={amountAsMoney}
        isLoading={isLoading}
        feesList={
          <BitcoinFeesList
            feesList={feesList}
            onChooseFee={previewTransaction}
            onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
            onValidateBitcoinSpend={onValidateBitcoinAmountSpend}
            selectedFeeType={selectedFeeType}
          />
        }
        isSendingMax={isSendingMax}
        onChooseFee={previewTransaction}
        onValidateBitcoinSpend={onValidateBitcoinAmountSpend}
        onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
        recipient={txValues.recipient}
        recommendedFeeRate={recommendedFeeRate}
        showError={showInsufficientBalanceError}
        maxRecommendedFeeRate={feesList[0]?.feeRate}
      />
      <Outlet />
    </>
  );
}
