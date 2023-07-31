import { PsbtSigner } from '@app/features/psbt-signer/psbt-signer';

import { useRpcSignPsbt } from './use-rpc-sign-psbt';

export function RpcSignPsbt() {
  const { allowedSighash, indexesToSign, isBroadcasting, onSignPsbt, onCancel, origin, psbtHex } =
    useRpcSignPsbt();

  return (
    <PsbtSigner
      allowedSighash={allowedSighash}
      indexesToSign={indexesToSign}
      isBroadcasting={isBroadcasting}
      origin={origin}
      onSignPsbt={onSignPsbt}
      onCancel={onCancel}
      psbtHex={psbtHex}
    />
  );
}
