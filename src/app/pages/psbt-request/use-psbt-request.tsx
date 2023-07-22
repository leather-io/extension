import { useMemo, useState } from 'react';

import { bytesToHex } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';

import { finalizePsbt } from '@shared/actions/finalize-psbt';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { usePsbtRequestSearchParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';

export function usePsbtRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useAnalytics();
  const { allowedSighash, appName, origin, payload, requestToken, signAtIndex, tabId } =
    usePsbtRequestSearchParams();
  const { signPsbt, getRawPsbt, getPsbtAsTransaction } = usePsbtSigner();

  return useMemo(() => {
    return {
      appName,
      allowedSighash,
      indexesToSign: signAtIndex,
      isLoading,
      getRawPsbt,
      origin,
      psbtHex: payload.hex,
      onDenyPsbtSigning() {
        void analytics.track('request_psbt_cancel');
        finalizePsbt({
          data: 'PSBT request was canceled',
          requestPayload: requestToken,
          tabId,
        });
      },
      onSignPsbt(inputs: btc.TransactionInput[]) {
        setIsLoading(true);
        void analytics.track('request_sign_psbt_submit');

        const tx = getPsbtAsTransaction(payload.hex);

        signPsbt({ allowedSighash, indexesToSign: signAtIndex, inputs, tx });

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
    allowedSighash,
    analytics,
    appName,
    getRawPsbt,
    getPsbtAsTransaction,
    isLoading,
    origin,
    payload.hex,
    requestToken,
    signAtIndex,
    signPsbt,
    tabId,
  ]);
}
