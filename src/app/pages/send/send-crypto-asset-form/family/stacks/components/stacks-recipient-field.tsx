import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { RecipientField } from '../../../components/recipient-field';
import { useStacksRecipientBnsName } from '../hooks/use-stacks-recipient-bns-name';
import { RecipientFieldBnsAddress } from './recipient-field-bns-address';

export function StacksRecipientField() {
  const { bnsAddress, getBnsAddress, setBnsAddress } = useStacksRecipientBnsName();
  const navigate = useNavigate();

  const onClickLabel = () => {
    setBnsAddress('');
    navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts);
  };

  return (
    <RecipientField
      labelAction="Choose account"
      name="recipientAddressOrBnsName"
      onBlur={getBnsAddress}
      onClickLabelAction={onClickLabel}
      placeholder="Address or name"
      topInputOverlay={
        !!bnsAddress ? <RecipientFieldBnsAddress bnsAddress={bnsAddress} /> : undefined
      }
    />
  );
}
