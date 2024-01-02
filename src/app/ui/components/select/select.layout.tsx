import { ReactNode } from 'react';

import * as RadixSelect from '@radix-ui/react-select';

import { listContentStyles } from '../list/list.styles';

interface SelectLayoutProps {
  children: ReactNode;
  trigger: ReactNode;
}
export function SelectLayout({ children, trigger }: SelectLayoutProps) {
  return (
    <RadixSelect.Root>
      {trigger}
      <RadixSelect.Portal>
        <RadixSelect.Content
          align="start"
          className={listContentStyles}
          position="popper"
          sideOffset={8}
        >
          <RadixSelect.Viewport>{children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
