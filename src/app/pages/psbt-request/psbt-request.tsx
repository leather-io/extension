import { LoadingSpinner } from '@app/components/loading-spinner';
import { PsbtSigner } from '@app/features/psbt-signer/psbt-signer';

import { usePsbtRequest } from './use-psbt-request';

export function PsbtRequest() {
  const {
    appName,
    isLoading,
    decodedPsbt,
    onSignPsbt,
    onDenyPsbtSigning,
    origin,
    psbtPayload,
    tx,
  } = usePsbtRequest();

  if (isLoading || !decodedPsbt) return <LoadingSpinner height="600px" />;

  return (
    <PsbtSigner
      allowedSighashes={psbtPayload.allowedSighash}
      name={appName ?? ''}
      inputsToSign={psbtPayload.signAtIndex}
      origin={origin ?? ''}
      onSignPsbt={onSignPsbt}
      onCancel={onDenyPsbtSigning}
      psbtRaw={decodedPsbt}
      psbtTx={tx}
    />
  );
}
