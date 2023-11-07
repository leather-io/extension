import { PaymentTypes } from '@btckit/types';
import { bytesToHex } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import { Psbt } from 'bitcoinjs-lib';
import AppClient from 'ledger-bitcoin';

import { getBitcoinJsLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { getTaprootAddress } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getInputPaymentType } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootAccountDerivationPath } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { getNativeSegwitAccountDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';
import { logger } from '@shared/logger';
import { makeNumberRange } from '@shared/utils';

import { useWalletType } from '@app/common/use-wallet-type';
import { listenForBitcoinTxLedgerSigning } from '@app/features/ledger/flows/bitcoin-tx-signing/bitcoin-tx-signing-event-listeners';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import {
  addNativeSegwitSignaturesToPsbt,
  addTaprootInputSignaturesToPsbt,
  createNativeSegwitDefaultWalletPolicy,
  createTaprootDefaultWalletPolicy,
} from '@app/features/ledger/utils/bitcoin-ledger-utils';
import { useTaprootAccount } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { useCurrentNativeSegwitAccount } from './native-segwit-account.hooks';
import { useUpdateLedgerSpecificNativeSegwitInputPropsForAdddressIndexZero } from './native-segwit-account.hooks';
import { useCurrentTaprootAccount } from './taproot-account.hooks';
import { useUpdateLedgerSpecificTaprootInputPropsForAdddressIndexZero } from './taproot-account.hooks';

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
export function useSignLedgerTx() {
  const accountIndex = useCurrentAccountIndex();
  const network = useCurrentNetwork();

  const updateNativeSegwitLedgerProps =
    useUpdateLedgerSpecificNativeSegwitInputPropsForAdddressIndexZero();

  const updateTaprootLedgerInputs = useUpdateLedgerSpecificTaprootInputPropsForAdddressIndexZero();

  return async (app: AppClient, rawPsbt: Uint8Array) => {
    const fingerprint = await app.getMasterFingerprint();

    // BtcSigner not compatible with Ledger. Encoded format returns more terse
    // version. BitcoinJsLib works.
    const psbt = Psbt.fromBuffer(Buffer.from(rawPsbt), {
      network: getBitcoinJsLibNetworkConfigByMode(network.chain.bitcoin.network),
    });

    const btcSignerPsbtClone = btc.Transaction.fromPSBT(psbt.toBuffer());

    const inputByPaymentType = makeNumberRange(btcSignerPsbtClone.inputsLength).map(index => [
      index,
      getInputPaymentType(index, btcSignerPsbtClone.getInput(index), network.chain.bitcoin.network),
    ]) as readonly [number, PaymentTypes][];

    //
    // Taproot
    const taprootInputsToSign = inputByPaymentType
      .filter(([_, paymentType]) => paymentType === 'p2tr')
      .map(([index]) => index);

    if (taprootInputsToSign.length) {
      await updateTaprootLedgerInputs(psbt, fingerprint, taprootInputsToSign);

      const taprootExtendedPublicKey = await app.getExtendedPubkey(
        getTaprootAccountDerivationPath(network.chain.bitcoin.network, accountIndex)
      );

      const taprootPolicy = createTaprootDefaultWalletPolicy({
        fingerprint,
        accountIndex,
        network: network.chain.bitcoin.network,
        xpub: taprootExtendedPublicKey,
      });

      const taprootSignatures = await app.signPsbt(psbt.toBase64(), taprootPolicy, null);
      addTaprootInputSignaturesToPsbt(psbt, taprootSignatures);
    }

    //
    // Native Segwit
    const nativeSegwitInputsToSign = inputByPaymentType
      .filter(([_, paymentType]) => paymentType === 'p2wpkh')
      .map(([index]) => index);

    if (nativeSegwitInputsToSign.length) {
      const nativeSegwitExtendedPublicKey = await app.getExtendedPubkey(
        getNativeSegwitAccountDerivationPath(network.chain.bitcoin.network, accountIndex)
      );

      await updateNativeSegwitLedgerProps(psbt, fingerprint, nativeSegwitInputsToSign);

      const nativeSegwitPolicy = createNativeSegwitDefaultWalletPolicy({
        fingerprint,
        accountIndex,
        network: network.chain.bitcoin.network,
        xpub: nativeSegwitExtendedPublicKey,
      });

      const nativeSegwitSignatures = await app.signPsbt(psbt.toBase64(), nativeSegwitPolicy, null);
      logger.debug('Native Segwit signatures', nativeSegwitSignatures);

      addNativeSegwitSignaturesToPsbt(psbt, nativeSegwitSignatures);
    }

    // Turn back into BtcSigner lib format
    // REMINDER: this tx is not finalized
    return btc.Transaction.fromPSBT(psbt.toBuffer());
  };
}
