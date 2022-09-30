import { decodeToken } from 'jsontokens';

import { isString } from '@shared/utils';
import { StacksNetwork } from '@stacks/network';
import { AuthOptions } from '@stacks/connect';
import { PublicProfile } from '@shared/profiles/types';

export interface ProfileUpdaterPayload {
  profile: PublicProfile;
  appDetails?: AuthOptions['appDetails'];
  network?: StacksNetwork;
  stxAddress?: string;
}

export function getProfileDataContentFromToken(
  requestToken: string
): ProfileUpdaterPayload {
  const token = decodeToken(requestToken);
  if (isString(token.payload)) throw new Error('error decoding json token');

  const result = token.payload as unknown as ProfileUpdaterPayload;
  return result
}
