import { useNavigate } from 'react-router-dom';

import { useBackgroundLocationRedirect } from '@app/common/hooks/use-background-location-redirect';
import { useLocationState } from '@app/common/hooks/use-location-state';
import { BaseDrawer } from '@app/components/drawer/base-drawer';

import { ThemeList } from './theme-list';

export function ThemesDrawer() {
  useBackgroundLocationRedirect();
  const navigate = useNavigate();
  const backgroundLocation = useLocationState('backgroundLocation');
  return (
    <BaseDrawer title="Select Theme" isShowing onClose={() => navigate(backgroundLocation)}>
      <ThemeList />
    </BaseDrawer>
  );
}
