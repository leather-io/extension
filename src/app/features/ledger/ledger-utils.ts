import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import Transport from '@ledgerhq/hw-transport-webusb';
import StacksApp from '@zondax/ledger-blockstack';
import { AddressVersion } from '@stacks/transactions';
import { keySlice } from '@app/store/keys/key.slice';
import { RouteUrls } from '@shared/route-urls';

import toast from 'react-hot-toast';

// const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0`;
const STX_DERIVATION_PATH_LESS_ACCOUNT = `m/44'/5757'/0'/0/{account}`;

export async function connectLedger() {
  const transport = await Transport.create();
  return new StacksApp(transport);
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

export async function pullKeysFromLedgerDevice(app: StacksApp): PullKeysFromLedgerResponse {
  const keys = [];
  const amountOfKeysToExtractFromDevice = 5;
  for (let i = 0; i < amountOfKeysToExtractFromDevice; i++) {
    const resp = await app.getAddressAndPubKey(
      STX_DERIVATION_PATH_LESS_ACCOUNT.replace('{account}', i.toString()),
      // We pass mainnet as it expects something, however this is so it can return a formatted address
      // We only need the public key, and can derive the address later in any network format
      AddressVersion.MainnetSingleSig
    );
    console.log(resp);
    if (!resp.publicKey) return { status: 'failure', ...resp };
    keys.push(resp.publicKey.toString('hex'));
  }
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
