import { forwardRef } from 'react';

import { HTMLStyledProps, styled } from 'leather-styles/jsx';

export const Caption = forwardRef<HTMLSpanElement, HTMLStyledProps<'span'>>(
  ({ children, ...props }, ref) => (
    <styled.span
      _disabled={{ color: 'ink.non-interactive' }}
      color="ink.text-subdued"
      ref={ref}
      textStyle="label.03"
      {...props}
    >
      {children}
    </styled.span>
  )
);
