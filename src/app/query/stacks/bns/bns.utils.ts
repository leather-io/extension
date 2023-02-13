import { BnsNamesOwnByAddressResponse } from '@stacks/stacks-blockchain-api-types';
import {
  BufferCV,
  ClarityType,
  OptionalCV,
  TupleCV,
  cvToHex,
  deserializeCV,
  standardPrincipalCV,
} from '@stacks/transactions';

import { StacksClient } from '@app/query/stacks/stacks-client';

export const BNSX_CONTRACT_CONSTS = {
  contractAddress: 'SP1JTCR202ECC6333N7ZXD7MK7E3ZTEEE1MJ73C60',
  contractName: 'bnsx-registry',
  functionName: 'get-primary-name',
} as const;

export function bytesToAscii(buffer: Uint8Array) {
  let ret = '';
  const end = buffer.length;

  for (let i = 0; i < end; ++i) {
    ret += String.fromCharCode(buffer[i] & 0x7f);
  }
  return ret;
}

// Fetch an address's "primary name" from the BNSx contract.
export async function fetchBnsxName(client: StacksClient, address: string): Promise<string | null> {
  try {
    const addressCV = standardPrincipalCV(address);
    const addressHex = cvToHex(addressCV);
    const res = await client.smartContractsApi.callReadOnlyFunction({
      ...BNSX_CONTRACT_CONSTS,
      tip: 'latest',
      readOnlyFunctionArgs: {
        sender: address,
        arguments: [addressHex],
      },
    });
    if (!res.okay || !res.result) return null;
    const { result } = res;
    const cv = deserializeCV(result) as OptionalCV<
      TupleCV<{ name: BufferCV; namespace: BufferCV }>
    >;
    if (cv.type === ClarityType.OptionalNone) return null;
    const { name, namespace } = cv.value.data;
    const fullName = `${bytesToAscii(name.buffer)}.${bytesToAscii(namespace.buffer)}`;
    return fullName;
  } catch (error) {
    return null;
  }
}

// Fetch names owned by an address.
//
// If `isTestnet` is `false` (aka mainnet), names are fetched from the
// BNSx contract directly.
export async function fetchNamesForAddress(
  client: StacksClient,
  address: string,
  isTestnet: boolean
): Promise<BnsNamesOwnByAddressResponse> {
  const fetchFromApi = async () => {
    return client.namesApi.getNamesOwnedByAddress({ address, blockchain: 'stacks' });
  };
  if (isTestnet) {
    return fetchFromApi();
  }

  // Return BNSx name if available, otherwise return names from API.
  const [bnsxName, bnsNames] = await Promise.all([fetchBnsxName(client, address), fetchFromApi()]);
  if (bnsxName !== null) return { names: [bnsxName] };
  return bnsNames;
}
