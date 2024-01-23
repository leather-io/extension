import { forwardRef } from 'react';

import { HTMLStyledProps, styled } from 'leather-styles/jsx';

export const Caption = forwardRef<HTMLSpanElement, HTMLStyledProps<'span'>>(
  ({ children, ...props }, ref) => (
    <styled.span
      _disabled={{ color: 'accent.non-interactive' }}
      color="accent.text-subdued"
      ref={ref}
      textStyle="caption.02"
      {...props}
    >
      {children}
    </styled.span>
  )
);
