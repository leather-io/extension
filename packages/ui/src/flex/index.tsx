import * as React from 'react';
import { Box } from '../box';
import { forwardRefWithAs, ForwardRefExoticComponentWithAs } from '@stacks/ui-core';
import { FlexProps } from './types';

export const Flex: ForwardRefExoticComponentWithAs<
  FlexProps,
  'div'
> = forwardRefWithAs((props, ref) => <Box display="flex" ref={ref} {...props} />);

export { FlexProps };
