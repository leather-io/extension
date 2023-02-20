import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { RecipientField } from '../../../components/recipient-field';
import { useStacksRecipientBnsName } from '../hooks/use-stacks-recipient-bns-name';
import { RecipientFieldBnsAddress } from './recipient-field-bns-address';

export function StacksRecipientField(props: { contractId?: string }) {
  const { contractId } = props;
  const { getBnsAddress, bnsAddress } = useStacksRecipientBnsName();
  const navigate = useNavigate();

  return (
    <RecipientField
      labelAction="Choose account"
      name="recipientAddressOrBnsName"
      onBlur={getBnsAddress}
      onClickLabelAction={() =>
        navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts, {
          state: { contractId },
        })
      }
      placeholder="Address or name"
      topInputOverlay={
        !!bnsAddress ? <RecipientFieldBnsAddress bnsAddress={bnsAddress} /> : undefined
      }
    />
  );
}
