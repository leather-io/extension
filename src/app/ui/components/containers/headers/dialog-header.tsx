import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex } from 'leather-styles/jsx';

import { CloseIcon } from '@app/ui/icons';

import { HeaderActionButton } from './components/header-action-button';

export interface DialogHeaderProps {
  isWaitingOnPerformedAction?: boolean;
  onClose?(): void;
  title?: ReactNode;
}

export function DialogHeader({ isWaitingOnPerformedAction, onClose, title }: DialogHeaderProps) {
  return (
    <Flex
      justifyContent="center"
      margin={{ base: 0, md: 'auto' }}
      p="space.04"
      bg="transparent"
      width="100%"
    >
      {title && (
        <Flex flex="none" margin="auto" alignItems="center" textStyle="heading.05">
          {title}
        </Flex>
      )}
      {onClose && !isWaitingOnPerformedAction && (
        <HeaderActionButton
          icon={<CloseIcon />}
          dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
          onAction={onClose}
        />
      )}
    </Flex>
  );
}
