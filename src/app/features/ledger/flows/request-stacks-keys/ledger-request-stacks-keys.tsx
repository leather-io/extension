import { useNavigate } from 'react-router-dom';

import { LEDGER_BITCOIN_ENABLED } from '@shared/environment';
import { RouteUrls } from '@shared/route-urls';

import { LedgerRequestKeysContext } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys.context';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import {
  connectLedgerStacksApp,
  getStacksAppVersion,
  isStacksLedgerAppClosed,
  useActionCancellableByUser,
} from '@app/features/ledger/utils/stacks-ledger-utils';

import { ledgerRequestKeysRoutes } from '../../generic-flows/request-keys/ledger-request-keys-route-generator';
import { RequestKeysFlow } from '../../generic-flows/request-keys/request-keys-flow';
import { useRequestLedgerKeys } from '../../generic-flows/request-keys/use-request-ledger-keys';
import { pullStacksKeysFromLedgerDevice } from './request-stacks-keys.utils';
import { useTriggerLedgerDeviceRequestStacksKeys } from './use-trigger-ledger-request-keys';

function LedgerRequestStacksKeys() {
  const navigate = useNavigate();
  const ledgerNavigate = useLedgerNavigate();
  const canUserCancelAction = useActionCancellableByUser();

  const { completeLedgerDeviceOnboarding, fireErrorMessageToast } =
    useTriggerLedgerDeviceRequestStacksKeys();

  const { requestKeys, latestDeviceResponse, awaitingDeviceConnection, outdatedAppVersionWarning } =
    useRequestLedgerKeys({
      chain: 'stacks',
      connectApp: connectLedgerStacksApp,
      getAppVersion: getStacksAppVersion,
      isAppOpen(resp) {
        return !isStacksLedgerAppClosed(resp);
      },
      onSuccess() {
        if (LEDGER_BITCOIN_ENABLED) {
          navigate('/get-started/stacks/' + RouteUrls.LedgerAddMoreKeys, {
            replace: true,
          });
          return;
        }
        navigate('/', { replace: true });
      },
      async pullKeysFromDevice(app) {
        const resp = await pullStacksKeysFromLedgerDevice(app)({
          onRequestKey(index) {
            ledgerNavigate.toDeviceBusyStep(`Requesting STX addresses (${index + 1}…5)`);
          },
        });
        if (resp.status === 'failure') {
          fireErrorMessageToast(resp.errorMessage);
          ledgerNavigate.toErrorStep(resp.errorMessage);
          return;
        }
        ledgerNavigate.toDeviceBusyStep();
        completeLedgerDeviceOnboarding(resp.publicKeys, latestDeviceResponse?.targetId!);
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
