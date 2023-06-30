import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

import { finalizePsbt } from '@shared/actions/finalize-psbt';
import { RouteUrls } from '@shared/route-urls';
import { ensureArray, isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { getPsbtPayloadFromToken } from '@app/common/psbt/requests';
import { usePsbtRequestSearchParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';

export function usePsbtRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { origin, requestToken, tabId } = usePsbtRequestSearchParams();

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
      getDecodedPsbt,
      origin,
      psbtPayload: payload,
      get decodedPsbt() {
        try {
          return getDecodedPsbt(payload.hex);
        } catch (e) {
          return navigate(RouteUrls.RequestError, {
            state: { message: e instanceof Error ? e.message : '', title: 'Failed request' },
          });
        }
      },
      tx: getPsbtAsTransaction(payload.hex),
      payloadTxBytes,
      onDenyPsbtSigning() {
        void analytics.track('request_psbt_cancel');
        finalizePsbt({
          data: 'PSBT request was canceled',
          requestPayload: requestToken,
          tabId,
        });
      },
      onSignPsbt() {
        setIsLoading(true);
        void analytics.track('request_sign_psbt_submit');

        const tx = getPsbtAsTransaction(payload.hex);

        const indexOrIndexes = payload?.signAtIndex;
        const allowedSighash = payload?.allowedSighash;

        try {
          if (!isUndefined(indexOrIndexes)) {
            ensureArray(indexOrIndexes).forEach(idx => signPsbtAtIndex(idx, tx, allowedSighash));
          } else {
            signPsbt(tx);
          }
        } catch (e) {
          return navigate(RouteUrls.RequestError, {
            state: { message: e instanceof Error ? e.message : '', title: 'Failed to sign' },
          });
        }

        const psbt = tx.toPSBT();

        setIsLoading(false);

        finalizePsbt({
          data: { hex: bytesToHex(psbt) },
          requestPayload: requestToken,
          tabId,
        });
      },
    };
  }, [
    analytics,
    getDecodedPsbt,
    getPsbtAsTransaction,
    isLoading,
    navigate,
    origin,
    requestToken,
    signPsbt,
    signPsbtAtIndex,
    tabId,
  ]);
}
