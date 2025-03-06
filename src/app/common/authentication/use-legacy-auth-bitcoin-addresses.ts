import { bytesToHex } from '@noble/hashes/utils';

import { useNativeSegwitNetworkSigners } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useTaprootNetworkSigners } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';

export function useGetLegacyAuthBitcoinAddresses() {
  const deriveAllNativeSegWitNetworkSigners = useNativeSegwitNetworkSigners();
  const deriveAllTaprootNetworkSigners = useTaprootNetworkSigners();

  return (accountIndex: number) => {
    const taprootAccount = deriveAllTaprootNetworkSigners(accountIndex);
    const nativeSegwitAccount = deriveAllNativeSegWitNetworkSigners(accountIndex);

    return {
      btcAddress: {
        p2tr: {
          mainnet: taprootAccount?.mainnet?.payment?.address,
          testnet: taprootAccount?.testnet?.payment?.address,
          regtest: taprootAccount?.regtest?.payment?.address,
          signet: taprootAccount?.signet?.payment?.address,
        },
        p2wpkh: {
          mainnet: nativeSegwitAccount?.mainnet?.payment?.address,
          testnet: nativeSegwitAccount?.testnet?.payment?.address,
          regtest: nativeSegwitAccount?.regtest?.payment?.address,
          signet: nativeSegwitAccount?.signet?.payment?.address,
        },
      },
      btcPublicKey: {
        p2tr: bytesToHex(taprootAccount?.mainnet?.keychain.publicKey!),
        p2wpkh: bytesToHex(nativeSegwitAccount?.mainnet?.keychain.publicKey!),
      },
      btcPublicKeyTestnet: {
        p2tr: bytesToHex(taprootAccount?.testnet?.keychain.publicKey!),
        p2wpkh: bytesToHex(nativeSegwitAccount?.testnet?.keychain.publicKey!),
      },
    };
  };
}
