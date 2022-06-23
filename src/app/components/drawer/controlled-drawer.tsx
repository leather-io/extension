import { ReactNode } from 'react';

import { BaseDrawer } from './base-drawer';

interface ControlledDrawerProps {
  enableGoBack?: boolean;
  icon?: JSX.Element;
  children?: ReactNode;
  isShowing: boolean;
  onClose(): void;
  title?: string;
}
// The visibility of this drawer is controlled by an atom
export function ControlledDrawer(props: ControlledDrawerProps) {
  const { enableGoBack, children, icon, isShowing, onClose, title } = props;

  return (
    <BaseDrawer
      enableGoBack={enableGoBack}
      icon={icon}
      isShowing={isShowing}
      onClose={onClose}
      title={title}
    >
      {children}
    </BaseDrawer>
  );
}
