import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Box, color } from '@stacks/ui';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { ControlledDrawer } from '@app/components/drawer/controlled';

import { HighFeeConfirmation } from './components/high-fee-confirmation';

export function HighFeeDrawer(): JSX.Element {
  const { showHighFeeConfirmation, setShowHighFeeConfirmation } = useDrawers();

  useEffect(() => {
    return () => {
      if (showHighFeeConfirmation) setShowHighFeeConfirmation(false);
    };
  }, [showHighFeeConfirmation, setShowHighFeeConfirmation]);

  return (
    <ControlledDrawer
      title={<Box as={FiAlertTriangle} color={color('feedback-error')} size="36px" />}
      isShowing={!!showHighFeeConfirmation}
      onClose={() => setShowHighFeeConfirmation(false)}
    >
      {showHighFeeConfirmation && <HighFeeConfirmation />}
    </ControlledDrawer>
  );
}
