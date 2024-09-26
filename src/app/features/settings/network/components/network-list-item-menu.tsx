import { NetworkSelectors } from '@tests/selectors/network.selectors';
import { css } from 'leather-styles/css';
import { HStack, styled } from 'leather-styles/jsx';

import { DropdownMenu, EllipsisVIcon, PencilIcon, TrashIcon } from '@leather.io/ui';

interface Props {
  onEditNetwork(): void;
  onClickDeleteNetwork(): void;
}

export function NetworkItemMenu({ onClickDeleteNetwork, onEditNetwork }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.IconButton data-testid={NetworkSelectors.NetworkMenuBtn}>
        <EllipsisVIcon color="ink.text-primary" />
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
              data-testid={NetworkSelectors.EditNetworkMenuBtn}
              onClick={e => {
                e.stopPropagation();
                onEditNetwork();
              }}
            >
              <HStack>
                <PencilIcon />
                <styled.span textStyle="label.02">Edit</styled.span>
              </HStack>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              data-testid={NetworkSelectors.DeleteNetworkMenuBtn}
              onClick={e => {
                e.stopPropagation();
                onClickDeleteNetwork();
              }}
            >
              <HStack color="red.action-primary-default">
                <TrashIcon color="red.action-primary-default" />
                <styled.span textStyle="label.02">Delete</styled.span>
              </HStack>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
