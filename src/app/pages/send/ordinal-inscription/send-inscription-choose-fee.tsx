import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';

import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinFeesListLayout } from '@app/components/bitcoin-fees-list/components/bitcoin-fees-list.layout';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { LoadingSpinner } from '@app/components/loading-spinner';

import { useSendInscriptionState } from './components/send-inscription-container';
import { useSendInscriptionFeesList } from './hooks/use-send-inscription-fees-list';
import { useSendInscriptionForm } from './hooks/use-send-inscription-form';

export function SendInscriptionChooseFee() {
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const navigate = useNavigate();
  const { recipient, selectedFeeType, setSelectedFeeType, utxo } = useSendInscriptionState();
  const { feesList, isLoading } = useSendInscriptionFeesList({ recipient, utxo });
  const { reviewTransaction } = useSendInscriptionForm();

  async function previewTransaction({ feeRate, feeValue, time }: OnChooseFeeArgs) {
    try {
      setIsLoadingReview(true);
      await reviewTransaction(feeValue, time, { feeRate, recipient });
    } finally {
      setIsLoadingReview(false);
    }
  }

  if (isLoadingReview) return <LoadingSpinner />;

  return (
    <BaseDrawer title="Choose fee" isShowing enableGoBack onClose={() => navigate(-1)}>
      <BitcoinFeesListLayout>
        <BitcoinFeesList
          amount={createMoney(0, 'BTC')}
          feesList={feesList}
          isLoading={isLoading}
          onChooseFee={previewTransaction}
          onSetSelectedFeeType={(value: BtcFeeType) => setSelectedFeeType(value)}
          selectedFeeType={selectedFeeType}
        />
      </BitcoinFeesListLayout>
    </BaseDrawer>
  );
}
