import { useCallback } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { UserSelectedTheme, themeLabelMap, useThemeSwitcher } from '@app/common/theme-provider';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

import { ThemeListItem } from './theme-list-item';

interface ThemeDialogProps {
  onClose(): void;
}

export function ThemeDialog({ onClose }: ThemeDialogProps) {
  const themes = Object.keys(themeLabelMap) as UserSelectedTheme[];
  const analytics = useAnalytics();
  const { setUserSelectedTheme } = useThemeSwitcher();

  const handleThemeSelected = useCallback(
    (theme: UserSelectedTheme) => {
      void analytics.track(`select_theme`, {
        theme,
      });
      setUserSelectedTheme(theme);
    },
    [analytics, setUserSelectedTheme]
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
