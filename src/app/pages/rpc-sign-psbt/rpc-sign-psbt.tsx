import { RpcErrorCode } from '@btckit/types';
import { bytesToHex } from '@noble/hashes/utils';

import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { isDefined } from '@shared/utils';

import { useRpcSignPsbtParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';
import { PsbtSigner } from '@app/features/psbt-signer/psbt-signer';

function useRpcSignPsbt() {
  const { origin, tabId, requestId, psbtHex, allowedSighash, signAtIndex } = useRpcSignPsbtParams();
  const { signPsbt, signPsbtAtIndex, getDecodedPsbt, getPsbtAsTransaction } = usePsbtSigner();

  const tx = getPsbtAsTransaction(psbtHex);

  return {
    origin,
    get decodedPsbt() {
      return getDecodedPsbt(psbtHex);
    },
    onSignPsbt() {
      if (isDefined(signAtIndex)) {
        signAtIndex.forEach(idx => {
          signPsbtAtIndex(idx, tx, allowedSighash);
        });
      } else {
        signPsbt(tx);
      }
      const psbt = tx.toPSBT();

      chrome.tabs.sendMessage(
        tabId,
        makeRpcSuccessResponse('signPsbt', { id: requestId, result: { hex: bytesToHex(psbt) } })
      );
      window.close();
    },
    onCancel() {
      chrome.tabs.sendMessage(
        tabId,
        makeRpcErrorResponse('signPsbt', {
          id: requestId,
          error: {
            message: 'User denied signing',
            code: RpcErrorCode.USER_REJECTION,
          },
        })
      );
      window.close();
    },
  };
}

export function RpcSignPsbt() {
  const { origin, decodedPsbt, onSignPsbt, onCancel } = useRpcSignPsbt();
  if (!decodedPsbt) return null;
  return (
    <PsbtSigner appName={origin} onSignPsbt={onSignPsbt} onCancel={onCancel} psbt={decodedPsbt} />
  );
}
