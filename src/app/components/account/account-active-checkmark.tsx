import { Box, BoxProps, color } from '@stacks/ui';
import { FiCheck as IconCheck } from 'react-icons/fi';

interface AccountActiveCheckmarkProps extends BoxProps {
  index: number;
}
export function AccountActiveCheckmark({ index, ...rest }: AccountActiveCheckmarkProps) {
  return (
    <Box
      as={IconCheck}
      size="18px"
      color={color('brand')}
      strokeWidth={2.5}
      data-testid={`account-checked-${index}`}
      {...rest}
    />
  );
}
