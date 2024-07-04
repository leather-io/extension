import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, styled } from 'leather-styles/jsx';

import { CloseIcon } from '@leather.io/ui';

import { HeaderActionButton } from './header-action-button';

interface BigTitleHeaderProps {
  onClose?(): void;
  title?: ReactNode;
}
// all big title headers seem to be dialogs anyway
// dialog headers with a big title font
export function BigTitleHeader({ onClose, title }: BigTitleHeaderProps) {
  return (
    <Flex justifyContent="space-between" mt={{ base: 'space.05', md: 'unset' }}>
      <styled.h3 textStyle="heading.03">{title}</styled.h3>
      {onClose && (
        <styled.div hideBelow="md">
          <HeaderActionButton
            icon={<CloseIcon />}
            dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
            onAction={onClose}
          />
        </styled.div>
      )}
    </Flex>
  );
}
