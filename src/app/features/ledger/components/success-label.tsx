import { FiCheck } from 'react-icons/fi';

import { Flex, FlexProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Caption } from '@app/components/typography';

interface LedgerSuccessLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LedgerSuccessLabel({ children, ...props }: LedgerSuccessLabelProps) {
  return (
    // #4164 FIXME migrate color success
    <Flex alignItems="center" color={token('colors.green.100')} flexDirection="row" {...props}>
      <FiCheck />
      <Caption color="inherited" ml="space.02">
        {children}
      </Caption>
    </Flex>
  );
}
