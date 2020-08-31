import * as React from 'react';
import { Box } from '../box';
import { forwardRefWithAs, ForwardRefExoticComponentWithAs } from '@stacks/ui-core';
import { GridProps } from './types';

export const Grid: ForwardRefExoticComponentWithAs<
  GridProps,
  'div'
> = forwardRefWithAs((props, ref) => <Box display="grid" ref={ref} {...props} />);

export { GridProps };
