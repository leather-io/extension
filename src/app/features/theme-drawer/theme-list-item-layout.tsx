import { Box, BoxProps, Flex, color } from '@stacks/ui';

import { CheckmarkIcon } from '@app/components/icons/checkmark-icon';
import { Title } from '@app/components/typography';

interface ThemeListItemProps extends BoxProps {
  themeLabel: string;
  isActive: boolean;
  onThemeItemSelect: () => void;
}
export const ThemeListItemLayout = ({
  themeLabel,
  isActive,
  onThemeItemSelect,
  ...props
}: ThemeListItemProps) => {
  return (
    <Box
      width="100%"
      key={themeLabel}
      _hover={
        isActive
          ? undefined
          : {
              backgroundColor: color('bg-4'),
            }
      }
      px="loose"
      py="base"
      onClick={isActive ? undefined : onThemeItemSelect}
      cursor={isActive ? 'default' : 'pointer'}
      {...props}
    >
      <Flex width="100%" justifyContent="space-between" alignItems="center" height="20px">
        <Title fontWeight={400} lineHeight="1rem" fontSize={2} display="block" fontFamily="'Inter'">
          {themeLabel}
        </Title>
        {isActive && <CheckmarkIcon />}
      </Flex>
    </Box>
  );
};
