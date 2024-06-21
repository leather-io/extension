import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';
import get from 'lodash.get';

import type { BtcFeeType } from '@leather.io/models';
import type { UtxoResponseItem } from '@leather.io/query';
import { createMoney } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { formFeeRowValue } from '@app/common/send/utils';
import { useGenerateUnsignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { BitcoinChooseFee } from '@app/features/bitcoin-choose-fee/bitcoin-choose-fee';
import { useValidateBitcoinSpend } from '@app/features/bitcoin-choose-fee/hooks/use-validate-bitcoin-spend';
import { useToast } from '@app/features/toasts/use-toast';
import { useBrc20Transfers } from '@app/query/bitcoin/ordinals/brc20/brc20-tokens.hooks';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { useSendBitcoinAssetContextState } from '../../family/bitcoin/components/send-bitcoin-asset-container';

function useBrc20ChooseFeeState() {
  const location = useLocation();
  return {
    ticker: get(location.state, 'ticker') as string,
    amount: get(location.state, 'amount') as string,
    recipient: get(location.state, 'recipient') as string,
    utxos: get(location.state, 'utxos') as UtxoResponseItem[],
    holderAddress: get(location.state, 'holderAddress') as string,
  };
}

export function BrcChooseFee() {
  const toast = useToast();
  const navigate = useNavigate();
  const { amount, recipient, ticker, utxos, holderAddress } = useBrc20ChooseFeeState();
  const generateTx = useGenerateUnsignedNativeSegwitTx();
  const signTx = useSignBitcoinTx();
  const { selectedFeeType, setSelectedFeeType } = useSendBitcoinAssetContextState();
  const { initiateTransfer } = useBrc20Transfers(holderAddress);
  const amountAsMoney = createMoney(Number(amount), ticker, 0);
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: amountAsMoney,
    recipient,
    utxos,
  });
  const recipients = [
    {
      address: recipient,
      amount: amountAsMoney,
    },
  ];
  const recommendedFeeRate = feesList[1]?.feeRate.toString() || '';

  const { showInsufficientBalanceError, onValidateBitcoinFeeSpend } =
    useValidateBitcoinSpend(amountAsMoney);

  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  async function previewTransaction({ feeRate, feeValue, isCustomFee }: OnChooseFeeArgs) {
    setIsLoadingOrder(true);
    try {
      const { order, id } = await initiateTransfer(ticker, amount);
      setIsLoadingOrder(false);

      const { charge } = order.data;

      const serviceFeeRecipient = charge.address;
      const serviceFee = charge.amount;

      const serviceFeeAsMoney = createMoney(serviceFee, 'BTC');

      const resp = await generateTx(
        {
          amount: serviceFeeAsMoney,
          recipients: [
            {
              address: serviceFeeRecipient,
              amount: serviceFeeAsMoney,
            },
          ],
        },
        feeRate,
        utxos
      );

      if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');
      const signedTx = await signTx(resp.psbt);

      if (!signedTx) return logger.error('Attempted to sign tx, but no tx exists');
      signedTx.finalize();

      const feeRowValue = formFeeRowValue(feeRate, isCustomFee);
      navigate(RouteUrls.SendBrc20Confirmation.replace(':ticker', ticker), {
        state: {
          tx: signedTx.hex,
          orderId: id,
          fee: feeValue,
          serviceFee: charge.amount,
          serviceFeeRecipient,
          recipient,
          feeRowValue,
          ticker,
          amount,
          holderAddress,
          hasHeaderTitle: true,
        },
      });
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to create transaction';
      logger.error('Failed to create transaction', err);
      toast.error(errorMessage);
      navigate('..');
    } finally {
      setIsLoadingOrder(false);
    }
  }

  return isLoadingOrder ? (
    <Stack
      alignItems="center"
      minHeight={['unset', '630px']}
      p="space.06"
      gap="space.04"
      width="100%"
    >
      <LoadingSpinner />
    </Stack>
  ) : (
    <>
      <BitcoinChooseFee
        amount={amountAsMoney}
        defaultToCustomFee={!feesList.length}
        feesList={
          <BitcoinFeesList
            feesList={feesList}
            isLoading={isLoading}
            onChooseFee={previewTransaction}
            onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
            onValidateBitcoinSpend={onValidateBitcoinFeeSpend}
            selectedFeeType={selectedFeeType}
          />
        }
        isLoading={isLoading}
        isSendingMax={false}
        onChooseFee={previewTransaction}
        onSetSelectedFeeType={(value: BtcFeeType | null) => setSelectedFeeType(value)}
        onValidateBitcoinSpend={onValidateBitcoinFeeSpend}
        recommendedFeeRate={recommendedFeeRate}
        recipients={recipients}
        showError={showInsufficientBalanceError}
        maxRecommendedFeeRate={feesList[0]?.feeRate}
      />
      <Outlet />
    </>
  );
}
