import { useNavigate } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';

import { RouteUrls } from '@shared/route-urls';
import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { useRpcSignPsbtParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';

export function useRpcSignPsbt() {
  const navigate = useNavigate();
  const { origin, tabId, requestId, psbtHex, allowedSighash, signAtIndex } = useRpcSignPsbtParams();
  const { signPsbt, getPsbtAsTransaction } = usePsbtSigner();

  if (!requestId || !psbtHex || !origin) throw new Error('Invalid params');

  return {
    allowedSighash,
    indexesToSign: signAtIndex,
    origin,
    psbtHex,
    onSignPsbt(inputs: btc.TransactionInput[]) {
      const tx = getPsbtAsTransaction(psbtHex);

      try {
        signPsbt({ allowedSighash, indexesToSign: signAtIndex, inputs, tx });
      } catch (e) {
        return navigate(RouteUrls.RequestError, {
          state: { message: e instanceof Error ? e.message : '', title: 'Failed to sign' },
        });
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
