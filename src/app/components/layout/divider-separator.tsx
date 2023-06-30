import React, { cloneElement, isValidElement } from 'react';

import { BoxProps } from '@stacks/ui';

import { Hr } from '../hr';

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
