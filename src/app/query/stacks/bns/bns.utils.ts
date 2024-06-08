import { parseZoneFile } from '@fungible-systems/zone-file';
import { asciiToBytes, bytesToAscii } from '@stacks/common';
import { BnsNamesOwnByAddressResponse } from '@stacks/stacks-blockchain-api-types';
import {
  BufferCV,
  ClarityType,
  OptionalCV,
  PrincipalCV,
  TupleCV,
  UIntCV,
  bufferCV,
  cvToHex,
  deserializeCV,
  standardPrincipalCV,
  tupleCV,
} from '@stacks/transactions';
import { principalToString } from '@stacks/transactions/dist/esm/clarity/types/principalCV';

import { isString, isUndefined } from '@leather-wallet/utils';

import { StacksClient } from '@app/query/stacks/stacks-client';

const bnsContractConsts = {
  contractAddress: 'SP1JTCR202ECC6333N7ZXD7MK7E3ZTEEE1MJ73C60',
  contractName: 'bnsx-registry',
} as const;

// Fetch an address's "primary name" from the BNSx contract.
async function fetchBnsxName(
  client: StacksClient,
  address: string,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const addressCV = standardPrincipalCV(address);
    const addressHex = cvToHex(addressCV);
    const res = await client.smartContractsApi.callReadOnlyFunction(
      {
        ...bnsContractConsts,
        functionName: 'get-primary-name',
        tip: 'latest',
        readOnlyFunctionArgs: {
          sender: address,
          arguments: [addressHex],
        },
      },
      { signal }
    );
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

// Fetch the owner of a BNSx name
// If the name is not registered in BNSx, returns null.
//
// Subdomains don't exist on-chain, so if the name looks like a subdomain,
// the function exits early with `null`.
async function fetchBnsxOwner(client: StacksClient, fqn: string): Promise<string | null> {
  const nameParts = fqn.split('.');

  // If the name includes a subdomain, it's not on-chain. Return null
  if (nameParts.length !== 2) return null;

  const [name, namespace] = nameParts;
  const nameCV = tupleCV({
    name: bufferCV(asciiToBytes(name)),
    namespace: bufferCV(asciiToBytes(namespace)),
  });

  const res = await client.smartContractsApi.callReadOnlyFunction({
    ...bnsContractConsts,
    functionName: 'get-name-properties',
    tip: 'latest',
    readOnlyFunctionArgs: {
      // Sender is irrelevant
      sender: bnsContractConsts.contractAddress,
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
interface FetchNamesForAddressArgs {
  client: StacksClient;
  address: string;
  isTestnet: boolean;
  signal?: AbortSignal;
}
export async function fetchNamesForAddress({
  client,
  address,
  isTestnet,
  signal,
}: FetchNamesForAddressArgs): Promise<BnsNamesOwnByAddressResponse> {
  const fetchFromApi = async () => {
    return client.namesApi.getNamesOwnedByAddress({ address, blockchain: 'stacks' }, { signal });
  };
  if (isTestnet) {
    return fetchFromApi();
  }

  // Return BNSx name if available, otherwise return names from API.
  const [bnsxName, bnsNames] = await Promise.all([
    fetchBnsxName(client, address, signal),
    fetchFromApi(),
  ]);
  const bnsName = 'names' in bnsNames ? bnsNames.names[0] : null;
  const names: string[] = [];
  if (bnsName) names.push(bnsName);
  if (bnsxName) names.push(bnsxName);
  return { names };
}

/**
 * Fetch the owner of a name.
 *
 * If on mainnet, this function concurrently fetches a BNSx owner from the contract
 * and a BNS owner from the API.
 */
export async function fetchNameOwner(client: StacksClient, name: string, isTestnet: boolean) {
  const fetchFromApi = async () => {
    const res = await client.namesApi.getNameInfo({ name });
    if (isUndefined(res.address)) return null;
    if (!isString(res.address) || res.address.length === 0) return null;
    return res.address;
  };
  if (isTestnet) {
    return fetchFromApi();
  }

  const [bnsxOwner, apiOwner] = await Promise.all([fetchBnsxOwner(client, name), fetchFromApi()]);
  return bnsxOwner ?? apiOwner;
}

/**
 * Fetch the zonefile-based BTC address for a specific name.
 * The BTC address is found via the `_btc._addr` TXT record,
 * as specified in https://www.newinternetlabs.com/blog/standardizing-names-for-bitcoin-addresses/
 *
 * The value returned from this function is not validated.
 */
export async function fetchBtcNameOwner(
  client: StacksClient,
  name: string
): Promise<string | null> {
  try {
    const nameResponse = await client.namesApi.getNameInfo({ name });
    const zonefile = parseZoneFile(nameResponse.zonefile);
    if (!zonefile.txt) return null;
    const btcRecord = zonefile.txt.find(record => record.name === '_btc._addr');
    if (isUndefined(btcRecord)) return null;
    const txtValue = btcRecord.txt;
    return isString(txtValue) ? txtValue : txtValue[0] ?? null;
  } catch (error) {
    // name not found or invalid zonefile
    return null;
  }
}
