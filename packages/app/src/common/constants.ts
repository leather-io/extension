import { Subdomains } from '@stacks/keychain';

export const gaiaUrl = 'https://hub.blockstack.org';

export const Subdomain: Subdomains = Subdomains.STACKS;

// Uncomment if you want to use the testnet registrar during dev
// if (document?.location.origin.includes('localhost')) {
//   Subdomain = Subdomains.TEST_V2;
// }

export const transition = 'all .2s cubic-bezier(.215,.61,.355,1)';

// export const USERNAMES_ENABLED = process.env.USERNAMES_ENABLED === 'true';
export const USERNAMES_ENABLED = true;
