import { FlexProps } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';
import { Footer } from '@app/components/layout';

//  FlexProps should omit margin, padding etc as absolutly positioned. check whats actually used - passed to <CardFooter>
export function CardFooter({ children, ...props }: HasChildren & FlexProps) {
  return (
    <Footer
      position="absolute"
      borderTop="none"
      borderBottomLeftRadius="lg"
      borderBottomRightRadius="lg"
      {...props}
    >
      {children}
    </Footer>
  );
}
