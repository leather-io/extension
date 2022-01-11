import * as React from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import { Box, BoxProps } from '@stacks/ui';
import { memo, useMemo } from 'react';

interface TooltipProps extends TippyProps {
  label?: TippyProps['content'];
  labelProps?: BoxProps;
}
export const Tooltip: React.FC<TooltipProps> = memo(
  ({ label, labelProps = {}, children, ...rest }) => {
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
      <Tippy content={content} trigger="mouseenter" hideOnClick={undefined} {...rest}>
        {children}
      </Tippy>
    );
  }
);
