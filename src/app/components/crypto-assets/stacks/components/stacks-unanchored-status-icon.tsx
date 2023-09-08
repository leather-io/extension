// #4164 FIXME migrate - ask design about this icon - do we have a new one
import { FiZap } from 'react-icons/fi';

import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';

export function StacksUnanchoredStatusIcon() {
  return (
    <TransactionTypeIconWrapper
      bg="invert"
      icon={() => (
        // #4164 FIXME migrate color('accent') + invert + visual check this icon
        <styled.div
          bg={token('colors.accent.background-secondary')}
          borderColor={token('colors.accent.background-secondary')}
        >
          <FiZap fill={token('colors.accent.background-primary')} height="13px" width="13px" />
        </styled.div>
      )}
    />
  );
}
