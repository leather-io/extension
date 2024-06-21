import { useCallback } from 'react';

import { Box, Flex, styled } from 'leather-styles/jsx';

import { CheckmarkIcon } from '@leather.io/ui';

import { UserSelectedTheme, getThemeLabel } from '@app/common/theme-provider';

interface ThemeListItemProps {
  theme: UserSelectedTheme;
  onThemeSelected(theme: UserSelectedTheme): void;
  isActive: boolean;
}
export function ThemeListItem({ theme, onThemeSelected, isActive }: ThemeListItemProps) {
  const themeLabel = getThemeLabel(theme);
  const onThemeItemSelect = useCallback(() => {
    onThemeSelected(theme);
  }, [onThemeSelected, theme]);

  return (
    <Box
      width="100%"
      key={themeLabel}
      _hover={
        isActive
          ? undefined
          : {
              bg: 'ink.component-background-hover',
            }
      }
      px="space.05"
      py="space.04"
      onClick={isActive ? undefined : onThemeItemSelect}
      cursor={isActive ? 'default' : 'pointer'}
    >
      <Flex width="100%" justifyContent="space-between" alignItems="center" height="20px">
        <styled.span textStyle="label.02">{themeLabel}</styled.span>
        {isActive && <CheckmarkIcon />}
      </Flex>
    </Box>
  );
}
