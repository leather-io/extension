/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/react';
import { Box, BoxProps } from '../box';

const visuallyHidden = css`
  border: 0px;
  clip: rect(0px, 0px, 0px, 0px);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0px;
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
`;

export const VisuallyHidden: React.FC<BoxProps> = props => (
  <Box css={visuallyHidden as any} {...props} />
);
