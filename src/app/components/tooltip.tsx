import { memo, useMemo } from 'react';

import { Box, BoxProps } from '@stacks/ui';
import Tippy, { TippyProps } from '@tippyjs/react';

interface TooltipProps extends TippyProps {
  hideOnClick?: boolean;
  label?: TippyProps['content'];
  labelProps?: BoxProps;
}
export const Tooltip = memo(
  ({ children, hideOnClick, label, labelProps = {}, ...rest }: TooltipProps) => {
    const content = useMemo(
      () => (
        <Box as="span" display="block" fontSize={0} {...labelProps}>
          {label}
        </Box>
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
