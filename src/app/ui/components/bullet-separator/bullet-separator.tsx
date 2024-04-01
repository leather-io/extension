import { cloneElement, isValidElement } from 'react';

import { Circle, CircleProps } from 'leather-styles/jsx';
import type { SpacingToken } from 'leather-styles/tokens';

export function BulletOperator(props: CircleProps) {
  return (
    <Circle
      display="inline-block"
      verticalAlign="middle"
      bg="currentColor"
      size="3px"
      // Visual adjustment for correct centering on retina displays
      transform="translateY(-0.5px)"
      {...props}
    />
  );
}

interface BulletSeparatorSeparatorProps {
  children: React.ReactNode;
  spacing?: SpacingToken;
}
export function BulletSeparator({ children, spacing }: BulletSeparatorSeparatorProps) {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const content = parsedChildren
    .flatMap((child, index) => {
      if (!isValidElement(child)) return null;
      return [
        cloneElement(child, { key: index }),
        <BulletOperator key={index + 'dot'} mx={spacing} />,
      ];
    })
    .filter(val => val !== null)
    .slice(0, -1);
  return <>{content}</>;
}
