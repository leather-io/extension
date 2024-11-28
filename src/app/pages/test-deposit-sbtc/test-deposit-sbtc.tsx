import { styled } from 'leather-styles/jsx';
// We're kinda waiting on the proper release of this lib, need this client
// export. Might have to copy across if not fixed soon.
import { REGTEST, SbtcApiClientTestnet, TestnetHelper, sbtcDepositHelper } from 'sbtc';

import { Button, Input } from '@leather.io/ui';

import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

interface TestDepositSbtcProps {}

const testnetHelper = new TestnetHelper();

// Demo component to create the swap tx, without diving into whatever is needed
// to change Swaps
export function TestDepositSbtc(props: TestDepositSbtcProps) {
  const stacksAccount = useCurrentStacksAccount();
  const { data: utxos } = useCurrentNativeSegwitUtxos();
  const btcAddress = useCurrentAccountNativeSegwitAddressIndexZero();
  return (
    <styled.form
      padding="space.05"
      onSubmit={async e => {
        e.preventDefault();
        console.log('submitting tx');

        // Demo code here
        // https://github.com/hirosystems/stacks.js/blob/6886e6e8ccc52a116dcbabc79ba6860619d5b2c0/packages/sbtc/tests/deposit.test.ts
        try {
          if (!stacksAccount) throw new Error('no stacks account');

          if (!utxos) throw new Error('no utxos');

          // await dev.fetchSignersPublicKey(contractAddress),
          const signerKeys = [];

          const tx = await sbtcDepositHelper({
            amountSats: 1_000_000,
            network: REGTEST,
            bitcoinChangeAddress: btcAddress,
            utxoToSpendable: {},
            feeRate: 1,
            stacksAddress: stacksAccount.address,
            // TODO:
            // const utxos = utxosPre
            //   .map(u => ({
            //     txid: u.txid,
            //     vout: u.vout,
            //     value: Math.round(u.amount * 1e8),
            //   }))
            //   .map(u => wrapLazyProxy(u, 'tx', () => c.fetchTxHex(u.txid)));
            utxos: utxos,
          });
          console.log(tx);
        } catch (e) {
          console.error(e);
        }
      }}
    >
      <h1>sbtc test tx construction</h1>
      <Input.Root>
        <Input.Label>Amount</Input.Label>
        <Input.Field type="text" />
      </Input.Root>
      <Button>submit tx</Button>
    </styled.form>
  );
}
