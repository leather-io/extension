import { ClarityValue, TupleCV } from '@stacks/transactions';

import { SignedMessage } from '@shared/signature/signature-types';
import { isString } from '@shared/utils';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';

export function useSignedMessageType(): SignedMessage | null {
  const message = useLocationStateWithCache<string | ClarityValue>('message');
  const domain = useLocationStateWithCache<TupleCV>('domain');

  if (isString(message))
    return {
      messageType: 'utf8',
      message,
    };

  if (message && domain) return { messageType: 'structured', message, domain };

  return null;
}
