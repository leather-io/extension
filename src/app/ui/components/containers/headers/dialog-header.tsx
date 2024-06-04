import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, styled } from 'leather-styles/jsx';

import { CloseIcon } from '@leather-wallet/ui';

import { HeaderActionButton } from './components/header-action-button';

interface DialogHeaderProps {
  onClose?(): void;
  title?: ReactNode;
}

export function DialogHeader({ onClose, title }: DialogHeaderProps) {
  return (
    <Flex
      justifyContent="flex-end"
      alignItems="center"
      m={{ base: 0, md: 'auto' }}
      p="space.04"
      bg="transparent"
      width="100%"
      minHeight="40px"
    >
      {title && (
        <styled.h2 flex="1" textAlign="center" textStyle="heading.05">
          {title}
        </styled.h2>
      )}
      {onClose && (
        <HeaderActionButton
          icon={<CloseIcon />}
          dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
          onAction={onClose}
        />
      )}
    </Flex>
  );
}
