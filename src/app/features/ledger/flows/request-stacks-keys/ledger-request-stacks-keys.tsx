import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { defaultWalletKeyId } from '@shared/utils';

import { LedgerRequestKeysContext } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys.context';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import {
  connectLedgerStacksApp,
  getStacksAppVersion,
  isStacksLedgerAppClosed,
  useActionCancellableByUser,
} from '@app/features/ledger/utils/stacks-ledger-utils';
import { stacksKeysSlice } from '@app/store/ledger/stacks/stacks-key.slice';

import { ledgerRequestKeysRoutes } from '../../generic-flows/request-keys/ledger-request-keys-route-generator';
import { RequestKeysFlow } from '../../generic-flows/request-keys/request-keys-flow';
import { useRequestLedgerKeys } from '../../generic-flows/request-keys/use-request-ledger-keys';
import { pullStacksKeysFromLedgerDevice } from './request-stacks-keys.utils';

function LedgerRequestStacksKeys() {
  const navigate = useNavigate();
  const ledgerNavigate = useLedgerNavigate();
  const canUserCancelAction = useActionCancellableByUser();

  const dispatch = useDispatch();

  const { requestKeys, latestDeviceResponse, awaitingDeviceConnection, outdatedAppVersionWarning } =
    useRequestLedgerKeys({
      chain: 'stacks',
      connectApp: connectLedgerStacksApp,
      getAppVersion: getStacksAppVersion,
      isAppOpen(resp) {
        return !isStacksLedgerAppClosed(resp);
      },
      onSuccess() {
        navigate('/', { replace: true });
      },
      async pullKeysFromDevice(app) {
        const resp = await pullStacksKeysFromLedgerDevice(app)({
          onRequestKey(accountIndex) {
            ledgerNavigate.toDeviceBusyStep(`Requesting STX addresses (${accountIndex + 1}…5)`);
          },
        });
        if (resp.status === 'failure') {
          toast.error(resp.errorMessage);
          ledgerNavigate.toErrorStep(resp.errorMessage);
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

  return (
    <RequestKeysFlow
      context={ledgerContextValue}
      isActionCancellableByUser={awaitingDeviceConnection || canUserCancelAction}
    />
  );
}

export const requestStacksKeysRoutes = ledgerRequestKeysRoutes({
  path: 'stacks',
  component: <LedgerRequestStacksKeys />,
});
