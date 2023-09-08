// #4164 FIXME replace with radix tooltip
// not sure why we have 2 types of tooltip
import { memo, useMemo } from 'react';

import Tippy, { TippyProps } from '@tippyjs/react';
import { BoxProps, styled } from 'leather-styles/jsx';

interface TooltipProps extends TippyProps {
  hideOnClick?: boolean;
  label?: TippyProps['content'];
  labelProps?: BoxProps;
}
export const Tooltip = memo(
  ({ children, hideOnClick, label, labelProps = {}, ...rest }: TooltipProps) => {
    const content = useMemo(
      () => (
        <styled.span display="block" fontSize={0} {...labelProps}>
          {label}
        </styled.span>
      ),
      [labelProps, label]
    );
    if (!label) return <>{children}</>;
    return (
      <Tippy content={content} hideOnClick={hideOnClick} trigger="mouseenter" {...rest}>
        {children}
      </Tippy>
    );
  }
);
