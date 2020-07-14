import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { SVGProps } from 'react';

export const PackageIcon: React.FC<BoxProps & SVGProps<any>> = props => (
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
    <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
    <line x1="12" y1="12" x2="20" y2="7.5" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <line x1="12" y1="12" x2="4" y2="7.5" />
    <line x1="16" y1="5.25" x2="8" y2="9.75" />
  </Box>
);
