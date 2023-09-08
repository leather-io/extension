import React, { cloneElement, isValidElement } from 'react';

import { Hr } from '../hr';

// FIXME - to be refactored / removed
interface DividerSeparatorProps {
  children: React.ReactNode;
}
export function DividerSeparator({ children }: DividerSeparatorProps) {
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
            <Hr my="base-loose" key={index.toString() + '-hr'} />,
          ];
        })
        .filter((_value, index, array) => index !== array.length - 1)}
    </>
  );
}
