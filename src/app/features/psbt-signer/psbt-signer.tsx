import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

import { PsbtDecodedRequest } from './components/psbt-decoded-request/psbt-decoded-request';
import { PsbtRequestActions } from './components/psbt-request-actions';
import { PsbtRequestHeader } from './components/psbt-request-header';
import { PsbtRequestWarningLabel } from './components/psbt-request-warning-label';
import { PsbtRequestLayout } from './components/psbt-request.layout';
import { DecodedPsbt } from './hooks/use-psbt-signer';

interface PsbtSignerProps {
  appName: string;
  psbt: DecodedPsbt;
  onCancel(): void;
  onSignPsbt(): void;
}
export function PsbtSigner(props: PsbtSignerProps) {
  const { appName, psbt, onCancel, onSignPsbt } = props;

  useRouteHeader(<PopupHeader displayAddresssBalanceOf="all" />);

  useOnOriginTabClose(() => window.close());

  return (
    <>
      <PsbtRequestLayout>
        <PsbtRequestHeader origin={appName} />
        <PsbtRequestWarningLabel appName={appName} />
        <PsbtDecodedRequest psbt={psbt} />
      </PsbtRequestLayout>
      <PsbtRequestActions isLoading={false} onCancel={onCancel} onSignPsbt={onSignPsbt} />
    </>
  );
}
