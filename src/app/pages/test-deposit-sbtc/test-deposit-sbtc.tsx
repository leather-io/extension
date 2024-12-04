/* eslint-disable */
import * as btc from '@scure/btc-signer';
import { styled } from 'leather-styles/jsx';
import { REGTEST, SbtcApiClientTestnet, buildSbtcDepositTx } from 'sbtc';

import { useAverageBitcoinFeeRates } from '@leather.io/query';
import { Button, Input } from '@leather.io/ui';
import { createMoney } from '@leather.io/utils';

import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

const client = new SbtcApiClientTestnet();

// Demo component to create the swap deposit transaction
export function TestDepositSbtc() {
  const stacksAccount = useCurrentStacksAccount();
  const { data: utxos } = useCurrentNativeSegwitUtxos();
  const { data: feeRates } = useAverageBitcoinFeeRates();
  const signer = useCurrentAccountNativeSegwitIndexZeroSigner();
  const networkMode = useBitcoinScureLibNetworkConfig();

  async function onSubmit() {
    if (!stacksAccount) throw new Error('no stacks account');
    if (!utxos) throw new Error('no utxos');

    try {
      const deposit = buildSbtcDepositTx({
        amountSats: 100_000,
        network: REGTEST,
        stacksAddress: stacksAccount.address,
        signersPublicKey: await client.fetchSignersPublicKey(),
        maxSignerFee: 80_000,
        reclaimLockTime: 6_000,
      });

      const { inputs } = determineUtxosForSpend({
        feeRate: feeRates?.halfHourFee.toNumber() ?? 0,
        recipients: [
          {
            address: deposit.address,
            amount: createMoney(Number(deposit.transaction.getOutput(0).amount), 'BTC'),
          },
        ],
        utxos,
      });

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

      signer.sign(deposit.transaction);
      deposit.transaction.finalize();

      console.log('deposit tx', deposit.transaction);
      console.log('tx hex', deposit.transaction.hex);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <styled.form padding="space.05" onSubmit={onSubmit}>
      <h1>sbtc test tx construction</h1>
      <Input.Root>
        <Input.Label>Amount</Input.Label>
        <Input.Field name="amount" />
      </Input.Root>
      <Button type="submit">submit tx</Button>
    </styled.form>
  );
}
