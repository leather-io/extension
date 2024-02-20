import { fetchBtcNameOwner } from '@app/query/stacks/bns/bns.utils';

import { GenericRecipientField } from '../../../components/recipient-fields/generic-recipient-field';

export function BitcoinRecipientField() {
  return <GenericRecipientField bnsFn={fetchBtcNameOwner} />;
}
