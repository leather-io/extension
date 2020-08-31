import React from 'react';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
import { Box } from '../box';
import { InputProps } from './types';

import useInputStyle from './styles';

export * from './types';

export const Input: ForwardRefExoticComponentWithAs<InputProps, 'input'> = forwardRefWithAs<
  InputProps,
  'input'
>((props, ref) => {
  const {
    as = 'input',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    isReadOnly,
    isFullWidth,
    isDisabled,
    isInvalid,
    isRequired,
    style = {},
    ...rest
  } = props;

  const inputStyleProps = useInputStyle(props);

  return (
    <Box
      ref={ref}
      as={as}
      _readOnly={isReadOnly}
      aria-readonly={isReadOnly}
      isDisabled={isDisabled}
      aria-label={ariaLabel}
      aria-invalid={isInvalid}
      isRequired={isRequired}
      aria-required={isRequired}
      aria-disabled={isDisabled}
      aria-describedby={ariaDescribedby}
      textStyle="body.small"
      style={{ WebkitAppearance: 'none', ...style }}
      {...(inputStyleProps as any)}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
