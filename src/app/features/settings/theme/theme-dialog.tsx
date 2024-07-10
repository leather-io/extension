import { useCallback } from 'react';

import { Dialog } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { UserSelectedTheme, themeLabelMap, useThemeSwitcher } from '@app/common/theme-provider';
import { DialogHeader } from '@app/components/layout/dialog-header';

import { ThemeListItem } from './theme-list-item';

interface ThemeDialogProps {
  onClose(): void;
}

export function ThemeDialog({ onClose }: ThemeDialogProps) {
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
    <Dialog header={<DialogHeader title="Change theme" />} isShowing onClose={onClose}>
      {themes.map(theme => (
        <ThemeListItem
          key={theme}
          theme={theme}
          onThemeSelected={handleThemeSelected}
          isActive={theme === userSelectedTheme}
        />
      ))}
    </Dialog>
  );
}
