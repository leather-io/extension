import { useCallback } from 'react';

import { Sheet, SheetHeader } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { UserSelectedTheme, themeLabelMap, useThemeSwitcher } from '@app/common/theme-provider';

import { ThemeListItem } from './theme-list-item';

interface ThemeSheetProps {
  onClose(): void;
}

export function ThemeSheet({ onClose }: ThemeSheetProps) {
  const themes = Object.keys(themeLabelMap) as UserSelectedTheme[];

  const { setUserSelectedTheme } = useThemeSwitcher();

  const handleThemeSelected = useCallback(
    (theme: UserSelectedTheme) => {
      void analytics.track(`select_theme`, {
        theme,
      });
      setUserSelectedTheme(theme);
    },
    [setUserSelectedTheme]
  );

  const { userSelectedTheme } = useThemeSwitcher();

  return (
    <Sheet header={<SheetHeader title="Change theme" />} isShowing onClose={onClose}>
      {themes.map(theme => (
        <ThemeListItem
          key={theme}
          theme={theme}
          onThemeSelected={handleThemeSelected}
          isActive={theme === userSelectedTheme}
        />
      ))}
    </Sheet>
  );
}
