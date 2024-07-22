import { FlexProps } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';
import { Footer } from '@app/components/layout';

export function CardFooter({ children, ...props }: HasChildren & FlexProps) {
  return (
    <Footer position="absolute" borderBottomRadius="md" borderTop="none" {...props}>
      {children}
    </Footer>
  );
}
