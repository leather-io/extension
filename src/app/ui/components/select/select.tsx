import { ReactNode } from 'react';

import { SelectTrigger } from './select-trigger';
import { SelectLayout } from './select.layout';

interface SelectProps {
  children: ReactNode;
  trigger?: ReactNode;
}
export function Select({ children, trigger }: SelectProps) {
  return <SelectLayout trigger={trigger ?? <SelectTrigger />}>{children}</SelectLayout>;
}
