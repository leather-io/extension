import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { css } from 'leather-styles/css';
import { HStack, styled } from 'leather-styles/jsx';

import { DotsVerticalIcon, DropdownMenu, PenIcon, TrashIcon } from '@leather.io/ui';

interface Props {
  onEditNetwork(): void;
  onClickDeleteNetwork(): void;
}

export function NetworkItemMenu({ onClickDeleteNetwork, onEditNetwork }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.IconButton>
        <DotsVerticalIcon
          color="ink.text-primary"
          data-testid={SettingsSelectors.SettingsMenuBtn}
        />
      </DropdownMenu.IconButton>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="bottom"
          sideOffset={8}
          className={css({
            width: 'settingsMenuWidth',
          })}
        >
          <DropdownMenu.Group>
            <DropdownMenu.Item
              onClick={e => {
                e.stopPropagation();
                onEditNetwork();
              }}
            >
              <HStack>
                <PenIcon />
                <styled.span textStyle="label.02">Edit</styled.span>
              </HStack>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={e => {
                e.stopPropagation();
                onClickDeleteNetwork();
              }}
            >
              <HStack color="red.action-primary-default">
                <TrashIcon />
                <styled.span textStyle="label.02">Delete</styled.span>
              </HStack>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
