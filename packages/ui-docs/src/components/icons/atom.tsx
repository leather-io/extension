import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { SVGProps } from 'react';

export const AtomIcon: React.FC<BoxProps & SVGProps<any>> = props => (
  <Box
    as="svg"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <line x1="12" y1="12" x2="12" y2="12.01" />
    <path
      d="M12 2a4 10 0 0 0 -4 10a4 10 0 0 0 4 10a4 10 0 0 0 4 -10a4 10 0 0 0 -4 -10"
      transform="rotate(45 12 12)"
    />
    <path
      d="M12 2a4 10 0 0 0 -4 10a4 10 0 0 0 4 10a4 10 0 0 0 4 -10a4 10 0 0 0 -4 -10"
      transform="rotate(-45 12 12)"
    />
  </Box>
);
