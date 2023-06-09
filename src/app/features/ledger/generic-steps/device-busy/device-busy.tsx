import { useLocationState } from '@app/common/hooks/use-location-state';
import { DeviceBusyLayout } from '@app/features/ledger/generic-steps';

export function DeviceBusy() {
  const description = useLocationState('description');
  return (
    <DeviceBusyLayout chain="stacks" activityDescription={description ?? 'Ledger device busy'} />
  );
}
