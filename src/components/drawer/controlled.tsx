import React from 'react';
import { BaseDrawer } from '.';

interface ControlledDrawerProps {
  /** The atom used to represent the visibility state of this drawer */
  /** An optional callback that is fired _after_ visibility has been turned off. */
  onClose: () => void;
  isShowing: boolean;
  title: string | JSX.Element;
}

/**
 * `ControlledDrawer` is a wrapper around our `BaseDrawer` component.
 * It expects an atom to be used that manages the visibility of this drawer.
 */
export const ControlledDrawer: React.FC<ControlledDrawerProps> = ({
  onClose,
  isShowing,
  title,
  children,
}) => {
  return (
    <BaseDrawer title={title} isShowing={isShowing} onClose={onClose}>
      {children}
    </BaseDrawer>
  );
};
