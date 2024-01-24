import { cloneElement, isValidElement } from 'react';

import { Circle, CircleProps } from 'leather-styles/jsx';

export function CaptionSeparatorDot(props: CircleProps) {
  return <Circle display="inline-flex" backgroundColor="currentColor" size="3px" {...props} />;
}

interface CaptionDotSeparatorProps {
  children: React.ReactNode;
}
export function CaptionDotSeparator({ children }: CaptionDotSeparatorProps) {
  const parsedChildren = Array.isArray(children) ? children : [children];
  const content = parsedChildren
    .flatMap((child, index) => {
      if (!isValidElement(child)) return null;
      return [cloneElement(child, { key: index }), <CaptionSeparatorDot key={index + 'dot'} />];
    })
    .filter(val => val !== null)
    .slice(0, -1);
  return <>{content}</>;
}
