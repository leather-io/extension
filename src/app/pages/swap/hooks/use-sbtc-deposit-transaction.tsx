import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { bytesToHex } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import type { P2Ret, P2TROut } from '@scure/btc-signer/payment';
import {
  DEFAULT_RECLAIM_LOCK_TIME,
  MAINNET,
  REGTEST,
  SbtcApiClientMainnet,
  SbtcApiClientTestnet,
  TESTNET,
  buildSbtcDepositTx,
} from 'sbtc';

import { BitcoinSigner } from '@leather.io/bitcoin';
import type { BitcoinNetworkModes } from '@leather.io/models';
import { type UtxoResponseItem, useAverageBitcoinFeeRates } from '@leather.io/query';
import { btcToSat, createMoney } from '@leather.io/utils';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { LoadingKeys, useLoading } from '@app/common/hooks/use-loading';
import {
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useToast } from '@app/features/toasts/use-toast';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import type { BitcoinSwapContext } from '../providers/bitcoin-swap-provider';
import type { SubmitSwapArgs } from '../swap.context';

export interface SbtcDeposit {
  address: string;
  depositScript: string;
  reclaimScript: string;
  transaction: btc.Transaction;
  trOut: P2TROut;
}

function getSbtcNetworkConfig(network: BitcoinNetworkModes) {
  const networkMap = {
    mainnet: MAINNET,
    testnet: TESTNET,
    regtest: REGTEST,
    // Signet supported not tested, but likely uses same values as testnet
    signet: TESTNET,
  };
  return networkMap[network];
}

const clientMainnet = new SbtcApiClientMainnet();
const clientTestnet = new SbtcApiClientTestnet();

export function useSbtcDepositTransaction(signer: BitcoinSigner<P2Ret>, utxos: UtxoResponseItem[]) {
  const toast = useToast();
  const { setIsIdle } = useLoading(LoadingKeys.SUBMIT_SWAP_TRANSACTION);
  const stacksAccount = useCurrentStacksAccount();
  const { data: feeRates } = useAverageBitcoinFeeRates();
  const networkMode = useBitcoinScureLibNetworkConfig();
  const navigate = useNavigate();
  const network = useCurrentNetwork();
  // TODO: Use with Ledger integration
  // const sign = useSignBitcoinTx();

  const client = useMemo(
    () => (network.chain.bitcoin.mode === 'mainnet' ? clientMainnet : clientTestnet),
    [network]
  );

  // Check if the signer is compliant
  useBreakOnNonCompliantEntity();

  return {
    async onReviewDepositSbtc({
      values,
      swapData,
      isSendingMax,
    }: SubmitSwapArgs<BitcoinSwapContext>) {
      if (!stacksAccount || !utxos) return;

      try {
        const deposit: SbtcDeposit = buildSbtcDepositTx({
          amountSats: btcToSat(values.swapAmountQuote).toNumber(),
          network: getSbtcNetworkConfig(network.chain.bitcoin.mode),
          stacksAddress: stacksAccount.address,
          signersPublicKey: await client.fetchSignersPublicKey(),
          maxSignerFee: swapData.maxSignerFee,
          reclaimLockTime: DEFAULT_RECLAIM_LOCK_TIME,
          reclaimPublicKey: bytesToHex(signer.publicKey).slice(2),
        });

        const determineUtxosArgs = {
          feeRate: feeRates?.halfHourFee.toNumber() ?? 0,
          recipients: [
            {
              address: deposit.address,
              amount: createMoney(Number(deposit.transaction.getOutput(0).amount), 'BTC'),
            },
          ],
          utxos,
        };

        const { inputs, outputs, fee } = isSendingMax
          ? determineUtxosForSpendAll(determineUtxosArgs)
          : determineUtxosForSpend(determineUtxosArgs);

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

        return { deposit, fee: createMoney(fee, 'BTC') };
      } catch (error) {
        logger.error('Error generating deposit transaction', error);
        return null;
      }
    },
    async onDepositSbtc(deposit?: SbtcDeposit) {
      if (!deposit) return;
      try {
        signer.sign(deposit.transaction);
        deposit.transaction.finalize();
        logger.info('Deposit', { deposit });

        const txid = await client.broadcastTx(deposit.transaction);
        logger.info('Broadcasted tx', txid);

        await client.notifySbtc(deposit);
        toast.success('Transaction submitted!');
        setIsIdle();
        navigate(RouteUrls.Activity);
      } catch (error) {
        setIsIdle();
        logger.error(`Deposit error: ${error}`);
      } finally {
        setIsIdle();
      }
    },
  };
}
