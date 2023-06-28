import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';

import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';

import { useSendInscriptionState } from './components/send-inscription-container';
import { useSendInscriptionFeesList } from './hooks/use-send-inscription-fees-list';
import { useSendInscriptionForm } from './hooks/use-send-inscription-form';

export function SendInscriptionChooseFee() {
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const navigate = useNavigate();
  const { recipient, selectedFeeType, setSelectedFeeType, utxo } = useSendInscriptionState();
  const { feesList, isLoading } = useSendInscriptionFeesList({ recipient, utxo });
  const recommendedFeeRate = feesList[1]?.feeRate.toString() || '';

  const { reviewTransaction } = useSendInscriptionForm();
  const { showInsufficientBalanceError, onValidateBitcoinFeeSpend } = useValidateBitcoinSpend();

  async function previewTransaction({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
    try {
      setIsLoadingReview(true);
      await reviewTransaction(feeValue, time, { feeRate, recipient }, isCustomFee);
    } finally {
      setIsLoadingReview(false);
    }
  }

  if (isLoadingReview) return <LoadingSpinner />;

  return (
    <BaseDrawer title="Choose fee" isShowing enableGoBack onClose={() => navigate(-1)}>
      <BitcoinChooseFee
        amount={createMoney(0, 'BTC')}
        feesList={
          <BitcoinFeesList
            feesList={feesList}
            onChooseFee={previewTransaction}
            onValidateBitcoinSpend={onValidateBitcoinFeeSpend}
            onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
            selectedFeeType={selectedFeeType}
          />
        }
        isLoading={isLoading}
        isSendingMax={false}
        onChooseFee={previewTransaction}
        onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
        onValidateBitcoinSpend={onValidateBitcoinFeeSpend}
        recipient={recipient}
        recommendedFeeRate={recommendedFeeRate}
        showError={showInsufficientBalanceError}
      />
    </BaseDrawer>
  );
}
