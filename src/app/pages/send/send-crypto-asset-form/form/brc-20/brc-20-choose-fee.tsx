import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import get from 'lodash.get';

import { logger } from '@shared/logger';
import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useGenerateSignedNativeSegwitTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinFeesListLayout } from '@app/components/bitcoin-fees-list/components/bitcoin-fees-list.layout';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { ModalHeader } from '@app/components/modal-header';
import { useBrc20Transfers } from '@app/query/bitcoin/ordinals/brc20/use-brc-20';

import { useSendBrc20State } from '../../family/brc20/components/send-brc20-container';

function useBrc20ChooseFeeState() {
  const location = useLocation();
  return {
    tick: get(location.state, 'tick') as string,
    amount: get(location.state, 'amount') as string,
    recipient: get(location.state, 'recipient') as string,
  };
}

export function BrcChooseFee() {
  const navigate = useNavigate();
  const { amount, recipient, tick } = useBrc20ChooseFeeState();
  const generateTx = useGenerateSignedNativeSegwitTx();
  const { selectedFeeType, setSelectedFeeType } = useSendBrc20State();
  const { initiateTransfer } = useBrc20Transfers();
  const { feesList, isLoading } = useBitcoinFeesList({
    amount: Number(amount),
    recipient,
  });
  const amountAsMoney = createMoney(Number(amount), tick, 0);

  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  async function previewTransaction({ feeRate, feeValue }: OnChooseFeeArgs) {
    setIsLoadingOrder(true);
    try {
      const { order, id } = await initiateTransfer(tick, amount);
      setIsLoadingOrder(false);

      const { charge } = order.data;

      const serviceFeeRecipient = charge.address;
      const serviceFee = charge.amount;

      const serviceFeeAsMoney = createMoney(serviceFee, 'BTC');

      const resp = generateTx(
        {
          amount: serviceFeeAsMoney,
          recipient: serviceFeeRecipient,
        },
        feeRate
      );

      if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

      const { hex } = resp;
      navigate(RouteUrls.SendBrc20Confirmation.replace(':ticker', tick), {
        state: {
          tx: hex,
          orderId: id,
          fee: feeValue,
          serviceFee: charge.amount,
          serviceFeeRecipient,
          recipient,
          tick,
          amount,
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

  function onGoBack() {
    setSelectedFeeType(null);
    navigate(-1);
  }

  useRouteHeader(<ModalHeader defaultGoBack hideActions onGoBack={onGoBack} title="Choose fee" />);

  return isLoadingOrder ? (
    <Stack alignItems="center" p="extra-loose" spacing="base" width="100%">
      <LoadingSpinner />
    </Stack>
  ) : (
    <BitcoinFeesListLayout>
      <BitcoinFeesList
        amount={amountAsMoney}
        feesList={feesList}
        isLoading={isLoading}
        isSendingMax={false}
        onChooseFee={previewTransaction}
        onSetSelectedFeeType={(value: BtcFeeType) => setSelectedFeeType(value)}
        selectedFeeType={selectedFeeType}
      />
    </BitcoinFeesListLayout>
  );
}
