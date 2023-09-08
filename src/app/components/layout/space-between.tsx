import { forwardRefWithAs } from '@stacks/ui-core';
import { HStack, HstackProps } from 'leather-styles/jsx';

// #4164 FIXME migrate - could be able to replace this <SpaceBetween with a different Panda prop
export const SpaceBetween = forwardRefWithAs<HstackProps, 'div'>((props, ref) => (
  <HStack alignItems="center" justifyContent="space-between" {...props} ref={ref} />
));
