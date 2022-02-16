import { DeviceBusyLayout } from '@app/features/ledger/steps/device-busy.layout';

export function PullingKeysFromDevice() {
  return <DeviceBusyLayout activityDescription="Fetching STX address from Ledger" />;
}
