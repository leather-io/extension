import { useConfigOrdinalsbot } from '@app/query/common/remote-config/remote-config.query';
import { useAppDispatch } from '@app/store';
import { useCurrentAccountTaprootAddressIndexZeroPayment } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { brc20TransferInitiated } from '@app/store/ordinals/ordinals.slice';

import { useAverageBitcoinFeeRates } from '../../fees/fee-estimates.hooks';
import { useOrdinalsbotClient } from '../../ordinalsbot-client';
import { Brc20TransferInscription, encodeBrc20TransferInscription } from './brc-20.utils';

// ts-unused-exports:disable-next-line
export function useBrc20FeatureFlag() {
  const currentNetwork = useCurrentNetwork();

  const ordinalsbotConfig = useConfigOrdinalsbot();

  if (!ordinalsbotConfig.integrationEnabled) {
    return { enabled: false, reason: 'BRC-20 transfers are temporarily disabled' } as const;
  }

  const supportedNetwork =
    currentNetwork.chain.bitcoin.network === 'mainnet' ||
    currentNetwork.chain.bitcoin.network === 'signet';

  if (!supportedNetwork) return { enabled: false, reason: 'Unsupported network' } as const;

  // TODO: Add api availability check

  return { enabled: true } as const;
}
// ts-unused-exports:disable-next-line
export function useBrc20Transfers() {
  const dispatch = useAppDispatch();
  const ordinalsbotClient = useOrdinalsbotClient();
  const { address } = useCurrentAccountTaprootAddressIndexZeroPayment();
  const bitcoinFees = useAverageBitcoinFeeRates();

  return {
    async initiateTransfer(transfer: Brc20TransferInscription) {
      const { payload, size } = encodeBrc20TransferInscription(transfer);

      const order = await ordinalsbotClient.order({
        receiveAddress: address,
        file: payload,
        size,
        fee: bitcoinFees.avgApiFeeRates?.halfHourFee.toNumber() ?? 10,
      });

      if (order.data.status !== 'ok') throw new Error('Failed to initiate transfer');

      dispatch(
        brc20TransferInitiated({
          amount: 0,
          recipient: '',
          status: 'pending',
          id: 'some-fake-id',
        })
      );

      return { id: 'some-fake-id', transfer, order };
    },
  };
}

// const pollingInterval$ = timer(0, 1000 * 1);

// const pollingCheck$ = pollingInterval$.pipe(
//   switchMap(() => checkOrder()),
//   takeWhile(order => order.status !== 'ok', true)
// );

// pollingCheck$;

// // Simulate order checking
// const counter = createCounter(1);

// async function checkOrder() {
//   if (counter.getValue() > 5) return { status: 'ok' };
//   counter.increment();
//   return { status: 'pending' };
// }
