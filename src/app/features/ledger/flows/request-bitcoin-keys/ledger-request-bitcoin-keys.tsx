import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { bitcoinNetworkModeToCoreNetworkMode } from '@shared/crypto/bitcoin/bitcoin.utils';

import { LedgerRequestKeysContext } from '@app/features/ledger/generic-flows/request-keys/ledger-request-keys.context';
import { useLedgerNavigate } from '@app/features/ledger/hooks/use-ledger-navigate';
import { useActionCancellableByUser } from '@app/features/ledger/utils/stacks-ledger-utils';
import { bitcoinKeysSlice } from '@app/store/ledger/bitcoin/bitcoin-key.slice';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { ledgerRequestKeysRoutes } from '../../generic-flows/request-keys/ledger-request-keys-route-generator';
import { RequestKeysFlow } from '../../generic-flows/request-keys/request-keys-flow';
import { useRequestLedgerKeys } from '../../generic-flows/request-keys/use-request-ledger-keys';
import { connectLedgerBitcoinApp, getBitcoinAppVersion } from '../../utils/bitcoin-ledger-utils';
import { pullBitcoinKeysFromLedgerDevice } from './request-bitcoin-keys.utils';

function LedgerRequestBitcoinKeys() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const canUserCancelAction = useActionCancellableByUser();
  const ledgerNavigate = useLedgerNavigate();
  const network = useCurrentNetwork();

  const { requestKeys, latestDeviceResponse, awaitingDeviceConnection } = useRequestLedgerKeys({
    chain: 'bitcoin',
    connectApp: connectLedgerBitcoinApp(network.chain.bitcoin.bitcoinNetwork),
    getAppVersion: getBitcoinAppVersion,
    isAppOpen({ name }: { name: string }) {
      return name === 'Bitcoin' || name === 'Bitcoin Test';
    },
    onSuccess() {
      navigate('/', { replace: true });
    },
    async pullKeysFromDevice(app) {
      const { keys } = await pullBitcoinKeysFromLedgerDevice(app)({
        network: bitcoinNetworkModeToCoreNetworkMode(network.chain.bitcoin.bitcoinNetwork),
        onRequestKey(index) {
          if (index <= 4) {
            ledgerNavigate.toDeviceBusyStep(
              `Requesting Bitcoin Native Segwit address (${index + 1}…5)`
            );
            return;
          }
          ledgerNavigate.toDeviceBusyStep(`Requesting Bitcoin Taproot address (${index - 4}…5)`);
        },
      });
      dispatch(bitcoinKeysSlice.actions.addKeys(keys));
    },
  });

  const ledgerContextValue: LedgerRequestKeysContext = {
    chain: 'bitcoin',
    pullPublicKeysFromDevice: requestKeys,
    latestDeviceResponse,
    awaitingDeviceConnection,
    outdatedAppVersionWarning: false,
  };

  return (
    <RequestKeysFlow
      context={ledgerContextValue}
      isActionCancellableByUser={awaitingDeviceConnection || canUserCancelAction}
    />
  );
}

export const requestBitcoinKeysRoutes = ledgerRequestKeysRoutes({
  path: 'bitcoin',
  component: <LedgerRequestBitcoinKeys />,
});
