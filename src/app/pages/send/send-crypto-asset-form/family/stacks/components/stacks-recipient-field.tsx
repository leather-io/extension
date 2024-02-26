import { fetchNameOwner } from '@app/query/stacks/bns/bns.utils';

import { GenericRecipientField } from '../../../components/recipient-fields/generic-recipient-field';

export function StacksRecipientField() {
  return <GenericRecipientField bnsFn={fetchNameOwner} />;
}
