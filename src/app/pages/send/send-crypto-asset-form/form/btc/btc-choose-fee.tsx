import { Outlet } from 'react-router-dom';

import type { BtcFeeType } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';

import { BitcoinSendFormValues } from '@shared/models/form.model';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { BitcoinFeesList } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { Content, Page } from '@app/components/layout';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';
import { PageHeader } from '@app/features/container/headers/page.header';

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
  const { amountAsMoney, previewTransaction } = useBtcChooseFee();

  const { feesList, isLoading } = useBitcoinFeesList({
    amount: amountAsMoney,
    isSendingMax,
    recipient: txValues.recipient,
    utxos,
  });

  const recipients = [
    {
      address: txValues.recipient,
      amount: amountAsMoney,
    },
  ];

  const recommendedFeeRate = feesList[1]?.feeRate.toString() || '';

  const { showInsufficientBalanceError, onValidateBitcoinAmountSpend } = useValidateBitcoinSpend(
    amountAsMoney,
    isSendingMax
  );

  return (
    <>
      <PageHeader title="Send" />
      <Content>
        <Page>
          <BitcoinChooseFee
            amount={amountAsMoney}
            defaultToCustomFee={!feesList.length}
            feesList={
              <BitcoinFeesList
                feesList={feesList}
                isLoading={isLoading}
                onChooseFee={previewTransaction}
                onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
                onValidateBitcoinSpend={onValidateBitcoinAmountSpend}
                selectedFeeType={selectedFeeType}
              />
            }
            isLoading={isLoading}
            isSendingMax={isSendingMax}
            onChooseFee={previewTransaction}
            onValidateBitcoinSpend={onValidateBitcoinAmountSpend}
            onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
            recipients={recipients}
            recommendedFeeRate={recommendedFeeRate}
            showError={showInsufficientBalanceError}
            maxRecommendedFeeRate={feesList[0]?.feeRate}
          />
          <Outlet />
        </Page>
      </Content>
    </>
  );
}
