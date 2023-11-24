import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, BoxProps } from 'leather-styles/jsx';

import { AddressDisplayer } from './address-displayer';

interface FormAddressDisplayerProps extends BoxProps {
  address: string;
}
export function FormAddressDisplayer({ address, ...rest }: FormAddressDisplayerProps) {
  return (
    <Box
      data-testid={SharedComponentsSelectors.AddressDisplayer}
      display="flex"
      flexWrap="wrap"
      justifyContent="end"
      maxWidth="300px"
      mr="-8px"
      {...rest}
    >
      <AddressDisplayer address={address} />
    </Box>
  );
}
