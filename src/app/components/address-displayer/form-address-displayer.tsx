import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, BoxProps } from 'leather-styles/jsx';

import { AddressDisplayer } from './address-displayer';

interface FormAddressDisplayerProps extends BoxProps {
  address: string;
}

export function FormAddressDisplayer({ address, ...rest }: FormAddressDisplayerProps) {
  return (
    <Box
      maxWidth="300px"
      display="flex"
      flexWrap="wrap"
      justifyContent="end"
      mr="-8px"
      fontSize="16px"
      data-testid={SharedComponentsSelectors.AddressDisplayer}
      {...rest}
    >
      <AddressDisplayer address={address} />
    </Box>
  );
}
