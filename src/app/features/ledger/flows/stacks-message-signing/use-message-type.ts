import { isString } from '@leather.io/utils';

import {
  type SignedMessageType,
  UnsignedMessage,
  deserializeUnsignedMessage,
} from '@shared/signature/signature-types';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';

export function useUnsignedMessageType(): UnsignedMessage | null {
  const messageType = useLocationStateWithCache<SignedMessageType>('messageType');
  const message = useLocationStateWithCache<string | Uint8Array>('message');
  const domain = useLocationStateWithCache<Uint8Array>('domain');

  if (messageType === 'utf8' && isString(message)) return { messageType, message };

  if (messageType === 'structured' && message && !isString(message) && domain)
    return deserializeUnsignedMessage({ messageType, message, domain });

  return null;
}
