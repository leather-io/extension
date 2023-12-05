import { useCallback } from 'react';

import { UserSelectedTheme, getThemeLabel } from '@app/common/theme-provider';

import { ThemeListItemLayout } from './theme-list-item-layout';

interface ThemeListItemProps {
  theme: UserSelectedTheme;
  onThemeSelected(theme: UserSelectedTheme): void;
  isActive: boolean;
}
export function ThemeListItem({ theme, onThemeSelected, isActive }: ThemeListItemProps) {
  const themeLabel = getThemeLabel(theme);
  const itemSelectHandler = useCallback(() => {
    onThemeSelected(theme);
  }, [onThemeSelected, theme]);

  return (
    <ThemeListItemLayout
      themeLabel={themeLabel}
      isActive={isActive}
      onThemeItemSelect={itemSelectHandler}
    />
  );
}
