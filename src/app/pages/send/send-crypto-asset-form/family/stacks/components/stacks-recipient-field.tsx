import { fetchNameOwner } from '@leather.io/query';

import { RecipientField } from '../../../components/recipient-fields/recipient-field';

export function StacksRecipientField() {
  return <RecipientField bnsLookupFn={fetchNameOwner} />;
}
