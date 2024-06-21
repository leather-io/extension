import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import type { BtcFeeType } from '@leather.io/models';
import { createMoney } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { useSendInscriptionState } from './components/send-inscription-container';
import { useSendInscriptionFeesList } from './hooks/use-send-inscription-fees-list';
import { useSendInscriptionForm } from './hooks/use-send-inscription-form';

export function SendInscriptionChooseFee() {
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const navigate = useNavigate();
  const { recipient, selectedFeeType, setSelectedFeeType, utxo, inscription } =
    useSendInscriptionState();
  const { feesList, isLoading } = useSendInscriptionFeesList({
    recipient,
    utxo,
    inscription,
  });
  const recommendedFeeRate = feesList[1]?.feeRate.toString() || '';

  const { reviewTransaction } = useSendInscriptionForm();
  const { showInsufficientBalanceError, onValidateBitcoinFeeSpend } = useValidateBitcoinSpend();

  const recipients = [
    {
      address: recipient,
      amount: createMoney(0, 'BTC'),
    },
  ];

  async function previewTransaction({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
    try {
      setIsLoadingReview(true);
      await reviewTransaction(feeValue, time, { feeRate, recipient, inscription }, isCustomFee);
    } finally {
      setIsLoadingReview(false);
    }
  }

  if (isLoadingReview)
    return (
      <>
        <LoadingSpinner />
        <Outlet />
      </>
    );

  return (
    <>
      <Dialog
        header={<DialogHeader title="Choose fee" />}
        isShowing
        onGoBack={() => navigate(RouteUrls.Home)}
        onClose={() => navigate(RouteUrls.Home)}
      >
        <BitcoinChooseFee
          amount={createMoney(0, 'BTC')}
          defaultToCustomFee={!feesList.length}
          feesList={
            <BitcoinFeesList
              feesList={feesList}
              isLoading={isLoading}
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
          recipients={recipients}
          recommendedFeeRate={recommendedFeeRate}
          showError={showInsufficientBalanceError}
          maxRecommendedFeeRate={feesList[0]?.feeRate}
        />
      </Dialog>
      <Outlet />
    </>
  );
}
