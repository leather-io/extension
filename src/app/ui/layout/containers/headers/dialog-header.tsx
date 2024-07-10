import { ReactNode } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

import { CloseIcon, IconButton } from '@leather.io/ui';

interface DialogHeaderProps {
  onClose?(): void;
  title?: ReactNode;
  variant?: 'default' | 'large';
}

export function DialogHeader({ onClose, title, variant = 'default' }: DialogHeaderProps) {
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
        <styled.h2
          flex="1"
          textAlign={variant === 'large' ? 'left' : 'center'}
          textStyle={variant === 'large' ? 'heading.03' : 'heading.05'}
        >
          {title}
        </styled.h2>
      )}
      {onClose && <IconButton icon={<CloseIcon />} onClick={onClose} position="absolute" />}
    </Flex>
  );
}
