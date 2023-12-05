import { Box, Flex, styled } from 'leather-styles/jsx';

import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';

interface ThemeListItemProps {
  themeLabel: string;
  isActive: boolean;
  onThemeItemSelect(): void;
}
export function ThemeListItemLayout({
  themeLabel,
  isActive,
  onThemeItemSelect,
}: ThemeListItemProps) {
  return (
    <Box
      width="100%"
      key={themeLabel}
      _hover={
        isActive
          ? undefined
          : {
              backgroundColor: 'accent.component-background-hover',
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
