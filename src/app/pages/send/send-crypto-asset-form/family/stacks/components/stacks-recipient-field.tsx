import { fetchNameOwner } from '@leather-wallet/query';

import { RecipientField } from '../../../components/recipient-fields/recipient-field';

export function StacksRecipientField() {
  return <RecipientField bnsLookupFn={fetchNameOwner} />;
}
