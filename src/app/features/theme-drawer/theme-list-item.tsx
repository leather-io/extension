import { useCallback } from 'react';

import { BoxProps } from '@stacks/ui';

import { UserSelectedTheme, getThemeLabel } from '@app/common/theme-provider';

import { ThemeListItemLayout } from './theme-list-item-layout';

interface ThemeListItemProps extends BoxProps {
  theme: UserSelectedTheme;
  onThemeSelected: (theme: UserSelectedTheme) => void;
  isActive: boolean;
}
export const ThemeListItem = ({
  theme,
  onThemeSelected,
  isActive,
  ...props
}: ThemeListItemProps) => {
  const themeLabel = getThemeLabel(theme);
  const itemSelectHandler = useCallback(() => {
    onThemeSelected(theme);
  }, [onThemeSelected, theme]);

  return (
    <ThemeListItemLayout
      themeLabel={themeLabel}
      isActive={isActive}
      onThemeItemSelect={itemSelectHandler}
      {...props}
    />
  );
};
