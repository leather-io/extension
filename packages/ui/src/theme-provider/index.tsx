import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { theme as defaultTheme, Theme } from '../theme';

export const ThemeContext = React.createContext(defaultTheme);

const ThemeProvider: React.FC<{ theme?: Theme; children: any }> = ({
  theme = defaultTheme,
  children,
}) => <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;

export { ThemeProvider };
