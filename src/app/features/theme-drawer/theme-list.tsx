import { useCallback } from 'react';

import { Flex, FlexProps } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { UserSelectedTheme, themeLabelMap, useThemeSwitcher } from '@app/common/theme-provider';

import { ThemeListItem } from './theme-list-item';

export function ThemeList(props: FlexProps) {
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
    <Flex flexDirection="column" flexWrap="wrap" pb="space.06" {...props}>
      {themes.map(theme => (
        <ThemeListItem
          key={theme}
          theme={theme}
          onThemeSelected={handleThemeSelected}
          isActive={theme === userSelectedTheme}
        />
      ))}
    </Flex>
  );
}
