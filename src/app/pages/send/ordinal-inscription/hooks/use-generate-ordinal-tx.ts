import { useCallback } from 'react';

import * as btc from '@scure/btc-signer';
import { AddressType, getAddressInfo } from 'bitcoin-address-validation';
import { Psbt } from 'bitcoinjs-lib';

import { getBitcoinJsLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { logger } from '@shared/logger';
import { OrdinalSendFormValues } from '@shared/models/form.model';

import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { TaprootUtxo } from '@app/query/bitcoin/bitcoin-client';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { selectInscriptionTransferCoins } from '../coinselect/select-inscription-coins';

export function useGenerateUnsignedOrdinalTx(trInput: TaprootUtxo) {
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const networkMode = useBitcoinScureLibNetworkConfig();
  const { data: nativeSegwitUtxos } = useCurrentNativeSegwitUtxos();
  const network = useCurrentNetwork();

  function coverFeeFromAdditionalUtxos(values: OrdinalSendFormValues) {
    if (getAddressInfo(values.inscription.address).type === AddressType.p2wpkh) {
      return formNsOrdinalTx(values);
    }

    return formTrOrdinalTx(values);
  }

  function formTrOrdinalTx(values: OrdinalSendFormValues) {
    const inscriptionInput = trInput;
    const trSigner = createTaprootSigner?.(inscriptionInput.addressIndex);
    const nativeSegwitSigner = createNativeSegwitSigner?.(0);

    if (!trSigner || !nativeSegwitSigner || !nativeSegwitUtxos || !values.feeRate) return;

    const result = selectInscriptionTransferCoins({
      recipient: values.recipient,
      inscriptionInput,
      nativeSegwitUtxos,
      changeAddress: nativeSegwitSigner.payment.address!,
      feeRate: values.feeRate,
    });

    if (!result.success) return null;

    const { inputs, outputs } = result;

    try {
      const tx = new btc.Transaction();
      const psbt = new Psbt({
        network: getBitcoinJsLibNetworkConfigByMode(network.chain.bitcoin.network),
      });

      psbt.addInput({
        hash: trInput.txid,
        index: trInput.vout,
        tapInternalKey: Buffer.from(trSigner.payment.tapInternalKey),
        sequence: 0,
        witnessUtxo: {
          script: Buffer.from(trSigner.payment.script),
          value: Number(trInput.value),
        },
        tapBip32Derivation: [],
      });

      // Inscription input
      tx.addInput({
        txid: trInput.txid,
        index: trInput.vout,
        tapInternalKey: trSigner.payment.tapInternalKey,
        sequence: 0,
        witnessUtxo: {
          script: trSigner.payment.script,
          amount: BigInt(trInput.value),
        },
        // bip32Derivation: [0, { '0': trSigner.payment.tapInternalKey }],
      });

      // Fee-covering Native Segwit inputs
      inputs.forEach(input =>
        tx.addInput({
          txid: input.txid,
          index: input.vout,
          sequence: 0,
          witnessUtxo: {
            amount: BigInt(input.value),
            script: nativeSegwitSigner.payment.script,
          },
        })
      );

      // Recipient and change outputs
      outputs.forEach(output => tx.addOutputAddress(output.address, output.value, networkMode));

      tx.toPSBT();

      return { hex: tx.hex, psbt: tx.toPSBT() };
    } catch (e) {
      logger.error('Unable to sign transaction');
      return null;
    }
  }

  function formNsOrdinalTx(values: OrdinalSendFormValues) {
    const nativeSegwitSigner = createNativeSegwitSigner?.(0);
    const { feeRate, recipient } = values;
    if (!nativeSegwitSigner || !nativeSegwitUtxos || !values.feeRate) return;

    const determineUtxosArgs = {
      amount: 0,
      feeRate,
      recipient,
      utxos: nativeSegwitUtxos,
    };

    const { inputs, outputs } = determineUtxosForSpend(determineUtxosArgs);

    try {
      const tx = new btc.Transaction();

      // Fee-covering Native Segwit inputs
      [trInput, ...inputs].forEach(input =>
        tx.addInput({
          txid: input.txid,
          index: input.vout,
          sequence: 0,
          witnessUtxo: {
            amount: BigInt(input.value),
            script: nativeSegwitSigner.payment.script,
          },
        })
      );

      // Inscription output
      tx.addOutputAddress(values.recipient, BigInt(trInput.value), networkMode);

      // Recipient and change outputs
      outputs.forEach(output => {
        if (Number(output.value) === 0) return;

        if (!output.address) {
          tx.addOutputAddress(nativeSegwitSigner.address, BigInt(output.value), networkMode);
          return;
        }
        tx.addOutputAddress(values.recipient, BigInt(output.value), networkMode);
      });

      return { hex: tx.hex, psbt: tx.toPSBT() };
    } catch (e) {
      logger.error('Unable to sign transaction');
      return null;
    }
  }

  return { coverFeeFromAdditionalUtxos };
}

export function useSignOrdinalsSoftwareWalletTx(trAddressInput: number) {
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();

  return useCallback(
    (tx: btc.Transaction) => {
      const trSigner = createTaprootSigner?.(trAddressInput);
      const nativeSegwitSigner = createNativeSegwitSigner?.(0);

      if (!trSigner || !nativeSegwitSigner) return;

      // We know the first is TR and the rest are native segwit
      for (let i = 0; i < tx.inputsLength; i++) {
        if (i === 0) {
          trSigner.signIndex(tx, i);
          continue;
        }
        nativeSegwitSigner.signIndex(tx, i);
      }
    },
    [createNativeSegwitSigner, createTaprootSigner, trAddressInput]
  );
}
