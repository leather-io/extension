import { bytesToHex } from '@noble/hashes/utils';

import { getTaprootAddress } from '@shared/crypto/bitcoin/bitcoin.utils';

import { useWalletType } from '@app/common/use-wallet-type';
import { listenForBitcoinTxLedgerSigning } from '@app/features/ledger/flows/bitcoin-tx-signing/bitcoin-tx-signing-event-listeners';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentNativeSegwitAccount } from './native-segwit-account.hooks';
import { useCurrentTaprootAccount } from './taproot-account.hooks';

// Checks for both TR and NativeSegwit hooks
export function useHasCurrentBitcoinAccount() {
  const nativeSegwit = useCurrentNativeSegwitAccount();
  const taproot = useCurrentTaprootAccount();
  return !!nativeSegwit && !!taproot;
}

// Temporary - remove with privacy mode
export function useZeroIndexTaprootAddress(accIndex?: number) {
  const network = useCurrentNetwork();
  const currentAccountIndex = useCurrentAccountIndex();
  const account = useTaprootAccount(accIndex ?? currentAccountIndex);

  if (!account) throw new Error('Expected keychain to be provided');

  const address = getTaprootAddress({
    index: 0,
    keychain: account.keychain,
    network: network.chain.bitcoin.network,
  });

  return address;
}

export function useSignBitcoinTx() {
  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();

  return (psbt: Uint8Array, inputsToSign?: Record<number, string>) =>
    whenWallet({
      async ledger(psbt: Uint8Array) {
        ledgerNavigate.toConnectAndSignBitcoinTransactionStep(psbt);
        return listenForBitcoinTxLedgerSigning(bytesToHex(psbt));
      },
      async software(psbt: Uint8Array) {
        // return signSoftwareTx(tx);
      },
    })(psbt);
}
