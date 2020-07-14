import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const StackIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <polyline points="12 4 4 8 12 12 20 8 12 4" />
    <polyline points="4 12 12 16 20 12" />
    <polyline points="4 16 12 20 20 16" />
  </BaseSvg>
);
