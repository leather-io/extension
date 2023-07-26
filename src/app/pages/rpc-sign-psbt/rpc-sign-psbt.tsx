import { PsbtSigner } from '@app/features/psbt-signer/psbt-signer';

import { useRpcSignPsbt } from './use-rpc-sign-psbt';

export function RpcSignPsbt() {
  const { allowedSighash, indexesToSign, onSignPsbt, onCancel, origin, psbtHex } = useRpcSignPsbt();

  return (
    <PsbtSigner
      allowedSighash={allowedSighash}
      indexesToSign={indexesToSign}
      origin={origin}
      onSignPsbt={onSignPsbt}
      onCancel={onCancel}
      psbtHex={psbtHex}
    />
  );
}
