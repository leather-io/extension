import { ReactNode, useRef } from 'react';

import { Box, Stack } from 'leather-styles/jsx';

import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';

import { RecipientDropdownItem } from './recipient-dropdown-item';

interface RecipientDropdownLayoutProps {
  children: ReactNode;
  isVisible: boolean;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
}
export function RecipientDropdownLayout({
  children,
  isVisible,
  onSetIsSelectVisible,
  selectedItem,
}: RecipientDropdownLayoutProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => onSetIsSelectVisible(false));

  return (
    <Box>
      <RecipientDropdownItem index={selectedItem} onSelectItem={() => onSetIsSelectVisible(true)} />
      {isVisible ? (
        <Stack
          bg="accent.background-primary"
          borderRadius="xs"
          boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08)"
          flexDirection="column"
          gap="0px"
          minWidth="100px"
          overflow="hidden"
          p="space.01"
          position="absolute"
          ref={ref}
          top="40px"
          zIndex={9999}
        >
          {children}
        </Stack>
      ) : null}
    </Box>
  );
}
