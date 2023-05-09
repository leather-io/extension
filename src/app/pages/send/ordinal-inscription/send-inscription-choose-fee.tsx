import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BitcoinFeesList } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinFeesListLayout } from '@app/components/bitcoin-fees-list/components/bitcoin-fees-list.layout';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { LoadingSpinner } from '@app/components/loading-spinner';

import { useInscriptionSendState } from './components/send-inscription-loader';
import { useSendInscriptionFeesList } from './hooks/use-send-inscription-fees-list';
import { useSendInscriptionForm } from './hooks/use-send-inscription-form';

export function SendInscriptionChooseFee() {
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const navigate = useNavigate();
  const { recipient, utxo } = useInscriptionSendState();
  const { feesList, isLoading } = useSendInscriptionFeesList({ recipient, utxo });
  const { reviewTransaction } = useSendInscriptionForm();

  async function previewTransaction(feeRate: number, feeValue: number, time: string) {
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
          feesList={feesList}
          isLoading={isLoading}
          onChooseFee={previewTransaction}
        />
      </BitcoinFeesListLayout>
    </BaseDrawer>
  );
}
