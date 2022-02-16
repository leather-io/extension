import React, { cloneElement, isValidElement } from 'react';
import { Box, BoxProps } from '@stacks/ui';

function Hr(props: BoxProps) {
  return <Box as="hr" width="100%" backgroundColor="#DCDDE2" {...props} />;
}

export function DividerSeparator({ children }: { children: React.ReactNode }) {
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
