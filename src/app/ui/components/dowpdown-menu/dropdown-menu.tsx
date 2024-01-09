import { ReactNode } from 'react';

import { DropdownMenuTrigger } from './dropdown-menu-trigger';
import { DropdownMenuLayout } from './dropdown-menu.layout';

interface DropdownMenuProps {
  children: ReactNode;
  trigger?: ReactNode;
}
export function DropdownMenu({ children, trigger }: DropdownMenuProps) {
  return (
    <DropdownMenuLayout trigger={trigger ?? <DropdownMenuTrigger />}>{children}</DropdownMenuLayout>
  );
}
