import { useConfigOrdinalsbot } from '@app/query/common/remote-config/remote-config.query';
import { useAppDispatch } from '@app/store';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { brc20TransferInitiated } from '@app/store/ordinals/ordinals.slice';

import { useAverageBitcoinFeeRates } from '../../fees/fee-estimates.hooks';
import { useOrdinalsbotClient } from '../../ordinalsbot-client';
import { createBrc20TransferInscription, encodeBrc20TransferInscription } from './brc-20.utils';

// ts-unused-exports:disable-next-line
export function useBrc20FeatureFlag() {
  const currentNetwork = useCurrentNetwork();

  const ordinalsbotConfig = useConfigOrdinalsbot();

  if (!ordinalsbotConfig.integrationEnabled) {
    return { enabled: false, reason: 'BRC-20 transfers are temporarily disabled' } as const;
  }

  const supportedNetwork =
    currentNetwork.chain.bitcoin.bitcoinNetwork === 'mainnet' ||
    currentNetwork.chain.bitcoin.bitcoinNetwork === 'signet';

  if (!supportedNetwork) return { enabled: false, reason: 'Unsupported network' } as const;

  // TODO: Add api availability check

  return { enabled: true } as const;
}

export function useBrc20Transfers() {
  const dispatch = useAppDispatch();
  const currentAccountIndex = useCurrentAccountIndex();
  const ordinalsbotClient = useOrdinalsbotClient();
  const { address } = useCurrentAccountTaprootIndexZeroSigner();
  const { data: fees } = useAverageBitcoinFeeRates();

  return {
    async initiateTransfer(tick: string, amount: string) {
      const transferInscription = createBrc20TransferInscription(tick, Number(amount));
      const { payload, size } = encodeBrc20TransferInscription(transferInscription);

      const order = await ordinalsbotClient.order({
        receiveAddress: address,
        file: payload,
        size,
        name: `${tick}-${amount}.txt`,
        fee: fees?.halfHourFee.toNumber() ?? 10,
      });

      if (order.data.status !== 'ok') throw new Error('Failed to initiate transfer');

      return { id: order.data.charge.id, order };
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
