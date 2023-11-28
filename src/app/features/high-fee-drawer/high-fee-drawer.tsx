import { useEffect } from 'react';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';
import { ErrorIcon } from '@app/ui/components/icons/error-icon';

import { HighFeeConfirmation } from './components/high-fee-confirmation';

export function HighFeeDrawer(props: { learnMoreUrl: string }) {
  const { learnMoreUrl } = props;
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();

  useEffect(() => {
    return () => {
      if (isShowingHighFeeConfirmation) setIsShowingHighFeeConfirmation(false);
    };
  }, [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation]);

  return (
    <ControlledDrawer
      icon={<ErrorIcon color="error.label" size="xl" />}
      isShowing={isShowingHighFeeConfirmation}
      onClose={() => setIsShowingHighFeeConfirmation(false)}
    >
      {isShowingHighFeeConfirmation && <HighFeeConfirmation learnMoreUrl={learnMoreUrl} />}
    </ControlledDrawer>
  );
}
