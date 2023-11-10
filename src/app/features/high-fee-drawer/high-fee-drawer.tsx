import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { ControlledDrawer } from '@app/components/drawer/controlled-drawer';

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
      // #4476 FIXME update this icon
      icon={<FiAlertTriangle color="error.label" size="icon.lg" />}
      isShowing={isShowingHighFeeConfirmation}
      onClose={() => setIsShowingHighFeeConfirmation(false)}
    >
      {isShowingHighFeeConfirmation && <HighFeeConfirmation learnMoreUrl={learnMoreUrl} />}
    </ControlledDrawer>
  );
}
