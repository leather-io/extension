import { ActivitySelectors } from '@tests/selectors/activity.selectors';
import { css } from 'leather-styles/css';
import { styled } from 'leather-styles/jsx';

import { ChevronDownIcon, DropdownMenu, Flag } from '@leather.io/ui';

interface TransactionActionMenuProps {
  children: React.ReactNode;
}

export function TransactionActionMenu({ children }: TransactionActionMenuProps) {
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
          <DropdownMenu.Group>{children}</DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
