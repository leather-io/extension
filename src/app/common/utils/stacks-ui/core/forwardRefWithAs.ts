import * as React from 'react';

import { As, ForwardRefExoticComponentWithAs, ForwardRefWithAsRenderFunction } from './types';

export function forwardRefWithAs<Props, ComponentType extends As = 'div'>(
  render: ForwardRefWithAsRenderFunction<Props, ComponentType>
) {
  return React.forwardRef(render) as unknown as ForwardRefExoticComponentWithAs<
    Props,
    ComponentType
  >;
}
