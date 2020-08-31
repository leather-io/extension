import * as React from 'react';
import { FlexProps } from '../flex';

interface StackPropsBase {
  isInline?: boolean;
  children?: React.ReactNode[] | React.ReactNode;
  spacing?: FlexProps['margin'];
  shouldWrapChildren?: boolean;
}

export type StackProps = StackPropsBase & FlexProps;
