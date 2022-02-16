import { FiCheck } from 'react-icons/fi';
import { color, Flex, FlexProps } from '@stacks/ui';
import { Caption } from '@app/components/typography';

interface LedgerSuccessLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LedgerSuccessLabel({ children, ...props }: LedgerSuccessLabelProps) {
  return (
    <Flex alignItems="center" color={color('feedback-success')} flexDirection="row" {...props}>
      <FiCheck />
      <Caption color="inherited" ml="tight">
        {children}
      </Caption>
    </Flex>
  );
}
