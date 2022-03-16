import { useAddressNetworkVersion } from '@app/store/accounts/account.hooks';
import { publicKeyToAddress, createStacksPublicKey } from '@stacks/transactions';

export function usePublicKeyToAddress(publicKey: string) {
  const addressVersion = useAddressNetworkVersion();
  return publicKeyToAddress(addressVersion, createStacksPublicKey(publicKey));
}
