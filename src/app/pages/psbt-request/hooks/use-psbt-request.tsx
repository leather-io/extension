import { useCallback, useState } from 'react';

import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import { PsbtPayload } from '@stacks/connect';

import { finalizePsbt } from '@shared/actions/finalize-psbt';
import { logger } from '@shared/logger';
import { isNumber, isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { getPsbtPayloadFromToken } from '@app/common/psbt/requests';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { usePsbtRequestSearchParams } from '@app/store/psbts/requests.hooks';

export function usePsbtRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [psbtPayload, setPsbtPayload] = useState<PsbtPayload>();
  const [tx, setTx] = useState<btc.Transaction>();
  const analytics = useAnalytics();
  const { requestToken, tabId } = usePsbtRequestSearchParams();

  const createNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const createTaprootSigner = useCurrentAccountTaprootSigner();

  const nativeSegwitSigner = createNativeSegwitSigner?.(0);
  const taprootSigner = createTaprootSigner?.(0);

  useOnMount(() => {
    if (!requestToken) return;
    const payload = getPsbtPayloadFromToken(requestToken);
    setPsbtPayload(payload);

    const payloadTxBytes = hexToBytes(payload.hex);
    const tx = btc.Transaction.fromPSBT(payloadTxBytes);
    setTx(tx);

    return () => {
      setPsbtPayload(undefined);
      setTx(undefined);
    };
  });

  const getDecodedPsbt = useCallback(() => {
    if (!psbtPayload || !tx) return;

    try {
      return btc.RawPSBTV0.decode(hexToBytes(psbtPayload.hex));
    } catch (e0) {
      try {
        return btc.RawPSBTV2.decode(hexToBytes(psbtPayload.hex));
      } catch (e2) {
        logger.error('Error parsing psbt version', e0);
      }
    }
    return;
  }, [psbtPayload, tx]);

  const onCancel = useCallback(() => {
    void analytics.track('request_psbt_cancel');
    finalizePsbt({ requestPayload: requestToken ?? '', tabId, data: 'cancel' });
  }, [analytics, requestToken, tabId]);

  const signPsbtAtIndex = useCallback(
    (allowedSighash: btc.SignatureHash[], idx: number, tx: btc.Transaction) => {
      try {
        nativeSegwitSigner?.signIndex(tx, idx, allowedSighash);
      } catch (e1) {
        try {
          taprootSigner?.signIndex(tx, idx, allowedSighash);
        } catch (e2) {
          logger.error('Error signing tx at provided index', e1, e2);
        }
      }
    },
    [nativeSegwitSigner, taprootSigner]
  );

  const onSignPsbt = useCallback(() => {
    setIsLoading(true);
    void analytics.track('request_sign_psbt_submit');

    if (!tx) return logger.error('No psbt to sign');

    const indexOrIndexes = psbtPayload?.signAtIndex;
    const allowedSighash = psbtPayload?.allowedSighash;

    if (!isUndefined(indexOrIndexes) && !isUndefined(allowedSighash)) {
      if (Array.isArray(indexOrIndexes) && indexOrIndexes.length) {
        indexOrIndexes.map(idx => {
          signPsbtAtIndex(allowedSighash, idx, tx);
        });
      }
      if (isNumber(indexOrIndexes)) {
        signPsbtAtIndex(allowedSighash, indexOrIndexes, tx);
      }
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
  }, [
    analytics,
    nativeSegwitSigner,
    psbtPayload?.allowedSighash,
    psbtPayload?.signAtIndex,
    requestToken,
    signPsbtAtIndex,
    tabId,
    taprootSigner,
    tx,
  ]);

  const appName = psbtPayload?.appDetails?.name;
  const decodedPsbt = getDecodedPsbt();

  return {
    appName,
    decodedPsbt,
    isLoading,
    onCancel,
    onSignPsbt,
    psbtPayload,
    requestToken,
  };
}
