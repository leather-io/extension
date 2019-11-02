import React from "react"
import { ThemeProvider, theme } from '@blockstack/ui'

const ThemeDecorator = (storyFn: any) => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
)

export default ThemeDecorator