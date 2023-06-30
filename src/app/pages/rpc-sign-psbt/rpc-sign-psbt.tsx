import { useNavigate } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import { bytesToHex } from '@noble/hashes/utils';

import { RouteUrls } from '@shared/route-urls';
import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { isDefined } from '@shared/utils';

import { useRpcSignPsbtParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';
import { PsbtSigner } from '@app/features/psbt-signer/psbt-signer';

function useRpcSignPsbt() {
  const navigate = useNavigate();
  const { origin, tabId, requestId, psbtHex, allowedSighash, signAtIndex } = useRpcSignPsbtParams();
  const { signPsbt, signPsbtAtIndex, getDecodedPsbt, getPsbtAsTransaction } = usePsbtSigner();

  if (!requestId || !psbtHex || !origin) throw new Error('Invalid params');

  const tx = getPsbtAsTransaction(psbtHex);

  return {
    allowedSighashes: allowedSighash,
    inputsToSign: signAtIndex,
    origin,
    tx,
    get decodedPsbt() {
      try {
        return getDecodedPsbt(psbtHex);
      } catch (e) {
        return navigate(RouteUrls.RequestError, {
          state: { message: e instanceof Error ? e.message : '', title: 'Failed request' },
        });
      }
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
  const { allowedSighashes, origin, decodedPsbt, inputsToSign, onSignPsbt, onCancel, tx } =
    useRpcSignPsbt();
  if (!decodedPsbt) return null;
  return (
    <PsbtSigner
      allowedSighashes={allowedSighashes}
      inputsToSign={inputsToSign}
      origin={origin}
      onSignPsbt={onSignPsbt}
      onCancel={onCancel}
      psbtRaw={decodedPsbt}
      psbtTx={tx}
    />
  );
}
