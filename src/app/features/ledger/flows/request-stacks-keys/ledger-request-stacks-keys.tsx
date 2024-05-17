import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import StacksApp from '@zondax/ledger-stacks';
import { pullStacksKeysFromLedgerDevice } from 'app/features/ledger/flows/request-stacks-keys/request-stacks-keys.utils';

import { defaultWalletKeyId } from '@shared/utils';

import { ledgerRequestKeysRoutes } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys-route-generator';
import { LedgerRequestKeysContext } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys.context';
import { RequestKeysFlow } from '@app/features/ledger/generic-flows/request-keys/request-keys-flow';
import {
  defaultNumberOfKeysToPullFromLedgerDevice,
  useRequestLedgerKeys,
} from '@app/features/ledger/generic-flows/request-keys/use-request-ledger-keys';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useCancelLedgerAction } from '@app/features/ledger/utils/generic-ledger-utils';
import {
  connectLedgerStacksApp,
  getStacksAppVersion,
  isStacksAppOpen,
} from '@app/features/ledger/utils/stacks-ledger-utils';
import { useToast } from '@app/features/toasts/use-toast';
import { stacksKeysSlice } from '@app/store/ledger/stacks/stacks-key.slice';

function LedgerRequestStacksKeys() {
  const toast = useToast();
  const navigate = useNavigate();
  const ledgerNavigate = useLedgerNavigate();

  const dispatch = useDispatch();

  const chain = 'stacks';

  const { requestKeys, latestDeviceResponse, awaitingDeviceConnection, outdatedAppVersionWarning } =
    useRequestLedgerKeys<StacksApp>({
      chain,
      connectApp: connectLedgerStacksApp,
      getAppVersion: getStacksAppVersion,
      isAppOpen: isStacksAppOpen,
      onSuccess() {
        navigate('/', { replace: true });
      },
      async pullKeysFromDevice(app) {
        const resp = await pullStacksKeysFromLedgerDevice(app)({
          onRequestKey(accountIndex) {
            ledgerNavigate.toDeviceBusyStep(
              `Requesting STX addresses (${accountIndex + 1}…${defaultNumberOfKeysToPullFromLedgerDevice})`
            );
          },
        });
        if (resp.status === 'failure') {
          toast.error(resp.errorMessage);
          ledgerNavigate.toErrorStep(chain, resp.errorMessage);
          return;
        }
        ledgerNavigate.toDeviceBusyStep();
        dispatch(
          stacksKeysSlice.actions.addKeys(
            resp.publicKeys.map(keys => ({
              ...keys,
              id: keys.path.replace('m', defaultWalletKeyId),
              targetId: latestDeviceResponse?.targetId || '',
            }))
          )
        );
      },
    });

  const ledgerContextValue: LedgerRequestKeysContext = {
    chain: 'stacks',
    pullPublicKeysFromDevice: requestKeys,
    latestDeviceResponse,
    awaitingDeviceConnection,
    outdatedAppVersionWarning,
  };

  const canCancelLedgerAction = useCancelLedgerAction(awaitingDeviceConnection);
  return (
    <RequestKeysFlow
      context={ledgerContextValue}
      isActionCancellableByUser={canCancelLedgerAction}
    />
  );
}

export const requestStacksKeysRoutes = ledgerRequestKeysRoutes({
  path: 'stacks',
  component: <LedgerRequestStacksKeys />,
});
