import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { SVGProps } from 'react';

export const PaintIcon: React.FC<BoxProps & SVGProps<any>> = props => (
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
    <rect x="5" y="3" width="14" height="6" rx="2" />
    <path d="M19 6h1a2 2 0 0 1 2 2a5 5 0 0 1 -5 5l-5 0v2" />
    <rect x="10" y="15" width="4" height="6" rx="1" />
  </Box>
);
