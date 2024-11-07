import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { AddressDisplayer, type AddressDisplayerProps } from '@leather.io/ui';

type FormAddressDisplayerProps = AddressDisplayerProps;

export function FormAddressDisplayer({ address, ...rest }: FormAddressDisplayerProps) {
  return (
    <AddressDisplayer
      data-testid={SharedComponentsSelectors.AddressDisplayer}
      address={address}
      maxWidth="300px"
      justifyContent="end"
      mr="-8px"
      {...rest}
    />
  );
}
