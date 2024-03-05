import { fetchNameOwner } from '@app/query/stacks/bns/bns.utils';

import { RecipientField } from '../../../components/recipient-fields/recipient-field';

export function StacksRecipientField() {
  return <RecipientField bnsLookupFn={fetchNameOwner} />;
}
