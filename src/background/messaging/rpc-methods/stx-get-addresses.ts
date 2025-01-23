import { makeRpcAddressesMessageListener } from './get-addresses';

// Method simply clones behaviour of getAddresses action
export const rpcStxGetAddresses = makeRpcAddressesMessageListener('stx_getAddresses');
