import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import * as btc from 'micro-btc-signer';

import { deriveAddressIndexKeychainFromAccount } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootPaymentFromAddressIndex } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { isUndefined } from '@shared/utils';

import { whenNetwork } from '@app/common/utils';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { useCurrentAccountIndex } from '../../account';
import { formatBitcoinAccount, tempHardwareAccountForTesting } from './bitcoin-account.models';
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

function useBitcoinTaprootAccount(index: number) {
  const keychain = useTaprootKeychainByAccount();
  return useMemo(() => {
    // TODO: Remove with bitcoin Ledger integration
    if (isUndefined(keychain)) return tempHardwareAccountForTesting;
    return formatBitcoinAccount(keychain(index))(index);
  }, [keychain, index]);
}

function useCurrentBitcoinTaprootAccount() {
  const currentAccountIndex = useCurrentAccountIndex();
  return useBitcoinTaprootAccount(currentAccountIndex);
}

// function useDeriveTaprootAccountIndexAddress(xpub: string, index: number) {
//   const network = useCurrentNetwork();
//   return useMemo(
//     () =>
//       deriveTaprootReceiveAddressIndex({
//         xpub,
//         index,
//         network: network.chain.bitcoin.network,
//       }),
//     [xpub, index, network.chain.bitcoin.network]
//   );
// }

// export function useCurrentTaprootAccountAddressIndexZero() {
//   const { xpub } = useCurrentBitcoinTaprootAccount();
//   return useDeriveTaprootAccountIndexAddressIndexZero(xpub)?.address as string;
// }

export function useCurrentAccountTaprootSigner(addressIndex: number) {
  const network = useCurrentNetwork();
  const accountKeychain = useCurrentTaprootAccountKeychain();
  const addressIndexKeychain = deriveAddressIndexKeychainFromAccount(accountKeychain)(addressIndex);

  return {
    payment: getTaprootPaymentFromAddressIndex(addressIndexKeychain, network.chain.bitcoin.network),
    sign(tx: btc.Transaction) {
      if (!addressIndexKeychain.privateKey)
        throw new Error('Unable to sign taproot transaction, no private key found');

      tx.sign(addressIndexKeychain.privateKey);
    },
  };
}
