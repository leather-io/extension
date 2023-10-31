import { forwardRef } from 'react';

import { BoxProps, styled } from 'leather-styles/jsx';

export const Title = forwardRef<HTMLSpanElement, BoxProps>(({ children, ...props }, ref) => (
  <styled.span
    color="accent.text-primary"
    display="block"
    ref={ref}
    textStyle="label.01"
    {...props}
  >
    {children}
  </styled.span>
));
