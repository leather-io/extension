import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const LayersIntersectIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <rect x="8" y="4" width="12" height="12" rx="2" />
    <rect x="4" y="8" width="12" height="12" rx="2" />
  </BaseSvg>
);
