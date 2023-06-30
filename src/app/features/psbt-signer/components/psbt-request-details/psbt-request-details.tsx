import * as btc from '@scure/btc-signer';

import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

import { useParsedPsbt } from '../../hooks/use-parsed-psbt';
import { RawPsbt } from '../../hooks/use-psbt-signer';
import { PsbtRequestSighashWarningLabel } from '../psbt-request-sighash-warning-label';
import { PsbtInputsAndOutputs } from './components/psbt-inputs-and-outputs/psbt-inputs-and-outputs';
import { PsbtInputsOutputsTotals } from './components/psbt-inputs-outputs-totals/psbt-inputs-outputs-totals';
import { PsbtRequestDetailsHeader } from './components/psbt-request-details-header';
import { PsbtRequestDetailsLayout } from './components/psbt-request-details.layout';
import { PsbtRequestFee } from './components/psbt-request-fee';
import { PsbtRequestRaw } from './components/psbt-request-raw';

function getPsbtTxInputs(psbtTx: btc.Transaction) {
  const inputsLength = psbtTx.inputsLength;
  const inputs: btc.TransactionInput[] = [];
  if (inputsLength === 0) return inputs;
  for (let i = 0; i < inputsLength; i++) {
    inputs.push(psbtTx.getInput(i));
  }
  return inputs;
}

function getPsbtTxOutputs(psbtTx: btc.Transaction) {
  const outputsLength = psbtTx.outputsLength;
  const outputs: btc.TransactionOutput[] = [];
  if (outputsLength === 0) return outputs;
  for (let i = 0; i < outputsLength; i++) {
    outputs.push(psbtTx.getOutput(i));
  }
  return outputs;
}

interface PsbtDecodedRequestProps {
  allowedSighashes?: btc.SignatureHash[];
  inputsToSign?: number | number[];
  psbtRaw: RawPsbt;
  psbtTx: btc.Transaction;
}
export function PsbtRequestDetails({
  allowedSighashes,
  inputsToSign,
  psbtRaw,
  psbtTx,
}: PsbtDecodedRequestProps) {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const inputs = getPsbtTxInputs(psbtTx);
  const outputs = getPsbtTxOutputs(psbtTx);

  const {
    accountInscriptionsBeingTransferred,
    accountInscriptionsBeingReceived,
    addressNativeSegwitTotal,
    addressTaprootTotal,
    fee,
    isPsbtMutable,
    psbtInputs,
    psbtOutputs,
    shouldDefaultToAdvancedView,
  } = useParsedPsbt({ allowedSighashes, inputs, inputsToSign, outputs });
  if (shouldDefaultToAdvancedView) return <PsbtRequestRaw psbt={psbtRaw} />;

  return (
    <PsbtRequestDetailsLayout>
      {isPsbtMutable ? <PsbtRequestSighashWarningLabel /> : null}
      <PsbtRequestDetailsHeader isPsbtMutable={isPsbtMutable} />
      <PsbtInputsOutputsTotals
        accountInscriptionsBeingTransferred={accountInscriptionsBeingTransferred}
        accountInscriptionsBeingReceived={accountInscriptionsBeingReceived}
        addressNativeSegwit={nativeSegwitSigner.address}
        addressTaproot={bitcoinAddressTaproot}
        addressNativeSegwitTotal={addressNativeSegwitTotal}
        addressTaprootTotal={addressTaprootTotal}
      />
      <PsbtInputsAndOutputs
        addressNativeSegwit={nativeSegwitSigner.address}
        addressTaproot={bitcoinAddressTaproot}
        inputs={psbtInputs}
        outputs={psbtOutputs}
      />
      <PsbtRequestRaw psbt={psbtRaw} />
      <PsbtRequestFee fee={fee} />
    </PsbtRequestDetailsLayout>
  );
}
