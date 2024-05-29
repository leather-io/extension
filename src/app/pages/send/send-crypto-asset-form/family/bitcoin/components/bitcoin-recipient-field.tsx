import { fetchBtcNameOwner } from '@leather-wallet/query';

import { RecipientField } from '../../../components/recipient-fields/recipient-field';

export function TransferRecipientField() {
  return <RecipientField bnsLookupFn={fetchBtcNameOwner} />;
}
