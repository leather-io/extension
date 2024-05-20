import { forwardRef } from 'react';

import { HTMLStyledProps, styled } from 'leather-styles/jsx';

export const Caption = forwardRef<HTMLSpanElement, HTMLStyledProps<'span'>>(
  ({ children, ...props }, ref) => (
    <styled.span
      _disabled={{ color: 'ink.text-non-interactive' }}
      color="ink.text-subdued"
      ref={ref}
      textStyle="caption.01"
      {...props}
    >
      {children}
    </styled.span>
  )
);
