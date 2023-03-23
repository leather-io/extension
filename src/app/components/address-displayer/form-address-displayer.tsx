import { Box } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { AddressDisplayer } from './address-displayer';

interface FormAddressDisplayerProps {
  address: string;
}

export function FormAddressDisplayer({ address }: FormAddressDisplayerProps) {
  return (
    <Box
      maxWidth="300px"
      display="flex"
      flexWrap="wrap"
      justifyContent="end"
      mr="-8px"
      fontSize="16px"
      data-testid={SharedComponentsSelectors.AddressDisplayer}
    >
      <AddressDisplayer address={address} />
    </Box>
  );
}
