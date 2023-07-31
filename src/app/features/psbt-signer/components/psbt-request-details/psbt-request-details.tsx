import * as btc from '@scure/btc-signer';

import { AllowedSighashTypes } from '@shared/rpc/methods/sign-psbt';

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

interface PsbtRequestDetailsProps {
  allowedSighash?: AllowedSighashTypes[];
  indexesToSign?: number[];
  psbtRaw?: RawPsbt;
  psbtTxInputs: btc.TransactionInput[];
  psbtTxOutputs: btc.TransactionOutput[];
}
export function PsbtRequestDetails({
  allowedSighash,
  indexesToSign,
  psbtRaw,
  psbtTxInputs,
  psbtTxOutputs,
}: PsbtRequestDetailsProps) {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();

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
  } = useParsedPsbt({
    allowedSighash,
    inputs: psbtTxInputs,
    indexesToSign,
    outputs: psbtTxOutputs,
  });
  if (shouldDefaultToAdvancedView && psbtRaw) return <PsbtRequestRaw psbt={psbtRaw} />;

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
      <PsbtInputsAndOutputs inputs={psbtInputs} outputs={psbtOutputs} />
      {psbtRaw ? <PsbtRequestRaw psbt={psbtRaw} /> : null}
      <PsbtRequestFee fee={fee} />
    </PsbtRequestDetailsLayout>
  );
}
