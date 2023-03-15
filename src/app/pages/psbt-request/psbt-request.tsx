import { ChainID } from '@stacks/common';

import { isUndefined } from '@shared/utils';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { NetworkRow } from '@app/components/network-row';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useIsPsbtRequestValid } from '@app/store/psbts/requests.hooks';

import { PsbtRequestActions } from './components/psbt-request-actions';
import { PsbtRequestDetails } from './components/psbt-request-details';
import { PsbtRequestDisclaimer } from './components/psbt-request-disclaimer';
import { PsbtRequestHeader } from './components/psbt-request-header';
import { PsbtRequestWarningLabel } from './components/psbt-request-warning-label';
import { PsbtRequestLayout } from './components/psbt-requet.layout';
import { usePsbtRequest } from './use-psbt-request';

export function PsbtRequest() {
  const validPsbtRequest = useIsPsbtRequestValid();
  const { appName, isLoading, onCancel, onSignPsbt, psbtDetails, psbtPayload, requestToken } =
    usePsbtRequest();

  useRouteHeader(<PopupHeader displayAddresssBalanceOf="all" />);

  useOnOriginTabClose(() => window.close());

  if (!psbtPayload || isUndefined(validPsbtRequest) || !validPsbtRequest || !requestToken)
    return null;

  return (
    <PsbtRequestLayout>
      <PsbtRequestHeader />
      <PsbtRequestWarningLabel appName={appName} />
      {/* TODO: Finish decoding the PSBT details for v2 of this feature */}
      {/* <PsbtRequestDetailsV2 details={psbtDetails} payloadTxHex={psbtPayload.hex} /> */}
      <PsbtRequestDetails details={psbtDetails} payloadTxHex={psbtPayload.hex} />
      <NetworkRow chainId={psbtPayload.network?.chainId ?? ChainID.Testnet} />
      <PsbtRequestActions isLoading={isLoading} onCancel={onCancel} onSignPsbt={onSignPsbt} />
      <hr />
      <PsbtRequestDisclaimer appName={appName} />
    </PsbtRequestLayout>
  );
}
