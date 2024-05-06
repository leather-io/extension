import {
  createBrc20TransferInscription,
  encodeBrc20TransferInscription,
  useAverageBitcoinFeeRates,
} from '@leather-wallet/query';

import { useAppDispatch } from '@app/store';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { brc20TransferInitiated } from '@app/store/ordinals/ordinals.slice';

import { useOrdinalsbotClient } from '../../ordinalsbot-client';

export function useBrc20Transfers(holderAddress: string) {
  const dispatch = useAppDispatch();
  const currentAccountIndex = useCurrentAccountIndex();
  const ordinalsbotClient = useOrdinalsbotClient();
  const { data: fees } = useAverageBitcoinFeeRates();

  return {
    async initiateTransfer(tick: string, amount: string) {
      const transferInscription = createBrc20TransferInscription(tick, Number(amount));
      const { payload, size } = encodeBrc20TransferInscription(transferInscription);

      const order = await ordinalsbotClient.order({
        receiveAddress: holderAddress,
        file: payload,
        size,
        name: `${tick}-${amount}.txt`,
        fee: fees?.halfHourFee.toNumber() ?? 10,
      });

      if (order.data.status !== 'ok') throw new Error('Failed to initiate transfer');

      return { id: order.data.id, order };
    },

    inscriptionPaymentTransactionComplete(
      orderId: string,
      amount: number,
      recipient: string,
      tick: string
    ) {
      dispatch(
        brc20TransferInitiated({
          accountIndex: currentAccountIndex,
          amount,
          tick,
          recipient,
          status: 'pending',
          id: orderId,
        })
      );
    },
  };
}
