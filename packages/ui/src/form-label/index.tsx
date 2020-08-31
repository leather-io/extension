import React from 'react';
import { Box } from '../box';
import { Text } from '../text';
import { FormLabelProps } from './types';

export * from './types';

/* eslint react/no-children-prop: 0 */
export const RequiredIndicator = (props: any) => (
  <Box as="span" ml={1} color="red" aria-hidden="true" children="*" {...props} />
);

/**
 * FormLabel is used for form inputs and controls.
 * It reads from the `FormControl` context to handle it's styles for
 * the various form states.
 */
export const FormLabel: React.FC<FormLabelProps> = (
  { children, isDisabled, isRequired, ...props },
  ref
) => {
  return (
    <Text
      ref={ref}
      pb="4px"
      opacity={isDisabled ? 0.4 : 1}
      textAlign="left"
      verticalAlign="middle"
      display="inline-block"
      as="label"
      textStyle="body.small.medium"
      {...props}
    >
      {children}
      {isRequired && <RequiredIndicator />}
    </Text>
  );
};

FormLabel.displayName = 'FormLabel';

export default FormLabel;
