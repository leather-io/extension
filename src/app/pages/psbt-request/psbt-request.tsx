import { LoadingSpinner } from '@app/components/loading-spinner';
import { PsbtSigner } from '@app/features/psbt-signer/psbt-signer';

import { usePsbtRequest } from './use-psbt-request';

export function PsbtRequest() {
  const { appName, isLoading, decodedPsbt, onSignPsbt, onDenyPsbtSigning } = usePsbtRequest();

  if (isLoading || !decodedPsbt) return <LoadingSpinner height="600px" />;

  return (
    <PsbtSigner
      appName={appName ?? ''}
      psbt={decodedPsbt}
      onSignPsbt={onSignPsbt}
      onCancel={onDenyPsbtSigning}
    />
  );
}
