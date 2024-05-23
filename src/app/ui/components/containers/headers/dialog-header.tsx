import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex } from 'leather-styles/jsx';

import { CloseIcon } from '@app/ui/icons';

import { HeaderActionButton } from './components/header-action-button';

interface DialogHeaderProps {
  onClose?(): void;
  title?: ReactNode;
}

export function DialogHeader({ onClose, title }: DialogHeaderProps) {
  return (
    <Flex
      justifyContent="center"
      m={{ base: 0, md: 'auto' }}
      p="space.04"
      bg="transparent"
      width="100%"
      minHeight="40px"
    >
      {title && (
        <Flex flex="none" m="auto" alignItems="center" textStyle="heading.05">
          {title}
        </Flex>
      )}
      {onClose && (
        <Box>
          <HeaderActionButton
            icon={<CloseIcon />}
            dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
            onAction={onClose}
          />
        </Box>
      )}
    </Flex>
  );
}
