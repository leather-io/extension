import { ReactNode, useRef } from 'react';

// #4164 FIXME migrate Fade
import { Fade } from '@stacks/ui';
import { Box, Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
            bg={token('colors.accent.background-primary')}
            borderRadius="8px"
            boxShadow="high"
            flexDirection="column"
            minWidth="100px"
            overflow="hidden"
            p="space.01"
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
