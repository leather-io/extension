import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import Transport from '@ledgerhq/hw-transport-webusb';
import StacksApp from '@zondax/ledger-blockstack';
import { AddressVersion } from '@stacks/transactions';
import { keySlice } from '@app/store/keys/key.slice';
import { RouteUrls } from '@shared/route-urls';

import toast from 'react-hot-toast';
import { delay } from '@app/common/utils';

// const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0`;
const STX_DERIVATION_PATH_LESS_ACCOUNT = `m/44'/5757'/0'/0/{account}`;

export async function connectLedger() {
  const transport = await Transport.create();
  return new StacksApp(transport);
}

function requestPublicKeyForAccount(app: StacksApp) {
  return async (index: number) =>
    app.getAddressAndPubKey(
      STX_DERIVATION_PATH_LESS_ACCOUNT.replace('{account}', index.toString()),
      // We pass mainnet as it expects something, however this is so it can return a formatted address
      // We only need the public key, and can derive the address later in any network format
      AddressVersion.MainnetSingleSig
    );
}

interface PullKeysFromLedgerSuccess {
  status: 'success';
  publicKeys: string[];
}

interface PullKeysFromLedgerFailure {
  status: 'failure';
  errorMessage: string;
  returnCode: number;
}

type PullKeysFromLedgerResponse = Promise<PullKeysFromLedgerSuccess | PullKeysFromLedgerFailure>;

export async function pullKeysFromLedgerDevice(stacksApp: StacksApp): PullKeysFromLedgerResponse {
  const keys = [];
  const amountOfKeysToExtractFromDevice = 5;
  for (let index = 0; index < amountOfKeysToExtractFromDevice; index++) {
    const resp = await requestPublicKeyForAccount(stacksApp)(index);
    toast.success(`Fetched Account ${index + 1}`, { duration: 1000 });
    if (!resp.publicKey) return { status: 'failure', ...resp };
    keys.push(resp.publicKey.toString('hex'));
  }
  await delay(1000);
  return { status: 'success', publicKeys: keys };
}

export function useTriggerLedgerDeviceOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMemo(
    () => ({
      fireErrorMessageToast(errorMsg: string) {
        toast.error(errorMsg);
      },
      completeLedgerDeviceOnboarding(publicKeys: string[]) {
        dispatch(
          keySlice.actions.createLedgerWallet({
            type: 'ledger',
            id: 'default',
            publicKeys,
          })
        );
        navigate(RouteUrls.Home);
      },
    }),
    [dispatch, navigate]
  );
}
