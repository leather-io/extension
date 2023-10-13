import { ReactNode } from 'react';

import { BaseDrawer } from './base-drawer';

interface ControlledDrawerProps {
  children?: ReactNode;
  enableGoBack?: boolean;
  icon?: React.JSX.Element;
  isShowing: boolean;
  onClose(): void;
  pauseOnClickOutside?: boolean;
  title?: string;
}
// The visibility of this drawer is controlled by an atom
export function ControlledDrawer(props: ControlledDrawerProps) {
  const { children, enableGoBack, icon, isShowing, onClose, pauseOnClickOutside, title } = props;

  return (
    <BaseDrawer
      height="100vh"
      position={['absolute', 'fixed']}
      top={['-24px', 0]}
      enableGoBack={enableGoBack}
      icon={icon}
      isShowing={isShowing}
      onClose={onClose}
      pauseOnClickOutside={pauseOnClickOutside}
      title={title}
    >
      {children}
    </BaseDrawer>
  );
}
