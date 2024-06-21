import { ReactNode, cloneElement, isValidElement } from 'react';

import { Hr, HrProps } from '@leather.io/ui';

interface DividerSeparatorProps extends HrProps {
  children: ReactNode;
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
            <Hr key={index.toString() + '-hr'} {...props} />,
          ];
        })
        .filter((_value, index, array) => index !== array.length - 1)}
    </>
  );
}
