import { cloneElement, isValidElement } from 'react';

import { CaptionSeparatorDot } from './typography';

interface CaptionDotSeparatorProps {
  children: React.ReactNode;
}
export function CaptionDotSeparator({ children }: CaptionDotSeparatorProps) {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const content = parsedChildren
    .flatMap((child, index) => {
      if (!isValidElement(child)) return null;
      return [cloneElement(child, { key: index }), <CaptionSeparatorDot key={index + 1} />];
    })
    .filter(val => val !== null)
    .slice(0, -1);
  return <>{content}</>;
}
