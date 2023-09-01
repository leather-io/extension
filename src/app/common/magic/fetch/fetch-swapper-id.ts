import type { MagicFetchContext } from './constants';

/**
 * Fetches the swapper ID associated to an address from the Magic contracts.
 *
 * @param address The address.
 * @param context The context.
 */
export async function fetchSwapperId(
  address: string,
  { magicClient, magicContracts: magic }: MagicFetchContext
) {
  const swapperId = await magicClient.ro(magic.bridge.getSwapperId(address));

  return swapperId === null ? undefined : Number(swapperId);
}
