import { useNavigate } from 'react-router-dom';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { RouteUrls } from '@shared/route-urls';
import { ThemeList } from './theme-list';

export function ThemesDrawer() {
  const navigate = useNavigate();
  return (
    <BaseDrawer
      title="Select Theme"
      isShowing
      onClose={() => {
        navigate(RouteUrls.Home);
      }}
    >
      <ThemeList />
    </BaseDrawer>
  );
}
