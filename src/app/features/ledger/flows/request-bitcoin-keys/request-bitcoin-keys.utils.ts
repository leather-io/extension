import BitcoinApp, { DefaultWalletPolicy } from 'ledger-bitcoin';

import { BitcoinNetworkModes, NetworkModes } from '@shared/constants';
import { createWalletIdDecoratedPath } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getTaprootAccountDerivationPath } from '@shared/crypto/bitcoin/p2tr-address-gen';
import { getNativeSegwitAccountDerivationPath } from '@shared/crypto/bitcoin/p2wpkh-address-gen';

import { delay } from '@app/common/utils';

import {
  WalletPolicyDetails,
  createNativeSegwitDefaultWalletPolicy,
  createTaprootDefaultWalletPolicy,
} from '../../utils/bitcoin-ledger-utils';

interface GetPolicyForPaymentTypeFactoryArgs {
  derivationPathFn(network: BitcoinNetworkModes, accountIndex: number): string;
  policyFn(policyDetails: WalletPolicyDetails): DefaultWalletPolicy;
}
interface GetExtendedPublicKeyFactoryArgs {
  bitcoinApp: BitcoinApp;
  fingerprint: string;
  network: NetworkModes;
  accountIndex: number;
}
function getPolicyForPaymentType({
  derivationPathFn,
  policyFn,
}: GetPolicyForPaymentTypeFactoryArgs) {
  return async ({
    accountIndex,
    bitcoinApp,
    fingerprint,
    network,
  }: GetExtendedPublicKeyFactoryArgs) => {
    const path = derivationPathFn(network, accountIndex);
    const xpub = await bitcoinApp.getExtendedPubkey(path);
    const policy = policyFn({ xpub, fingerprint, network, accountIndex });
    return { policy: policy.keys[0], xpub, fingerprint, path };
  };
}

const getNativeSegwitExtendedPublicKey = getPolicyForPaymentType({
  derivationPathFn: getNativeSegwitAccountDerivationPath,
  policyFn: createNativeSegwitDefaultWalletPolicy,
});

const getTaprootExtendedPublicKey = getPolicyForPaymentType({
  derivationPathFn: getTaprootAccountDerivationPath,
  policyFn: createTaprootDefaultWalletPolicy,
});

interface PullBitcoinKeysFromLedgerDeviceArgs {
  onRequestKey?(keyIndex: number): void;
  network: NetworkModes;
}
export function pullBitcoinKeysFromLedgerDevice(bitcoinApp: BitcoinApp, targetId = '') {
  return async ({ onRequestKey, network }: PullBitcoinKeysFromLedgerDeviceArgs) => {
    const amountOfKeysToExtractFromDevice = 5;
    const fingerprint = await bitcoinApp.getMasterFingerprint();
    const keys: { id: string; path: string; policy: string; targetId: string }[] = [];
    for (let accountIndex = 0; accountIndex < amountOfKeysToExtractFromDevice; accountIndex++) {
      onRequestKey?.(accountIndex);
      const { path, policy } = await getNativeSegwitExtendedPublicKey({
        bitcoinApp,
        fingerprint,
        network,
        accountIndex,
      });
      keys.push({ id: createWalletIdDecoratedPath(path, 'default'), path, policy, targetId });
    }
    for (let accountIndex = 0; accountIndex < amountOfKeysToExtractFromDevice; accountIndex++) {
      onRequestKey?.(accountIndex + 5);
      const { path, policy } = await getTaprootExtendedPublicKey({
        bitcoinApp,
        fingerprint,
        network,
        accountIndex,
      });
      keys.push({ id: createWalletIdDecoratedPath(path, 'default'), path, policy, targetId });
    }
    await delay(250);
    return { status: 'success', keys };
  };
}
