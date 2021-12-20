import { ReactNode } from 'react';
import { BaseDrawer } from '.';

interface ControlledDrawerProps {
  /** The atom used to represent the visibility state of this drawer */
  /** An optional callback that is fired _after_ visibility has been turned off. */
  onClose: () => void;
  isShowing: boolean;
  title: string | JSX.Element;
  children?: ReactNode;
}

/**
 * `ControlledDrawer` is a wrapper around our `BaseDrawer` component.
 * It expects an atom to be used that manages the visibility of this drawer.
 */
export const ControlledDrawer = ({
  onClose,
  isShowing,
  title,
  children,
}: ControlledDrawerProps) => {
  return (
    <BaseDrawer title={title} isShowing={isShowing} onClose={onClose}>
      {children}
    </BaseDrawer>
  );
};
