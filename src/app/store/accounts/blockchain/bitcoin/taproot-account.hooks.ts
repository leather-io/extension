import { useSelector } from 'react-redux';

import * as btc from '@scure/btc-signer';

import { deriveAddressIndexKeychainFromAccount } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootPaymentFromAddressIndex } from '@shared/crypto/bitcoin/p2tr-address-gen';

import { whenNetwork } from '@app/common/utils';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { selectMainnetTaprootKeychain, selectTestnetTaprootKeychain } from './bitcoin-keychain';

function useTaprootKeychainByAccount() {
  const network = useCurrentNetwork();
  return useSelector(
    whenNetwork(network.chain.bitcoin.network)({
      mainnet: selectMainnetTaprootKeychain,
      testnet: selectTestnetTaprootKeychain,
    })
  );
}

export function useCurrentTaprootAccountKeychain() {
  const currentAccountIndex = useCurrentAccountIndex();
  const accountKeychain = useTaprootKeychainByAccount();
  if (!accountKeychain) throw new Error('No account keychain found');
  return accountKeychain(currentAccountIndex);
}

export function useCurrentAccountTaprootSigner() {
  const network = useCurrentNetwork();
  const accountKeychain = useCurrentTaprootAccountKeychain();
  const addressIndexKeychainFn = deriveAddressIndexKeychainFromAccount(accountKeychain);

  return (addressIndex: number) => {
    const addressIndexKeychain = addressIndexKeychainFn(addressIndex);
    return {
      payment: getTaprootPaymentFromAddressIndex(
        addressIndexKeychain,
        network.chain.bitcoin.network
      ),
      sign(tx: btc.Transaction) {
        if (!addressIndexKeychain.privateKey)
          throw new Error('Unable to sign taproot transaction, no private key found');

        tx.sign(addressIndexKeychain.privateKey);
      },
    };
  };
}
