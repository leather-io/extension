import { FlexProps } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';
import { Footer } from '@app/components/layout';

//  FlexProps should omit margin, padding etc as absolutly positioned. check whats actually used - passed to <CardFooter>
export function CardFooter({ children, ...props }: HasChildren & FlexProps) {
  return (
    <Footer
      position="absolute"
      // borderBottomRadius="md"
      // rounded="lg"
      // maxWidth="498px" // TODO improve pageWidth - 2px to account for border width so it doesn't disappear
      // now this maxWidth seems not needed at all! maybe the relative above is enough???
      borderTop="none"
      borderBottom={{ base: 'unset', sm: 'default' }}
      // rounded="lg"
      // bottom="space.01"
      {...props}
    >
      {children}
    </Footer>
  );
}
