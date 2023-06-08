import { ReactNode, useRef } from 'react';

import { Box, Fade, Stack, color } from '@stacks/ui';

import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';

import { RecipientDropdownItem } from './recipient-dropdown-item';

interface RecipientDropdownLayoutProps {
  children: ReactNode;
  isVisible: boolean;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
}
export function RecipientDropdownLayout(props: RecipientDropdownLayoutProps) {
  const { children, isVisible, onSetIsSelectVisible, selectedItem } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => onSetIsSelectVisible(false));

  return (
    <Box>
      <RecipientDropdownItem index={selectedItem} onSelectItem={() => onSetIsSelectVisible(true)} />
      <Fade in={isVisible}>
        {styles => (
          <Stack
            bg={color('bg')}
            borderRadius="8px"
            boxShadow="high"
            flexDirection="column"
            minWidth="100px"
            overflow="hidden"
            p="extra-tight"
            position="absolute"
            ref={ref}
            style={styles}
            top="40px"
            zIndex={9999}
          >
            {children}
          </Stack>
        )}
      </Fade>
    </Box>
  );
}
