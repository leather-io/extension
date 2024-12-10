/* eslint-disable */
import { useNavigate } from 'react-router-dom';

import * as btc from '@scure/btc-signer';
import { REGTEST, SbtcApiClientTestnet, buildSbtcDepositTx } from 'sbtc';

import { useAverageBitcoinFeeRates } from '@leather.io/query';
import { btcToSat, createMoney } from '@leather.io/utils';

import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import type { SwapSubmissionData } from '../swap.context';

const client = new SbtcApiClientTestnet();

export function useSbtcDepositTransaction() {
  const toast = useToast();
  const { setIsIdle } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const stacksAccount = useCurrentStacksAccount();
  const { data: utxos } = useCurrentNativeSegwitUtxos();
  const { data: feeRates } = useAverageBitcoinFeeRates();
  const signer = useCurrentAccountNativeSegwitIndexZeroSigner();
  const networkMode = useBitcoinScureLibNetworkConfig();
  const navigate = useNavigate();

  return {
    async onDepositSbtc(swapSubmissionData: SwapSubmissionData) {
      if (!stacksAccount) throw new Error('No stacks account');
      if (!utxos) throw new Error('No utxos');
      console.log('amount', btcToSat(swapSubmissionData.swapAmountQuote).toNumber());
      try {
        const deposit = buildSbtcDepositTx({
          amountSats: btcToSat(swapSubmissionData.swapAmountQuote).toNumber(),
          network: REGTEST,
          stacksAddress: stacksAccount.address,
          signersPublicKey: await client.fetchSignersPublicKey(),
          maxSignerFee: 80_000,
          reclaimLockTime: 6_000,
        });

        const { inputs, outputs } = determineUtxosForSpend({
          feeRate: feeRates?.halfHourFee.toNumber() ?? 0,
          recipients: [
            {
              address: deposit.address,
              amount: createMoney(Number(deposit.transaction.getOutput(0).amount), 'BTC'),
            },
          ],
          utxos,
        });
        console.log('inputs', inputs);
        console.log('outputs', outputs);
        const p2wpkh = btc.p2wpkh(signer.publicKey, networkMode);

        for (const input of inputs) {
          deposit.transaction.addInput({
            txid: input.txid,
            index: input.vout,
            sequence: 0,
            witnessUtxo: {
              // script = 0014 + pubKeyHash
              script: p2wpkh.script,
              amount: BigInt(input.value),
            },
          });
        }

        outputs.forEach(output => {
          // Add change output
          if (!output.address) {
            deposit.transaction.addOutputAddress(signer.address, BigInt(output.value), networkMode);
            return;
          }
        });

        signer.sign(deposit.transaction);
        deposit.transaction.finalize();

        console.log('deposit tx', deposit.transaction);
        console.log('tx hex', deposit.transaction.hex);

        const txid = await client.broadcastTx(deposit.transaction);
        console.log('broadcasted tx', txid);
        await client.notifySbtc(deposit);
        toast.success('Transaction submitted!');
        setIsIdle();
        navigate(RouteUrls.Activity);
      } catch (error) {
        setIsIdle();
        console.error(error);
      } finally {
        setIsIdle();
      }
    },
  };
}
