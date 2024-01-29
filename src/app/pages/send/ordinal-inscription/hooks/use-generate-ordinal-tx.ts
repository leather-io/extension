import * as btc from '@scure/btc-signer';
import { AddressType, getAddressInfo } from 'bitcoin-address-validation';

import { extractAddressIndexFromPath } from '@shared/crypto/bitcoin/bitcoin.utils';
import { BitcoinInputSigningConfig } from '@shared/crypto/bitcoin/signer-config';
import { logger } from '@shared/logger';
import { OrdinalSendFormValues } from '@shared/models/form.model';

import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { createCounter } from '@app/common/utils/counter';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { UtxoWithDerivationPath } from '@app/query/bitcoin/bitcoin-client';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { selectInscriptionTransferCoins } from '../coinselect/select-inscription-coins';

export function useGenerateUnsignedOrdinalTx(inscriptionInput: UtxoWithDerivationPath) {
  const createTaprootSigner = useCurrentAccountTaprootSigner();
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const networkMode = useBitcoinScureLibNetworkConfig();
  const { data: nativeSegwitUtxos } = useCurrentNativeSegwitUtxos();

  function coverFeeFromAdditionalUtxos(values: OrdinalSendFormValues) {
    if (getAddressInfo(values.inscription.address).type === AddressType.p2wpkh) {
      return formNativeSegwitOrdinalTx(values);
    }

    return formTaprootOrdinalTx(values);
  }

  function formTaprootOrdinalTx(values: OrdinalSendFormValues) {
    const addressIndex = extractAddressIndexFromPath(inscriptionInput.derivationPath);
    const taprootSigner = createTaprootSigner?.(addressIndex);
    const nativeSegwitSigner = createNativeSegwitSigner?.(0);

    if (!taprootSigner || !nativeSegwitSigner || !nativeSegwitUtxos || !values.feeRate) return;

    const result = selectInscriptionTransferCoins({
      recipient: values.recipient,
      inscriptionInput,
      nativeSegwitUtxos,
      changeAddress: nativeSegwitSigner.payment.address!,
      feeRate: values.feeRate,
    });

    const psbtInputCounter = createCounter();

    const signingConfig: BitcoinInputSigningConfig[] = [];

    if (!result.success) return null;

    const { inputs, outputs } = result;

    try {
      const tx = new btc.Transaction();

      // Inscription input
      tx.addInput({
        txid: inscriptionInput.txid,
        index: inscriptionInput.vout,
        tapInternalKey: taprootSigner.payment.tapInternalKey,
        sequence: 0,
        witnessUtxo: {
          script: taprootSigner.payment.script,
          amount: BigInt(inscriptionInput.value),
        },
      });
      signingConfig.push({
        derivationPath: taprootSigner.derivationPath,
        index: psbtInputCounter.getValue(),
      });
      psbtInputCounter.increment();

      // Fee-covering Native Segwit inputs
      inputs.forEach(input => {
        tx.addInput({
          txid: input.txid,
          index: input.vout,
          sequence: 0,
          witnessUtxo: {
            amount: BigInt(input.value),
            script: nativeSegwitSigner.payment.script,
          },
        });
        signingConfig.push({
          derivationPath: nativeSegwitSigner.derivationPath,
          index: psbtInputCounter.getValue(),
        });
        psbtInputCounter.increment();
      });

      // Recipient and change outputs
      outputs.forEach(output => tx.addOutputAddress(output.address, output.value, networkMode));

      tx.toPSBT();

      return { psbt: tx.toPSBT(), signingConfig };
    } catch (e) {
      logger.error('Unable to sign transaction');
      return null;
    }
  }

  function formNativeSegwitOrdinalTx(values: OrdinalSendFormValues) {
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
      [inscriptionInput, ...inputs].forEach(input =>
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
      tx.addOutputAddress(values.recipient, BigInt(inscriptionInput.value), networkMode);

      // Recipient and change outputs
      outputs.forEach(output => {
        if (Number(output.value) === 0) return;

        if (!output.address) {
          tx.addOutputAddress(nativeSegwitSigner.address, BigInt(output.value), networkMode);
          return;
        }
        tx.addOutputAddress(values.recipient, BigInt(output.value), networkMode);
      });

      return { psbt: tx.toPSBT(), signingConfig: undefined };
    } catch (e) {
      logger.error('Unable to sign transaction');
      return null;
    }
  }

  return { coverFeeFromAdditionalUtxos };
}
