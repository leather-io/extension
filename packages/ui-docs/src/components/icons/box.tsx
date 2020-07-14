import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const BoxIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
    <line x1="12" y1="12" x2="20" y2="7.5" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <line x1="12" y1="12" x2="4" y2="7.5" />
  </BaseSvg>
);
