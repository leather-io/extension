import { FlexProps } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';
import { Footer } from '@app/components/layout';

export function CardFooter({ children, ...props }: HasChildren & FlexProps) {
  return (
    <Footer
      position="absolute"
      borderBottomRadius="md"
      maxWidth="498px" // TODO improve pageWidth - 2px to account for border width so it doesn't disappear
      borderTop="none"
      bottom="space.01"
      {...props}
    >
      {children}
    </Footer>
  );
}
