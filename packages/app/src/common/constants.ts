import { Subdomains } from '@stacks/keychain';
import { StacksTestnet } from '@blockstack/stacks-transactions';

export const gaiaUrl = 'https://hub.blockstack.org';
export const defaultStacksNetwork = new StacksTestnet();
defaultStacksNetwork.coreApiUrl = 'https://stacks-node-api.blockstack.org';

export let Subdomain: Subdomains = Subdomains.BLOCKSTACK;

if (NODE_ENV === 'development') {
  Subdomain = Subdomains.TEST;
}

export const transition = 'all .2s cubic-bezier(.215,.61,.355,1)';
