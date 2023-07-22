import { LoadingSpinner } from '@app/components/loading-spinner';
import { PsbtSigner } from '@app/features/psbt-signer/psbt-signer';

import { usePsbtRequest } from './use-psbt-request';

export function PsbtRequest() {
  const {
    allowedSighash,
    appName,
    indexesToSign,
    isLoading,
    onSignPsbt,
    onDenyPsbtSigning,
    origin,
    psbtHex,
  } = usePsbtRequest();

  if (isLoading) return <LoadingSpinner height="600px" />;

  return (
    <PsbtSigner
      allowedSighash={allowedSighash}
      name={appName ?? ''}
      indexesToSign={indexesToSign}
      origin={origin ?? ''}
      onSignPsbt={onSignPsbt}
      onCancel={onDenyPsbtSigning}
      psbtHex={psbtHex}
    />
  );
}
