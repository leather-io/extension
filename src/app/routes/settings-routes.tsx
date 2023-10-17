import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ThemesDrawer } from '@app/features/theme-drawer/theme-drawer';
import { SelectNetwork } from '@app/pages/select-network/select-network';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';

export const settingsRoutes = (
  <Route>
    <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDrawer />} />
    <Route path={RouteUrls.ChangeTheme} element={<ThemesDrawer />} />
    <Route path={RouteUrls.SelectNetwork} element={<SelectNetwork />} />
  </Route>
);
