import { ConfirmationButton } from '../_components/confirmation/components/confirmation-button';
import { ConfirmationInfoLabel } from '../_components/confirmation/components/confirmation-info-label';
import { BtcSendFormConfirmationDetails } from './btc-send-form-confirmation-details';

export function BtcSendFormConfirmation() {
  return (
    <>
      <BtcSendFormConfirmationDetails unsignedTx={undefined} />
      <ConfirmationInfoLabel symbol="btc" />
      <ConfirmationButton onClick={() => {}} />
    </>
  );
}
