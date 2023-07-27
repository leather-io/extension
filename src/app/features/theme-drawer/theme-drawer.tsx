import { useNavigate } from 'react-router-dom';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { BaseDrawer } from '@app/components/drawer/base-drawer';

import { ThemeList } from './theme-list';

export function ThemesDrawer() {
  const navigate = useNavigate();
  const backgroundLocation = useLocationState('backgroundLocation');
  return (
    <BaseDrawer title="Select Theme" isShowing onClose={() => navigate(backgroundLocation || '..')}>
      <ThemeList />
    </BaseDrawer>
  );
}
