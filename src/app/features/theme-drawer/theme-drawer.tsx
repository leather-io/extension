import { useNavigate } from 'react-router-dom';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';

import { ThemeList } from './theme-list';

export function ThemesDrawer() {
  useBackgroundLocationRedirect();
  const navigate = useNavigate();
  const backgroundLocation = useLocationState<Location>('backgroundLocation');
  return (
    <BaseDrawer title="Select Theme" isShowing onClose={() => navigate(backgroundLocation ?? '..')}>
      <ThemeList />
    </BaseDrawer>
  );
}
