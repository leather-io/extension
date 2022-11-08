import * as secp from '@noble/secp256k1';
import StacksApp from '@zondax/ledger-stacks';

import { delay } from '@app/common/utils';

import {
  StxAndIdentityPublicKeys,
  getIdentityDerivationPath,
  requestPublicKeyForStxAccount,
} from '../../ledger-utils';

function requestPublicKeyForIdentityAccount(app: StacksApp) {
  return async (index: number) => app.getIdentityPubKey(getIdentityDerivationPath(index));
}

function decompressSecp256k1PublicKey(publicKey: string) {
  const point = secp.Point.fromHex(publicKey);
  return secp.utils.bytesToHex(point.toRawBytes(false));
}

interface PullKeysFromLedgerSuccess {
  status: 'success';
  publicKeys: StxAndIdentityPublicKeys[];
}

interface PullKeysFromLedgerFailure {
  status: 'failure';
  errorMessage: string;
  returnCode: number;
}

type PullKeysFromLedgerResponse = Promise<PullKeysFromLedgerSuccess | PullKeysFromLedgerFailure>;

interface PullKeysFromLedgerDeviceArgs {
  onRequestKey?(keyIndex: number): void;
}
export function pullKeysFromLedgerDevice(stacksApp: StacksApp) {
  return async ({ onRequestKey }: PullKeysFromLedgerDeviceArgs): PullKeysFromLedgerResponse => {
    const publicKeys = [];
    const amountOfKeysToExtractFromDevice = 5;
    for (let index = 0; index < amountOfKeysToExtractFromDevice; index++) {
      if (onRequestKey) onRequestKey(index);
      const stxPublicKeyResp = await requestPublicKeyForStxAccount(stacksApp)(index);
      const dataPublicKeyResp = await requestPublicKeyForIdentityAccount(stacksApp)(index);

      if (!stxPublicKeyResp.publicKey) return { status: 'failure', ...stxPublicKeyResp };
      if (!dataPublicKeyResp.publicKey) return { status: 'failure', ...dataPublicKeyResp };

      publicKeys.push({
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
