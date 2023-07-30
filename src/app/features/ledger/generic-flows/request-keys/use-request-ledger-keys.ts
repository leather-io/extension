import { useState } from 'react';

import StacksApp from '@zondax/ledger-stacks';
import AppClient from 'ledger-bitcoin';
import { useObservable, useSubscription } from 'observable-hooks';
import { Subject, catchError, delay, from, map, mergeMap, retry, tap } from 'rxjs';

import { SupportedBlockchains } from '@shared/constants';

import { useLedgerAnalytics } from '../../hooks/use-ledger-analytics.hook';
import { useLedgerNavigate } from '../../hooks/use-ledger-navigate';
import { useLedgerResponseState } from '../../utils/generic-ledger-utils';

enum LedgerConnectionErrors {
  FailedToConnect = 'FailedToConnect',
  AppNotOpen = 'AppNotOpen',
  AppVersionOutdated = 'AppVersionOutdated',
  DeviceNotConnected = 'DeviceNotConnected',
  DeviceLocked = 'DeviceLocked',
}

interface UseRequestLedgerKeysArgs<App> {
  chain: SupportedBlockchains;
  isAppOpen(args: any): boolean;
  getAppVersion(app: App): Promise<unknown>;
  connectApp(): Promise<App>;
  pullKeysFromDevice(app: App): Promise<void>;
  onSuccess(): void;
}
export function useRequestLedgerKeys<App extends AppClient | StacksApp>({
  chain,
  connectApp,
  getAppVersion,
  pullKeysFromDevice,
  isAppOpen,
  onSuccess,
}: UseRequestLedgerKeysArgs<App>) {
  const [outdatedAppVersionWarning, setAppVersionOutdatedWarning] = useState(false);
  const [latestDeviceResponse, setLatestDeviceResponse] = useLedgerResponseState();
  const [awaitingDeviceConnection, setAwaitingDeviceConnection] = useState(false);
  const ledgerNavigate = useLedgerNavigate();
  const ledgerAnalytics = useLedgerAnalytics();

  const initAction$ = useObservable(() => new Subject());

  function connectLedgerWithFailState() {
    return from(connectApp()).pipe(
      catchError(() => {
        ledgerNavigate.toErrorStep();
        setAwaitingDeviceConnection(false);
        throw new Error(LedgerConnectionErrors.FailedToConnect);
      })
    );
  }

  function checkCorrectAppIsOpenWithFailState(app: App) {
    return from(getAppVersion(app)).pipe(
      map(response => {
        if (!isAppOpen(response)) {
          setAwaitingDeviceConnection(false);
          throw new Error(LedgerConnectionErrors.AppNotOpen);
        }
        return response;
      })
    );
  }

  const pullKeys$ = useObservable(() =>
    initAction$.pipe(
      tap(() => setAwaitingDeviceConnection(true)),
      mergeMap(() => connectLedgerWithFailState()),
      mergeMap(app =>
        checkCorrectAppIsOpenWithFailState(app).pipe(
          tap(() => setAwaitingDeviceConnection(false)),
          tap(() => ledgerNavigate.toConnectionSuccessStep(chain)),
          delay(1250),
          mergeMap(() => pullKeysFromDevice(app)),
          tap(() => ledgerAnalytics.publicKeysPulledFromLedgerSuccessfully()),
          mergeMap(() => app.transport.close()),
          tap(() => onSuccess?.()),
          catchError(e => {
            setAwaitingDeviceConnection(false);
            if (
              e.name === 'LockedDeviceError' ||
              e.message.includes('LockedDeviceError') ||
              e.message === LedgerConnectionErrors.DeviceLocked
            ) {
              setLatestDeviceResponse({ deviceLocked: true } as any);
              throw new Error(LedgerConnectionErrors.DeviceLocked);
            }

            ledgerNavigate.toErrorStep();
            return app.transport.close();
          })
        )
      ),
      retry()
    )
  );

  useSubscription(pullKeys$);

  return {
    async requestKeys() {
      initAction$.next(undefined);
    },
    outdatedAppVersionWarning,
    setAppVersionOutdatedWarning,
    latestDeviceResponse,
    setLatestDeviceResponse,
    awaitingDeviceConnection,
    setAwaitingDeviceConnection,
  };
}
