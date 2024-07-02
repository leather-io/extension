import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

import { isError } from '@leather.io/utils';

import { finalizePsbt } from '@shared/actions/finalize-psbt';
import { RouteUrls } from '@shared/route-urls';
import { analytics } from '@shared/utils/analytics';

import { usePsbtRequestSearchParams } from '@app/common/psbt/use-psbt-request-params';
import { usePsbtSigner } from '@app/features/psbt-signer/hooks/use-psbt-signer';
import { useGetAssumedZeroIndexSigningConfig } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

export function usePsbtRequest() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { appName, origin, payload, requestToken, signAtIndex, tabId } =
    usePsbtRequestSearchParams();
  const { signPsbt, getRawPsbt, getPsbtAsTransaction } = usePsbtSigner();
  const getDefaultSigningConfig = useGetAssumedZeroIndexSigningConfig();

  return useMemo(() => {
    return {
      appName,
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
      async onSignPsbt() {
        setIsLoading(true);
        void analytics.track('request_sign_psbt_submit');

        const tx = getPsbtAsTransaction(payload.hex);

        try {
          const signingConfig = getDefaultSigningConfig(hexToBytes(payload.hex), signAtIndex);
          const signedTx = await signPsbt({ tx, signingConfig });

          const signedPsbt = signedTx.toPSBT();

          setIsLoading(false);

          finalizePsbt({
            data: { hex: bytesToHex(signedPsbt) },
            requestPayload: requestToken,
            tabId,
          });
        } catch (e) {
          return navigate(RouteUrls.RequestError, {
            state: { message: isError(e) ? e.message : '', title: 'Failed to sign' },
          });
        }
      },
    };
  }, [
    appName,
    signAtIndex,
    isLoading,
    getRawPsbt,
    origin,
    payload.hex,
    requestToken,
    tabId,
    getPsbtAsTransaction,
    signPsbt,
    getDefaultSigningConfig,
    navigate,
  ]);
}
