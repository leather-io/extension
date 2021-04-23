import { Subdomains } from '@stacks/keychain';

export const gaiaUrl = 'https://hub.blockstack.org';

export let Subdomain: Subdomains = Subdomains.STACKS;

if (document?.location.origin.includes('localhost')) {
  Subdomain = Subdomains.TEST_V2;
}

export const transition = 'all .2s cubic-bezier(.215,.61,.355,1)';

export const USERNAMES_ENABLED = true;
