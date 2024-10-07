import { NetworkForm } from './network-form';
import { NetworkFormLayout } from './network-form.layout';

const title = 'Edit network';

export function EditNetwork() {
  return (
    <NetworkFormLayout title={title}>
      <NetworkForm isEditNetworkMode title={title} />
    </NetworkFormLayout>
  );
}
