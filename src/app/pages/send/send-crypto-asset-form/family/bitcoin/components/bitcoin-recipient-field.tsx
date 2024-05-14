import { fetchBtcNameOwner } from '@app/query/stacks/bns/bns.utils';

import { RecipientField } from '../../../components/recipient-fields/recipient-field';

export function TransferRecipientField() {
  return <RecipientField bnsLookupFn={fetchBtcNameOwner} />;
}
