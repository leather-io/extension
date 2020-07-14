import React, { forwardRef, Ref } from 'react';
import { Box, color } from '@blockstack/ui';
import { LinkProps } from '@components/typography';

export const IconButton = forwardRef((props: LinkProps, ref: Ref<HTMLDivElement>) => (
  <Box cursor="pointer">
    <Box
      p="tight"
      borderRadius="4px"
      _hover={{ bg: color('bg-alt') }}
      color={color('invert')}
      ref={ref}
      {...props}
    />
  </Box>
));
