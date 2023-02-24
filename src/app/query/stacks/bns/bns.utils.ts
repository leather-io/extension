import { asciiToBytes } from '@stacks/common';
import { BnsNamesOwnByAddressResponse } from '@stacks/stacks-blockchain-api-types';
import {
  BufferCV,
  ClarityType,
  OptionalCV,
  PrincipalCV,
  TupleCV,
  UIntCV,
  addressToString,
  bufferCV,
  cvToHex,
  deserializeCV,
  standardPrincipalCV,
  tupleCV,
} from '@stacks/transactions';

import { StacksClient } from '@app/query/stacks/stacks-client';

export const BNSX_CONTRACT_CONSTS = {
  contractAddress: 'SP1JTCR202ECC6333N7ZXD7MK7E3ZTEEE1MJ73C60',
  contractName: 'bnsx-registry',
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
      functionName: 'get-primary-name',
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

// This function is not exported from `@stacks/transactions`
function principalToString(principal: PrincipalCV): string {
  if (principal.type === ClarityType.PrincipalStandard) {
    return addressToString(principal.address);
  } else if (principal.type === ClarityType.PrincipalContract) {
    const address = addressToString(principal.address);
    return `${address}.${principal.contractName.content}`;
  } else {
    throw new Error(`Unexpected principal data: ${JSON.stringify(principal)}`);
  }
}

// Fetch the owner of a BNSx name
// If the name is not registered in BNSx, returns null.
//
// Subdomains don't exist on-chain, so if the name looks like a subdomain,
// the function exits early with `null`.
export async function fetchBnsxOwner(client: StacksClient, fqn: string): Promise<string | null> {
  const nameParts = fqn.split('.');

  // If the name includes a subdomain, it's not on-chain. Return null
  if (nameParts.length !== 2) return null;

  const [name, namespace] = nameParts;
  const nameCV = tupleCV({
    name: bufferCV(asciiToBytes(name)),
    namespace: bufferCV(asciiToBytes(namespace)),
  });

  const res = await client.smartContractsApi.callReadOnlyFunction({
    ...BNSX_CONTRACT_CONSTS,
    functionName: 'get-name-properties',
    tip: 'latest',
    readOnlyFunctionArgs: {
      // Sender is irrelevant
      sender: BNSX_CONTRACT_CONSTS.contractAddress,
      arguments: [cvToHex(nameCV)],
    },
  });

  if (!res.okay || !res.result) return null;
  const { result } = res;
  const cv = deserializeCV(result) as OptionalCV<TupleCV<{ owner: PrincipalCV; id: UIntCV }>>;
  if (cv.type === ClarityType.OptionalNone) return null;
  const ownerCV = cv.value.data.owner;
  return principalToString(ownerCV);
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
  const bnsName = 'names' in bnsNames ? bnsNames.names[0] : null;
  const names: string[] = [];
  if (bnsName) names.push(bnsName);
  if (bnsxName) names.push(bnsxName);
  return { names };
}

// Fetch the owner of a name.
//
// If on mainnet, this function concurrently fetches a BNSx owner from the contract
// and a BNS owner from the API.
export async function fetchNameOwner(client: StacksClient, name: string, isTestnet: boolean) {
  const fetchFromApi = async () => {
    const res = await client.namesApi.getNameInfo({ name });
    if (typeof res.address !== 'string' || res.address.length === 0) return null;
    return res.address;
  };
  if (isTestnet) {
    return fetchFromApi();
  }

  const [bnsxOwner, apiOwner] = await Promise.all([fetchBnsxOwner(client, name), fetchFromApi()]);
  return bnsxOwner ?? apiOwner;
}
