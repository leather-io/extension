import { Box, BoxProps, Flex } from '@stacks/ui';
import { token } from 'leather-styles/tokens';

import { CheckmarkIcon } from '@app/components/icons/checkmark-icon';
import { Title } from '@app/components/typography';

interface ThemeListItemProps extends BoxProps {
  themeLabel: string;
  isActive: boolean;
  onThemeItemSelect: () => void;
}
export function ThemeListItemLayout({
  themeLabel,
  isActive,
  onThemeItemSelect,
  ...props
}: ThemeListItemProps) {
  return (
    <Box
      width="100%"
      key={themeLabel}
      _hover={
        isActive
          ? undefined
          : {
              backgroundColor: token('colors.brown.2'),
            }
      }
      px="loose"
      py="base"
      onClick={isActive ? undefined : onThemeItemSelect}
      cursor={isActive ? 'default' : 'pointer'}
      {...props}
    >
      <Flex width="100%" justifyContent="space-between" alignItems="center" height="20px">
        <Title fontWeight={400} lineHeight="1rem" display="block" fontFamily="Diatype">
          {themeLabel}
        </Title>
        {isActive && <CheckmarkIcon />}
      </Flex>
    </Box>
  );
}
