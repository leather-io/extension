import { RPCClient } from '@stacks/rpc-client';
import { StacksNetwork, StacksTestnet } from '@blockstack/stacks-transactions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getAuthOrigin = () => {
  let authOrigin = process.env.AUTH_ORIGIN || 'http://localhost:8080';
  // In order to have deploy previews use the same version of the authenticator,
  // we detect if this is a 'deploy preview' and change the origin to point to the
  // same PR's deploy preview in the authenticator.
  const { origin } = location;
  if (origin.includes('deploy-preview')) {
    // Our netlify sites are called "authenticator-demo" for this app, and
    // "stacks-authenticator" for the authenticator.
    authOrigin = document.location.origin.replace('authenticator-demo', 'stacks-authenticator');
  }
  return authOrigin;
};

export const useLocalNode = location.origin.includes('localhost');
const defaultStacksNodeApiUrl = useLocalNode
  ? 'http://localhost:3999'
  : 'https://stacks-node-api.blockstack.org';

export const network = new StacksTestnet();
network.coreApiUrl = defaultStacksNodeApiUrl;

export const getRPCClient = (network?: StacksNetwork) => {
  const url = network ? network.coreApiUrl : defaultStacksNodeApiUrl;
  return new RPCClient(url);
};

export const toRelativeTime = (ts: number): string => dayjs().to(ts);
