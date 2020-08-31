/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/react';
import {
  useCss,
  ForwardRefExoticComponentWithAs,
  memoWithAs,
  forwardRefWithAs,
  BoxProps as SystemProps,
  As,
  Theme,
} from '@stacks/ui-core';

import { Colors, Spacing, Text } from './literal-types';

export type BoxProps = SystemProps<Spacing, Colors, Text> & {
  as?: As;
  style?: React.CSSProperties;
};

export const Box: ForwardRefExoticComponentWithAs<BoxProps, 'div'> = memoWithAs<BoxProps, 'div'>(
  forwardRefWithAs<BoxProps, 'div'>(({ as = 'div', ...props }, ref) => {
    const Component = as || 'div';
    const [styles, allProps] = useCss(props);
    return <Component ref={ref} css={(theme: Theme) => css(styles(theme))} {...allProps} />;
  })
);
