import { Box } from '@stacks/ui';

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
    >
      <AddressDisplayer address={address} />
    </Box>
  );
}
