import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

import { Box, color } from '@stacks/ui';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';

import { HighFeeConfirmation } from './components/high-fee-confirmation';

export function HighFeeDrawer(): JSX.Element {
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();

  useEffect(() => {
    return () => {
      if (isShowingHighFeeConfirmation) setIsShowingHighFeeConfirmation(false);
    };
  }, [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation]);

  return (
    <ControlledDrawer
      icon={<Box as={FiAlertTriangle} color={color('feedback-error')} size="36px" />}
      isShowing={!!isShowingHighFeeConfirmation}
      onClose={() => setIsShowingHighFeeConfirmation(false)}
    >
      {isShowingHighFeeConfirmation && <HighFeeConfirmation />}
    </ControlledDrawer>
  );
}
