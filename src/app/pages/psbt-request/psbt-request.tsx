import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { ChainID } from '@stacks/common';
import { PsbtPayload } from '@stacks/connect';
import * as btc from 'micro-btc-signer';

import { finalizePsbt } from '@shared/actions/finalize-psbt';
import { logger } from '@shared/logger';
import { isUndefined } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { getPsbtPayloadFromToken } from '@app/common/psbt/requests';
import { NetworkRow } from '@app/components/network-row';
// import { GenericError } from '@app/components/generic-error/generic-error';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import {
  useSignBitcoinNativeSegwitInputAtIndex,
  useSignBitcoinNativeSegwitTx,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useIsPsbtRequestValid, usePsbtRequestSearchParams } from '@app/store/psbts/requests.hooks';

import { PsbtBox } from './components/psbt-box';
// import { PsbtDetails } from './components/psbt-details';
// import { PsbtDisplayer } from './components/psbt-displayer';
import { PsbtRequestLayout } from './components/psbt-requet.layout';
import { PsbtWarningLabel } from './components/psbt-warning-label';
import { SignPsbtAction } from './components/sign-psbt-action';

export function PsbtRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [psbtPayload, setPsbtPayload] = useState<PsbtPayload>();
  const [tx, setTx] = useState<btc.Transaction>();
  const analytics = useAnalytics();
  const validPsbtRequest = useIsPsbtRequestValid();
  const { requestToken, tabId } = usePsbtRequestSearchParams();
  const signAtIndex = useSignBitcoinNativeSegwitInputAtIndex();
  const signTx = useSignBitcoinNativeSegwitTx();

  useRouteHeader(<PopupHeader />);

  useOnOriginTabClose(() => window.close());

  useOnMount(() => {
    if (!requestToken) return;
    const payload = getPsbtPayloadFromToken(requestToken);
    setPsbtPayload(payload);

    const payloadTxBytes = hexToBytes(payload.txHex);
    const tx = btc.Transaction.fromPSBT(payloadTxBytes);
    setTx(tx);
  });

  if (!psbtPayload || isUndefined(validPsbtRequest) || !validPsbtRequest || !requestToken)
    return (
      <PsbtRequestLayout>
        <></>
        {/* <GenericError /> */}
      </PsbtRequestLayout>
    );

  const appName = psbtPayload.appDetails?.name;

  const getPsbtDetails = () => {
    if (!tx) return;
    try {
      return btc.RawPSBTV0.decode(hexToBytes(psbtPayload.txHex));
    } catch (e0) {
      try {
        return btc.RawPSBTV2.decode(hexToBytes(psbtPayload.txHex));
      } catch (e2) {
        logger.error('Error parsing psbt version', e0);
      }
    }
    return;
  };

  const onCancel = () => {
    void analytics.track('request_psbt_cancel');
    finalizePsbt({ requestPayload: requestToken, tabId, data: 'cancel' });
  };

  const onSignPsbt = async () => {
    setIsLoading(true);
    void analytics.track('request_sign_psbt_submit');

    if (!tx) return logger.error('No psbt to sign');

    const idx = psbtPayload.signAtIndex;
    const allowedSighash = psbtPayload.allowedSighash;

    if (!isUndefined(idx) && idx >= 0) {
      signAtIndex({ allowedSighash, idx, tx });
    } else {
      signTx(tx);
    }

    const psbt = tx.toPSBT();

    setIsLoading(false);

    finalizePsbt({
      requestPayload: requestToken,
      tabId,
      data: { txHex: bytesToHex(psbt) },
    });
  };

  return (
    <PsbtRequestLayout>
      <PsbtWarningLabel appName={appName} />
      <PsbtBox details={getPsbtDetails()} payloadTxHex={psbtPayload.txHex} />
      {/* <PsbtDisplayer details={getPsbtDetails()} /> */}
      {/* <PsbtDetails payloadTxHex={psbtPayload.txHex} /> */}
      <NetworkRow chainId={psbtPayload.network?.chainId ?? ChainID.Testnet} />
      <SignPsbtAction isLoading={isLoading} onCancel={onCancel} onSignPsbt={onSignPsbt} />
      <Outlet />
    </PsbtRequestLayout>
  );
}
