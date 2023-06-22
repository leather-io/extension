import { useMemo, useState } from 'react';

import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

import { finalizePsbt } from '@shared/actions/finalize-psbt';
import { ensureArray, isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { getPsbtPayloadFromToken } from '@app/common/psbt/requests';
import { usePsbtRequestSearchParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';

export function usePsbtRequest() {
  const { requestToken, tabId } = usePsbtRequestSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { signPsbt, signPsbtAtIndex, getDecodedPsbt, getPsbtAsTransaction } = usePsbtSigner();
  const analytics = useAnalytics();
  return useMemo(() => {
    if (!requestToken) throw new Error('Cannot decode psbt without request token');

    const payload = getPsbtPayloadFromToken(requestToken);
    const payloadTxBytes = hexToBytes(payload.hex);
    const appName = payload?.appDetails?.name;

    return {
      appName,
      isLoading,
      psbtPayload: payload,
      getDecodedPsbt,
      get decodedPsbt() {
        return getDecodedPsbt(payload.hex);
      },
      tx: getPsbtAsTransaction(payload.hex),
      payloadTxBytes,
      onDenyPsbtSigning() {
        void analytics.track('request_psbt_cancel');
        finalizePsbt({ requestPayload: requestToken, tabId, data: 'PSBT request was canceled' });
      },
      onSignPsbt() {
        setIsLoading(true);
        void analytics.track('request_sign_psbt_submit');

        const tx = getPsbtAsTransaction(payload.hex);

        const indexOrIndexes = payload?.signAtIndex;
        const allowedSighash = payload?.allowedSighash;

        if (!isUndefined(indexOrIndexes)) {
          ensureArray(indexOrIndexes).forEach(idx => signPsbtAtIndex(idx, tx, allowedSighash));
        } else {
          signPsbt(tx);
        }

        const psbt = tx.toPSBT();

        setIsLoading(false);

        if (!requestToken) return;

        finalizePsbt({
          requestPayload: requestToken,
          tabId,
          data: { hex: bytesToHex(psbt) },
        });
      },
    };
  }, [
    analytics,
    getDecodedPsbt,
    getPsbtAsTransaction,
    isLoading,
    requestToken,
    signPsbt,
    signPsbtAtIndex,
    tabId,
  ]);
}
