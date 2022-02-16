import { makeDIDFromAddress } from '@stacks/auth';
import { makeUUID4, nextMonth } from '@stacks/common';
import { publicKeyToAddress } from '@stacks/encryption';
import { createUnsecuredToken } from 'jsontokens';

export async function makeUnsafeAuthResponse(
  publicKey: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  profile: {} = {},
  username: string | null = null,
  _metadata: any | null,
  coreToken: string | null = null,
  _appPrivateKey: string | null = null,
  expiresAt: number = nextMonth().getTime(),
  _transitPublicKey: string | null = null,
  _hubUrl: string | null = null,
  _blockstackAPIUrl: string | null = null,
  _associationToken: string | null = null
): Promise<string> {
  const address = publicKeyToAddress(publicKey);

  // /* See if we should encrypt with the transit key */
  // let privateKeyPayload = appPrivateKey;
  const coreTokenPayload = coreToken;
  const additionalProperties = {};
  // if (appPrivateKey !== undefined && appPrivateKey !== null) {
  //   // Logger.info(`blockstack.js: generating v${VERSION} auth response`)
  //   if (transitPublicKey !== undefined && transitPublicKey !== null) {
  //     privateKeyPayload = await encryptPrivateKey(transitPublicKey, appPrivateKey);
  //     if (coreToken !== undefined && coreToken !== null) {
  //       coreTokenPayload = await encryptPrivateKey(transitPublicKey, coreToken);
  //     }
  //   }
  //   additionalProperties = {
  //     email: metadata?.email ? metadata.email : null,
  //     profile_url: metadata?.profileUrl ? metadata.profileUrl : null,
  //     hubUrl,
  //     blockstackAPIUrl,
  //     associationToken,
  //     version: VERSION,
  //   };
  // } else {
  //   // Logger.info('blockstack.js: generating legacy auth response')
  // }

  /* Create the payload */
  const payload = Object.assign(
    {},
    {
      jti: makeUUID4(),
      iat: Math.floor(new Date().getTime() / 1000), // JWT times are in seconds
      exp: Math.floor(expiresAt / 1000), // JWT times are in seconds
      iss: makeDIDFromAddress(address),
      // private_key: privateKeyPayload,
      public_keys: [publicKey],
      profile,
      username,
      core_token: coreTokenPayload,
    },
    additionalProperties
  );

  return createUnsecuredToken(payload);
}
