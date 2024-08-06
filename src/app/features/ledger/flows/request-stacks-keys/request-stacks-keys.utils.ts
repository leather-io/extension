import { bytesToHex } from '@noble/hashes/utils';
import * as secp from '@noble/secp256k1';
import StacksApp from '@zondax/ledger-stacks';

import { makeStxDerivationPath } from '@leather.io/stacks';
import { delay } from '@leather.io/utils';

import { getIdentityDerivationPath } from '@shared/crypto/stacks/stacks-address-gen';

import { defaultNumberOfKeysToPullFromLedgerDevice } from '../../generic-flows/request-keys/use-request-ledger-keys';
import {
  StacksAppKeysResponseItem,
  requestPublicKeyForStxAccount,
} from '../../utils/stacks-ledger-utils';

function requestPublicKeyForIdentityAccount(app: StacksApp) {
  return async (index: number) => app.getIdentityPubKey(getIdentityDerivationPath(index));
}

function decompressSecp256k1PublicKey(publicKey: string) {
  const point = secp.ProjectivePoint.fromHex(publicKey);
  return bytesToHex(point.toRawBytes(false));
}

interface PullStacksKeysFromLedgerSuccess {
  status: 'success';
  publicKeys: StacksAppKeysResponseItem[];
}

interface PullStacksKeysFromLedgerFailure {
  status: 'failure';
  errorMessage: string;
  returnCode: number;
}

type PullStacksKeysFromLedgerResponse = Promise<
  PullStacksKeysFromLedgerSuccess | PullStacksKeysFromLedgerFailure
>;

interface PullStacksKeysFromLedgerDeviceArgs {
  onRequestKey?(keyIndex: number): void;
}
export function pullStacksKeysFromLedgerDevice(stacksApp: StacksApp) {
  return async ({
    onRequestKey,
  }: PullStacksKeysFromLedgerDeviceArgs): PullStacksKeysFromLedgerResponse => {
    const publicKeys = [];

    for (let index = 0; index < defaultNumberOfKeysToPullFromLedgerDevice; index++) {
      if (onRequestKey) onRequestKey(index);
      const stxPublicKeyResp = await requestPublicKeyForStxAccount(stacksApp)(index);
      const dataPublicKeyResp = await requestPublicKeyForIdentityAccount(stacksApp)(index);

      if (!stxPublicKeyResp.publicKey) return { status: 'failure', ...stxPublicKeyResp };
      if (!dataPublicKeyResp.publicKey) return { status: 'failure', ...dataPublicKeyResp };

      publicKeys.push({
        path: makeStxDerivationPath(index),
        stxPublicKey: stxPublicKeyResp.publicKey.toString('hex'),
        // We return a decompressed public key, to match the behaviour of
        // @stacks/wallet-sdk. I'm not sure why we return an uncompressed key
        // typically compressed keys are used
        dataPublicKey: decompressSecp256k1PublicKey(dataPublicKeyResp.publicKey.toString('hex')),
      });
    }
    await delay(1000);
    return { status: 'success', publicKeys };
  };
}
