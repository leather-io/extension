import { ReactNode } from 'react';

import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

import { listContentStyles } from '../list/list.styles';

interface DropdownMenuLayoutProps {
  children: ReactNode;
  trigger: ReactNode;
}
export function DropdownMenuLayout({ children, trigger }: DropdownMenuLayoutProps) {
  return (
    <RadixDropdownMenu.Root>
      {trigger}
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content align="start" className={listContentStyles} sideOffset={8}>
          {children}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
}
