import { createContext, useContext, useEffect, useState } from 'react';

import { Theme as RadixTheme } from '@radix-ui/themes';

import { noop } from '@shared/utils';

import { store } from '@app/store';
import { settingsActions } from '@app/store/settings/settings.actions';
import { useUserSelectedTheme } from '@app/store/settings/settings.selectors';
import { TooltipProvider } from '@app/ui/components/tooltip/tooltip';

import { useOnMount } from './hooks/use-on-mount';

export const themeLabelMap = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export type UserSelectedTheme = keyof typeof themeLabelMap;
type ComputedTheme = keyof Pick<typeof themeLabelMap, 'light' | 'dark'>;

export const getThemeLabel = (theme: UserSelectedTheme) => {
  return themeLabelMap[theme];
};

const ThemeContext = createContext<{
  theme: ComputedTheme;
  userSelectedTheme: UserSelectedTheme;
  setUserSelectedTheme(theme: UserSelectedTheme): void;
}>({
  // These values are not used, but are set to satisfy the context's value type.
  theme: 'light',
  userSelectedTheme: 'system',
  setUserSelectedTheme: noop,
});

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function getComputedTheme(userSelectedTheme: UserSelectedTheme): ComputedTheme {
  if (userSelectedTheme === 'system') return getSystemTheme();
  return userSelectedTheme;
}

function setUserSelectedTheme(theme: UserSelectedTheme) {
  store.dispatch(settingsActions.setUserSelectedTheme(theme));
}

interface ThemeSwitcherProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

function removeSplashScreen() {
  document.getElementById('splash-screen')?.remove();
}

export function ThemeSwitcherProvider({ children }: ThemeSwitcherProviderProps) {
  const userSelectedTheme = useUserSelectedTheme();
  const [theme, setTheme] = useState<ComputedTheme>(() => getComputedTheme(userSelectedTheme));

  useOnMount(() => {
    removeSplashScreen();
  });

  useEffect(() => {
    switch (userSelectedTheme) {
      case 'system': {
        setTheme(getSystemTheme());
        const listener = ({ matches }: MediaQueryListEvent) => {
          if (matches) {
            setTheme('dark');
          } else {
            setTheme('light');
          }
        };
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
        return () => {
          window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
        };
      }
      case 'dark': {
        setTheme('dark');
        return;
      }
      case 'light': {
        setTheme('light');
        return;
      }
    }
  }, [setTheme, userSelectedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, userSelectedTheme, setUserSelectedTheme }}>
      <RadixTheme appearance={theme}>
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
      </RadixTheme>
    </ThemeContext.Provider>
  );
}

export const useThemeSwitcher = () => useContext(ThemeContext);
