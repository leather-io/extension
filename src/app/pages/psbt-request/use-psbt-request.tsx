import { useMemo, useState } from 'react';

import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

import { finalizePsbt } from '@shared/actions/finalize-psbt';
import { logger } from '@shared/logger';
import { ensureArray, isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { getPsbtPayloadFromToken } from '@app/common/psbt/requests';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';
import { usePsbtRequestSearchParams } from '@app/pages/psbt-request/psbt-request.hooks';

export function usePsbtRequest() {
  const { requestToken, tabId } = usePsbtRequestSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const {
    signPsbtAtIndex,
    getDecodedPsbt,
    nativeSegwitSigner,
    taprootSigner,
    getPsbtAsTransaction,
  } = usePsbtSigner();
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
        finalizePsbt({ requestPayload: requestToken ?? '', tabId, data: 'cancel' });
      },
      onSignPsbt() {
        setIsLoading(true);
        void analytics.track('request_sign_psbt_submit');

        const tx = getPsbtAsTransaction(payload.hex);

        if (!tx) return logger.error('No psbt to sign');

        const indexOrIndexes = payload?.signAtIndex;
        const allowedSighash = payload?.allowedSighash;

        if (!isUndefined(indexOrIndexes) && !isUndefined(allowedSighash)) {
          ensureArray(indexOrIndexes).forEach(idx => signPsbtAtIndex(allowedSighash, idx, tx));
        } else {
          try {
            nativeSegwitSigner?.sign(tx);
          } catch (e1) {
            try {
              taprootSigner?.sign(tx);
            } catch (e2) {
              logger.error('Error signing tx', e1, e2);
            }
          }
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
    nativeSegwitSigner,
    requestToken,
    signPsbtAtIndex,
    tabId,
    taprootSigner,
  ]);
}
