import { useCallback } from 'react';

import { Flex, FlexProps } from '@stacks/ui';
import { SettingsSelectors } from '@tests-legacy/integration/settings.selectors';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { UserSelectedTheme, themeLabelMap, useThemeSwitcher } from '@app/common/theme-provider';

import { ThemeListItem } from './theme-list-item';

export const ThemeList = (props: FlexProps) => {
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
    <Flex flexWrap="wrap" flexDirection="column" pb="extra-loose" {...props}>
      {themes.map(theme => (
        <ThemeListItem
          key={theme}
          data-testid={SettingsSelectors.NetworkListItem}
          theme={theme}
          onThemeSelected={handleThemeSelected}
          isActive={theme === userSelectedTheme}
        />
      ))}
    </Flex>
  );
};
