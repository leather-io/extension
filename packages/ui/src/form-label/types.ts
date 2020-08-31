import * as React from 'react';
import { BoxProps } from '../box';

interface LabelPropsBase {
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  children?: React.ReactNode;
}

export type FormLabelProps = LabelPropsBase &
  BoxProps &
  React.LabelHTMLAttributes<HTMLLabelElement>;
