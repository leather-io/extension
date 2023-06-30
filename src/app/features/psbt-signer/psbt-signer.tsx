import * as btc from '@scure/btc-signer';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

import { PsbtRequestActions } from './components/psbt-request-actions';
import { PsbtRequestDetails } from './components/psbt-request-details/psbt-request-details';
import { PsbtRequestHeader } from './components/psbt-request-header';
import { PsbtSignerLayout } from './components/psbt-signer.layout';
import { RawPsbt } from './hooks/use-psbt-signer';

interface PsbtSignerProps {
  allowedSighashes?: btc.SignatureHash[];
  inputsToSign?: number | number[];
  name?: string;
  origin: string;
  onCancel(): void;
  onSignPsbt(): void;
  psbtRaw: RawPsbt;
  psbtTx: btc.Transaction;
}
export function PsbtSigner(props: PsbtSignerProps) {
  const { allowedSighashes, inputsToSign, name, origin, onCancel, onSignPsbt, psbtRaw, psbtTx } =
    props;

  useRouteHeader(<PopupHeader displayAddresssBalanceOf="all" />);

  useOnOriginTabClose(() => window.close());

  return (
    <>
      <PsbtSignerLayout>
        <PsbtRequestHeader name={name} origin={origin} />
        <PsbtRequestDetails
          allowedSighashes={allowedSighashes}
          inputsToSign={inputsToSign}
          psbtRaw={psbtRaw}
          psbtTx={psbtTx}
        />
      </PsbtSignerLayout>
      <PsbtRequestActions isLoading={false} onCancel={onCancel} onSignPsbt={onSignPsbt} />
    </>
  );
}
