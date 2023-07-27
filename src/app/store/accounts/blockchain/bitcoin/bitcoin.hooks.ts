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
import { allSighashTypes } from '@shared/rpc/methods/sign-psbt';
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
import {
  useCurrentAccountTaprootSigner,
  useTaprootAccount,
} from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import {
  useCurrentAccountNativeSegwitSigner,
  useCurrentNativeSegwitAccount,
} from './native-segwit-account.hooks';
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
    network: network.chain.bitcoin.bitcoinNetwork,
  });

  return address;
}

// This implementation assumes address re-use of the 0 index. Funds spread
// across multiple address indexes does not work here.
function useSignBitcoinSoftwareTx() {
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  const network = useCurrentNetwork();
  return async (psbt: Uint8Array, inputsToSign?: number[]) => {
    const nativeSegwitSigner = createNativeSegwitSigner?.(0);
    const taprootSigner = createTaprootSigner?.(0);

    if (!nativeSegwitSigner || !taprootSigner) throw new Error('Signers not available');

    const tx = btc.Transaction.fromPSBT(psbt);

    const inputIndexes = inputsToSign ?? makeNumberRange(tx.inputsLength);

    inputIndexes.forEach(index => {
      const input = tx.getInput(index);
      const addressType = getInputPaymentType(index, input, network.chain.bitcoin.bitcoinNetwork);

      switch (addressType) {
        case 'p2tr': {
          taprootSigner.signIndex(tx, index, allSighashTypes);
          break;
        }
        case 'p2wpkh': {
          nativeSegwitSigner.signIndex(tx, index, allSighashTypes);
          break;
        }
        default:
          logger.warn('Cannot sign input of address type ' + addressType);
      }
    });

    return tx;
  };
}

export function useSignLedgerBitcoinTx() {
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
      network: getBitcoinJsLibNetworkConfigByMode(network.chain.bitcoin.bitcoinNetwork),
    });

    const btcSignerPsbtClone = btc.Transaction.fromPSBT(psbt.toBuffer());

    const inputByPaymentType = makeNumberRange(btcSignerPsbtClone.inputsLength).map(index => [
      index,
      getInputPaymentType(
        index,
        btcSignerPsbtClone.getInput(index),
        network.chain.bitcoin.bitcoinNetwork
      ),
    ]) as readonly [number, PaymentTypes][];

    //
    // Taproot
    const taprootInputsToSign = inputByPaymentType
      .filter(([_, paymentType]) => paymentType === 'p2tr')
      .map(([index]) => index);

    if (taprootInputsToSign.length) {
      await updateTaprootLedgerInputs(psbt, fingerprint, taprootInputsToSign);

      const taprootExtendedPublicKey = await app.getExtendedPubkey(
        getTaprootAccountDerivationPath(network.chain.bitcoin.bitcoinNetwork, accountIndex)
      );

      const taprootPolicy = createTaprootDefaultWalletPolicy({
        fingerprint,
        accountIndex,
        network: network.chain.bitcoin.bitcoinNetwork,
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
        getNativeSegwitAccountDerivationPath(network.chain.bitcoin.bitcoinNetwork, accountIndex)
      );

      await updateNativeSegwitLedgerProps(psbt, fingerprint, nativeSegwitInputsToSign);

      const nativeSegwitPolicy = createNativeSegwitDefaultWalletPolicy({
        fingerprint,
        accountIndex,
        network: network.chain.bitcoin.bitcoinNetwork,
        xpub: nativeSegwitExtendedPublicKey,
      });

      const nativeSegwitSignatures = await app.signPsbt(psbt.toBase64(), nativeSegwitPolicy, null);
      addNativeSegwitSignaturesToPsbt(psbt, nativeSegwitSignatures);
    }

    // Turn back into BtcSigner lib format
    // REMINDER: this tx is not finalized
    return btc.Transaction.fromPSBT(psbt.toBuffer());
  };
}

export function useAddTapInternalKeysIfMissing() {
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  return (tx: btc.Transaction, inputIndexes?: number[]) => {
    const taprootSigner = createTaprootSigner?.(0);
    if (!taprootSigner) throw new Error('Taproot signer not found');

    (inputIndexes ?? makeNumberRange(tx.inputsLength)).forEach(index => {
      const input = tx.getInput(index);
      const witnessOutputScript =
        input.witnessUtxo?.script && btc.OutScript.decode(input.witnessUtxo.script);

      if (taprootSigner && witnessOutputScript?.type === 'tr' && !input.tapInternalKey)
        tx.updateInput(index, { ...input, tapInternalKey: taprootSigner.payment.tapInternalKey });
    });
  };
}

export function useSignBitcoinTx() {
  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();
  const signSoftwareTx = useSignBitcoinSoftwareTx();

  /**
   * Don't forget to finalize the tx once it's returned. You can broadcast with
   * the hex value from `tx.hex` TODO: add support for signing specific inputs
   */
  return (psbt: Uint8Array, inputsToSign?: number[]) =>
    whenWallet({
      async ledger() {
        ledgerNavigate.toConnectAndSignBitcoinTransactionStep(psbt);
        return listenForBitcoinTxLedgerSigning(bytesToHex(psbt));
      },
      async software() {
        return signSoftwareTx(psbt, inputsToSign);
      },
    })();
}
