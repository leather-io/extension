import { ActivitySelectors } from '@tests/selectors/activity.selectors';
import { css } from 'leather-styles/css';
import { HStack, styled } from 'leather-styles/jsx';

import { ChevronDownIcon, ChevronsRightIcon, CloseIcon, DropdownMenu, Flag } from '@leather.io/ui';

interface StacksTransactionActionMenuProps {
  onIncreaseFee(): void;
  onCancelTransaction(): void;
}

export function StacksTransactionActionMenu({
  onIncreaseFee,
  onCancelTransaction,
}: StacksTransactionActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        data-testid={ActivitySelectors.ActivityItemMenuBtn}
        className={css({
          zIndex: 10,
          borderRadius: 'sm',
          px: 'space.01',
          _hover: {
            background: 'ink.component-background-hover',
          },
        })}
      >
        <Flag spacing="space.02" reverse img={<ChevronDownIcon variant="small" />}>
          <styled.span textStyle="label.03">Options</styled.span>
        </Flag>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="bottom"
          sideOffset={8}
          className={css({
            zIndex: 100,
            width: 'settingsMenuWidth',
          })}
        >
          <DropdownMenu.Group>
            <DropdownMenu.Item
              data-testid={ActivitySelectors.ActivityItemMenuIncreaseFee}
              onClick={e => {
                e.stopPropagation();
                onIncreaseFee();
              }}
            >
              <HStack>
                <ChevronsRightIcon />
                <styled.span textStyle="label.02">Increase fee</styled.span>
              </HStack>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              data-testid={ActivitySelectors.ActivityItemMenuCancelTransaction}
              onClick={e => {
                e.stopPropagation();
                onCancelTransaction();
              }}
            >
              <HStack>
                <CloseIcon />
                <styled.span textStyle="label.02">Cancel transaction</styled.span>
              </HStack>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
