import { cloneElement, isValidElement } from 'react';

import { BoxProps, styled } from 'leather-styles/jsx';

function CaptionSeparatorDot(props: BoxProps) {
  return (
    <styled.span color="accent.text-subdued" fontSize="10px" {...props}>
      •
    </styled.span>
  );
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
