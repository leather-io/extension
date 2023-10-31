import { forwardRef } from 'react';

import { BoxProps, styled } from 'leather-styles/jsx';

export const Caption = forwardRef<HTMLSpanElement, BoxProps>(({ children, ...props }, ref) => (
  <styled.span
    color="accent.text-subdued"
    display="block"
    ref={ref}
    textStyle="caption.02"
    {...props}
  >
    {children}
  </styled.span>
));
