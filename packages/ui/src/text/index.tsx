import * as React from 'react';
import { Box, BoxProps } from '../box';
import { forwardRefWithAs, ForwardRefExoticComponentWithAs } from '@stacks/ui-core';

export const Text: ForwardRefExoticComponentWithAs<BoxProps, 'span'> = forwardRefWithAs<
  BoxProps,
  'span'
>((props: BoxProps, ref) => <Box as="span" ref={ref} {...props} />);
