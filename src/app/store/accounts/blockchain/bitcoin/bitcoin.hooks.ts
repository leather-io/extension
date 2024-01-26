import { PaymentTypes } from '@btckit/types';
import { bytesToHex } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import { Psbt } from 'bitcoinjs-lib';
import AppClient from 'ledger-bitcoin';

import { getBitcoinJsLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import {
  extractAddressIndexFromPath,
  getInputPaymentType,
  getTaprootAddress,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootAccountDerivationPath } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { getNativeSegwitAccountDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';
import {
  BitcoinInputSigningConfig,
  getAssumedZeroIndexSigningConfig,
} from '@shared/crypto/bitcoin/signer-config';
import { allSighashTypes } from '@shared/rpc/methods/sign-psbt';
import { isNumber } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
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
  useUpdateLedgerSpecificNativeSegwitBip32DerivationForAdddressIndexZero,
  useUpdateLedgerSpecificNativeSegwitUtxoHexForAdddressIndexZero,
} from './native-segwit-account.hooks';
import {
  useCurrentTaprootAccount,
  useUpdateLedgerSpecificTaprootInputPropsForAdddressIndexZero,
} from './taproot-account.hooks';

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

function useSignBitcoinSoftwareTx() {
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();

  return async (psbt: Uint8Array, inputSigningConfig: BitcoinInputSigningConfig[]) => {
    const tx = btc.Transaction.fromPSBT(psbt);

    inputSigningConfig.forEach(({ index, derivationPath }) => {
      const nativeSegwitSigner = createNativeSegwitSigner?.(
        extractAddressIndexFromPath(derivationPath)
      );
      const taprootSigner = createTaprootSigner?.(extractAddressIndexFromPath(derivationPath));

      if (!nativeSegwitSigner || !taprootSigner) throw new Error('Signers not available');

      // See #4628.
      // Our API doesn't support users specifying which key they want to sign
      // with. Until we support this, we sign with both, as in some cases, e.g.
      // Asigna, the Native Segwit key is used to sign a multisig taproot input
      try {
        nativeSegwitSigner.signIndex(tx, index, allSighashTypes);
      } catch (e) {
        try {
          taprootSigner.signIndex(tx, index, allSighashTypes);
        } catch (er) {}
      }
    });

    return tx;
  };
}

export function useSignLedgerBitcoinTx() {
  const accountIndex = useCurrentAccountIndex();
  const network = useCurrentNetwork();

  const addNativeSegwitUtxoHexLedgerProps =
    useUpdateLedgerSpecificNativeSegwitUtxoHexForAdddressIndexZero();

  const addNativeSegwitBip32Derivation =
    useUpdateLedgerSpecificNativeSegwitBip32DerivationForAdddressIndexZero();

  const updateTaprootLedgerInputs = useUpdateLedgerSpecificTaprootInputPropsForAdddressIndexZero();

  return async (
    app: AppClient,
    rawPsbt: Uint8Array,
    signingConfig: BitcoinInputSigningConfig[]
  ) => {
    const fingerprint = await app.getMasterFingerprint();

    // BtcSigner not compatible with Ledger. Encoded format returns more terse
    // version. BitcoinJsLib works.
    const psbt = Psbt.fromBuffer(Buffer.from(rawPsbt), {
      network: getBitcoinJsLibNetworkConfigByMode(network.chain.bitcoin.bitcoinNetwork),
    });

    const btcSignerPsbtClone = btc.Transaction.fromPSBT(psbt.toBuffer());

    const inputByPaymentType = signingConfig.map(config => [
      config,
      getInputPaymentType(
        config.index,
        btcSignerPsbtClone.getInput(config.index),
        network.chain.bitcoin.bitcoinNetwork
      ),
    ]) as readonly [BitcoinInputSigningConfig, PaymentTypes][];

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

      // Without adding the full non-witness data, the Ledger will present a
      // warning. In some cases, e.g. bip322, the original witness data doesn't
      // exist, and we want the user to proceed, despite the warning.
      try {
        await addNativeSegwitUtxoHexLedgerProps(psbt, nativeSegwitInputsToSign);
      } catch (e) {}

      await addNativeSegwitBip32Derivation(psbt, fingerprint, nativeSegwitInputsToSign);

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
  const analytics = useAnalytics();
  return (tx: btc.Transaction, inputIndexes: BitcoinInputSigningConfig[]) =>
    inputIndexes.forEach(({ index, derivationPath }) => {
      const taprootSigner = createTaprootSigner?.(extractAddressIndexFromPath(derivationPath));
      if (!taprootSigner) throw new Error('Taproot signer not found');
      const input = tx.getInput(index);

      const witnessOutputScript =
        input.witnessUtxo?.script && btc.OutScript.decode(input.witnessUtxo.script);

      if (taprootSigner && witnessOutputScript?.type === 'tr' && !input.tapInternalKey) {
        void analytics.track('psbt_sign_request_p2tr_missing_taproot_internal_key');
        tx.updateInput(index, { ...input, tapInternalKey: taprootSigner.payment.tapInternalKey });
      }
    });
}

export function useGetAssumedZeroIndexSigningConfig() {
  const network = useCurrentNetwork();
  const accountIndex = useCurrentAccountIndex();

  return (psbt: Uint8Array, indexesToSign?: number[]) =>
    getAssumedZeroIndexSigningConfig({
      psbt,
      network: network.chain.bitcoin.bitcoinNetwork,
      indexesToSign,
    }).forAccountIndex(accountIndex);
}

export function useSignBitcoinTx() {
  const { whenWallet } = useWalletType();
  const ledgerNavigate = useLedgerNavigate();
  const signSoftwareTx = useSignBitcoinSoftwareTx();
  const getDefaultSigningConfig = useGetAssumedZeroIndexSigningConfig();

  /**
   * Bitcoin signing function. Don't forget to finalize the tx once it's
   * returned. You can broadcast with the hex value from `tx.hex`.
   */
  return (psbt: Uint8Array, inputsToSign?: BitcoinInputSigningConfig[] | number[]) => {
    function getSigningConfig(inputsToSign?: BitcoinInputSigningConfig[] | number[]) {
      if (!inputsToSign) return getDefaultSigningConfig(psbt);
      if (inputsToSign.every(isNumber)) return getDefaultSigningConfig(psbt, inputsToSign);
      return inputsToSign;
    }

    return whenWallet({
      async ledger() {
        // Because Ledger signing is a multi-step process that takes place over
        // many routes, in order to achieve a consistent API between
        // Ledger/software, we subscribe to the event that occurs when the
        // unsigned tx is signed
        ledgerNavigate.toConnectAndSignBitcoinTransactionStep(psbt, getSigningConfig(inputsToSign));
        return listenForBitcoinTxLedgerSigning(bytesToHex(psbt));
      },
      async software() {
        return signSoftwareTx(psbt, getSigningConfig(inputsToSign));
      },
    })();
  };
}
