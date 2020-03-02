import * as React from 'react';
import { Svg } from '../svg';
import { BoxProps } from '../box';

export const PrivateIcon: React.FC<BoxProps> = props => (
  <Svg width="18" height="24" viewBox="0 0 18 24" fill="none" {...props}>
    <path
      d="M15.5455 8.57143H14.7273V6C14.7273 4.4087 14.1239 2.88258 13.0498 1.75736C11.9757 0.632141 10.519 0 9 0C7.48103 0 6.02428 0.632141 4.95021 1.75736C3.87614 2.88258 3.27273 4.4087 3.27273 6V8.57143H2.45455C1.80378 8.57218 1.17987 8.84334 0.719709 9.32541C0.259547 9.80748 0.000714665 10.4611 0 11.1429V21.4286C0.000714665 22.1103 0.259547 22.7639 0.719709 23.246C1.17987 23.7281 1.80378 23.9993 2.45455 24H15.5455C16.1962 23.9993 16.8201 23.7281 17.2803 23.246C17.7405 22.7639 17.9993 22.1103 18 21.4286V11.1429C17.9993 10.4611 17.7405 9.80748 17.2803 9.32541C16.8201 8.84334 16.1962 8.57218 15.5455 8.57143ZM4.90909 6C4.90909 4.86336 5.3401 3.77327 6.10729 2.96954C6.87449 2.16582 7.91502 1.71429 9 1.71429C10.085 1.71429 11.1255 2.16582 11.8927 2.96954C12.6599 3.77327 13.0909 4.86336 13.0909 6V8.57143H4.90909V6Z"
      fill="currentColor"
    />
  </Svg>
);
