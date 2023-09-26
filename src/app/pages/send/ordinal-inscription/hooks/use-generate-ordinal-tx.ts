import * as btc from '@scure/btc-signer';
import { AddressType, getAddressInfo } from 'bitcoin-address-validation';

import { logger } from '@shared/logger';
import { OrdinalSendFormValues } from '@shared/models/form.model';

import { determineUtxosForSpend } from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { NativeSegwitUtxo, TaprootUtxo } from '@app/query/bitcoin/bitcoin-client';
import { useBitcoinScureLibNetworkConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin-keychain';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { selectInscriptionTransferCoins } from '../coinselect/select-inscription-coins';

export function useGenerateSignedOrdinalTx(inscriptionUtxo: TaprootUtxo | NativeSegwitUtxo) {
  const createTapRootSigner = useCurrentAccountTaprootSigner();
  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const networkMode = useBitcoinScureLibNetworkConfig();
  const { data: nativeSegwitUtxos } = useCurrentNativeSegwitUtxos();

  function coverFeeFromAdditionalUtxos(values: OrdinalSendFormValues) {
    if (getAddressInfo(values.inscription.address).type === AddressType.p2wpkh) {
      return formNsOrdinalTx(values);
    }

    return formTrOrdinalTx(values);
  }

  function formTrOrdinalTx(values: OrdinalSendFormValues) {
    const inscriptionInput = inscriptionUtxo as TaprootUtxo;
    const trSigner = createTapRootSigner?.(inscriptionInput.addressIndex);
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

      // Inscription input
      tx.addInput({
        txid: inscriptionUtxo.txid,
        index: inscriptionUtxo.vout,
        tapInternalKey: trSigner.payment.tapInternalKey,
        sequence: 0,
        witnessUtxo: {
          script: trSigner.payment.script,
          amount: BigInt(inscriptionUtxo.value),
        },
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

      // We know the first is TR and the rest are native segwit
      for (let i = 0; i < tx.inputsLength; i++) {
        if (i === 0) {
          trSigner.signIndex(tx, i);
          continue;
        }
        nativeSegwitSigner.signIndex(tx, i);
      }

      tx.finalize();
      return { hex: tx.hex };
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
      [inscriptionUtxo, ...inputs].forEach(input =>
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
      tx.addOutputAddress(values.recipient, BigInt(inscriptionUtxo.value), networkMode);

      // Recipient and change outputs
      outputs.forEach(output => {
        if (Number(output.value) === 0) return;

        if (!output.address) {
          tx.addOutputAddress(nativeSegwitSigner.address, BigInt(output.value), networkMode);
          return;
        }
        tx.addOutputAddress(values.recipient, BigInt(output.value), networkMode);
      });

      nativeSegwitSigner.sign(tx);
      tx.finalize();

      return { hex: tx.hex };
    } catch (e) {
      logger.error('Unable to sign transaction');
      return null;
    }
  }

  return { coverFeeFromAdditionalUtxos };
}
