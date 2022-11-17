import React, { cloneElement, isValidElement } from 'react';

import { Box, BoxProps } from '@stacks/ui';

function Hr(props: BoxProps) {
  return <Box as="hr" width="100%" backgroundColor="#DCDDE2" {...props} />;
}

interface DividerSeparatorProps extends BoxProps {
  children: React.ReactNode;
}
export function DividerSeparator({ children, ...props }: DividerSeparatorProps) {
  const parsedChildren = Array.isArray(children) ? children : [children];

  return (
    <>
      {parsedChildren
        .flatMap((child, index) => {
          if (!isValidElement(child)) return null;
          return [
            cloneElement(child, {
              key: index,
            }),
            <Hr {...props} key={index.toString() + '-hr'} />,
          ];
        })
        .filter((_value, index, array) => index !== array.length - 1)}
    </>
  );
}
