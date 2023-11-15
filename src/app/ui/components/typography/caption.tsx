import { forwardRef } from 'react';

import { BoxProps, styled } from 'leather-styles/jsx';

interface CaptionProps extends BoxProps {
  dataTestId?: string;
}

export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(({ children, ...props }, ref) => (
  <styled.span
    color="accent.text-subdued"
    display="block"
    ref={ref}
    textStyle="caption.02"
    data-testid={props.dataTestId}
    {...props}
  >
    {children}
  </styled.span>
));
