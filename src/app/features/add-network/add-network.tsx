import { NetworkForm } from './network-form';
import { NetworkFormLayout } from './network-form.layout';

const title = 'Add network';

export function AddNetwork() {
  return (
    <NetworkFormLayout title={title}>
      <NetworkForm title={title} />
    </NetworkFormLayout>
  );
}
