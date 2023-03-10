import { useState } from 'react';

import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import * as btc from '@scure/btc-signer';
import { PsbtPayload } from '@stacks/connect';

import { finalizePsbt } from '@shared/actions/finalize-psbt';
import { logger } from '@shared/logger';
import { isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { getPsbtPayloadFromToken } from '@app/common/psbt/requests';
import {
  useSignBitcoinNativeSegwitInputAtIndex,
  useSignBitcoinNativeSegwitTx,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import {
  useSignBitcoinTaprootInputAtIndex,
  useSignBitcoinTaprootTx,
} from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { usePsbtRequestSearchParams } from '@app/store/psbts/requests.hooks';

export function usePsbtRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [psbtPayload, setPsbtPayload] = useState<PsbtPayload>();
  const [tx, setTx] = useState<btc.Transaction>();
  const analytics = useAnalytics();
  const { requestToken, tabId } = usePsbtRequestSearchParams();
  const signNativeSegwitTxAtIndex = useSignBitcoinNativeSegwitInputAtIndex();
  const signNativeSegwitTx = useSignBitcoinNativeSegwitTx();
  const signTaprootTxAtIndex = useSignBitcoinTaprootInputAtIndex();
  const signTaprootTx = useSignBitcoinTaprootTx();

  useOnMount(() => {
    if (!requestToken) return;
    const payload = getPsbtPayloadFromToken(requestToken);
    setPsbtPayload(payload);

    const payloadTxBytes = hexToBytes(payload.hex);
    const tx = btc.Transaction.fromPSBT(payloadTxBytes);
    setTx(tx);
  });

  const getPsbtDetails = () => {
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
  };

  const onCancel = () => {
    void analytics.track('request_psbt_cancel');
    finalizePsbt({ requestPayload: requestToken ?? '', tabId, data: 'cancel' });
  };

  const onSignPsbt = async () => {
    setIsLoading(true);
    void analytics.track('request_sign_psbt_submit');

    if (!tx) return logger.error('No psbt to sign');

    const indexes = psbtPayload?.signAtIndex;
    const allowedSighash = psbtPayload?.allowedSighash;

    if (!isUndefined(indexes) && indexes.length) {
      indexes.map(idx => {
        try {
          signNativeSegwitTxAtIndex({ allowedSighash, idx, tx });
        } catch (e1) {
          try {
            signTaprootTxAtIndex({ allowedSighash, idx, tx });
          } catch (e2) {
            logger.error('Error signing tx at provided index', e1, e2);
          }
        }
      });
    } else {
      try {
        signNativeSegwitTx(tx);
      } catch (e1) {
        try {
          signTaprootTx(tx);
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
  };

  const appName = psbtPayload?.appDetails?.name;
  const psbtDetails = getPsbtDetails();

  return {
    appName,
    isLoading,
    onCancel,
    onSignPsbt,
    psbtDetails,
    psbtPayload,
    requestToken,
  };
}
