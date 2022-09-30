import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import { useSearchParams } from 'react-router-dom';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { createUnsecuredToken, Json } from 'jsontokens';
import { makeUUID4, nextMonth } from '@stacks/common';
import { ChainID } from '@stacks/transactions';

export function useIsProfileUpdaterRequestValid() {
  return useAsync(async () => {
    return true;
  }, []).result;
}

function createTestRequest() {
  /* Create the payload */
  const payload = Object.assign(
    {},
    {
      profile: {
        name: 'Friedger',
        image: [
          { '@type': 'ImageObject', name: 'avatar', contentUrl: 'https://github.com/friedger.png' },
        ],
      },
      appDetails: { name: 'Owl Link', icon: 'https://github.com/light-labs.png' },
      network: { chainId: ChainID.Mainnet },
    },
    {
      jti: makeUUID4(),
      iat: Math.floor(new Date().getTime() / 1000), // JWT times are in seconds
      exp: Math.floor(nextMonth().getTime() / 1000), // JWT times are in seconds
      iss: null,
      public_keys: [],
      version: VERSION,
    }
  );

  // create the token
  try {
    const token = createUnsecuredToken(payload as Json);
    return token;
  } catch (e) {
    console.log(e);
    return '';
  }
}

export function useProfileUpdaterRequestSearchParams() {
  const [searchParams] = useSearchParams();
  const { origin, tabId } = useDefaultRequestParams();
  const requestToken = searchParams.get('request') || createTestRequest();
  return useMemo(
    () => ({
      origin,
      tabId: tabId || 1,
      requestToken,
    }),
    [origin, searchParams, tabId]
  );
}
