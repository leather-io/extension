import { useLocationState } from '@app/common/hooks/use-location-state';
import { DeviceBusyLayout } from '@app/features/ledger/generic-steps';

export function DeviceBusy() {
  const description = useLocationState('description');
  return <DeviceBusyLayout activityDescription={description ?? 'Ledger device busy'} />;
}
