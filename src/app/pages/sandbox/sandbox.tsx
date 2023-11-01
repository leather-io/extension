import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { SandboxButtons } from './sandbox-buttons';
import { SandboxContainer } from './sandbox-container';
import { SandboxElements } from './sandbox-elements';
import { SandboxTypography } from './sandbox-typography';

export const sandboxRoutes = (
  <Route element={<SandboxContainer />}>
    <Route path={RouteUrls.Sandbox} element={<SandboxElements />} />
    <Route path={RouteUrls.SandboxButtons} element={<SandboxButtons />} />
    <Route path={RouteUrls.SandboxTypography} element={<SandboxTypography />} />
  </Route>
);
