/* eslint-disable */
// import { STACKS_TESTNET } from '@stacks/network';
// import { cvToValue } from '@stacks/transactions';
import { styled } from 'leather-styles/jsx';
import { REGTEST } from 'sbtc';

import { Button, Input } from '@leather.io/ui';

import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { sbtcDepositHelper } from './deposit';
import { SbtcApiClientTestnet, wrapLazyProxy } from './sbtc-api';

const client = new SbtcApiClientTestnet();

// Demo component to create the swap tx, without diving into whatever is needed
// to change Swaps
export function TestDepositSbtc() {
  const stacksAccount = useCurrentStacksAccount();
  const { data: utxos } = useCurrentNativeSegwitUtxos();
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();

  async function onSubmit() {
    console.log('submitting tx');
    try {
      if (!stacksAccount) throw new Error('no stacks account');
      if (!utxos) throw new Error('no utxos');

      const utxosWithTx = utxos
        .map(u => ({
          txid: u.txid,
          vout: u.vout,
          value: Math.round(u.value * 1e8),
          status: u.status,
        }))
        .map(u => wrapLazyProxy(u, 'tx', async () => client.fetchTxHex(u.txid)));
      console.log('utxos with tx', utxosWithTx);

      // const keys = await client.fetchCallReadOnly({
      //   contractAddress: 'SNGWPN3XDAQE673MXYXF81016M50NHF5X5PWWM70.sbtc-registry',
      //   functionName: 'get-current-aggregate-pubkey',
      //   sender: STACKS_TESTNET.bootAddress,
      // });
      // console.log('keys', cvToValue(keys));
      const deposit = await sbtcDepositHelper({
        amountSats: 100_000,
        network: REGTEST,
        bitcoinChangeAddress: btcAddress,
        feeRate: 1, // await client.fetchFeeRate('low'),
        signersPublicKey: await client.fetchSignersPublicKey(), // cvToValue(keys).slice(2),
        stacksAddress: stacksAccount.address,
        utxos: utxosWithTx,
      });
      console.log(deposit);
    } catch (e) {
      console.error(e);
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
