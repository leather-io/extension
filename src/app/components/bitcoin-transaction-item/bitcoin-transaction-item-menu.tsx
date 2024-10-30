import { ActivitySelectors } from '@tests/selectors/activity.selectors';
import { HStack, styled } from 'leather-styles/jsx';

import { ChevronsRightIcon, DropdownMenu } from '@leather.io/ui';

import { TransactionActionMenu } from '../transaction-item/transaction-action-menu';

interface BitcoinTransactionActionMenuProps {
  onIncreaseFee(): void;
}

export function BitcoinTransactionActionMenu({ onIncreaseFee }: BitcoinTransactionActionMenuProps) {
  return (
    <TransactionActionMenu>
      <DropdownMenu.Item
        data-testid={ActivitySelectors.ActivityItemMenuIncreaseFee}
        onClick={e => {
          e.stopPropagation();
          onIncreaseFee();
        }}
      >
        <HStack>
          <ChevronsRightIcon variant="small" />
          <styled.span textStyle="label.02">Increase fee</styled.span>
        </HStack>
      </DropdownMenu.Item>
    </TransactionActionMenu>
  );
}
