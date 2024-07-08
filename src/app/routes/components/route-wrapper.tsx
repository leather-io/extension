import { Navigate, Route, Routes } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { RouterErrorBoundary } from '@app/features/errors/app-error-boundary';

interface RouteWrapperProps {
  children: React.ReactNode;
  layout: React.ReactNode;
}
export function RouteWrapper({ children, layout }: RouteWrapperProps) {
  return (
    <Routes>
      {/* TODO wrap common Route stuff - accept layout and children and always have error boundary + catch all
       also refactor the routes to split them up into smaller files by category
*/}
      <Route element={layout}>
        <Route key="error" errorElement={<RouterErrorBoundary />}>
          {children}
          {/* Catch-all route redirects to onboarding */}
          <Route path="*" element={<Navigate replace to={RouteUrls.Onboarding} />} />
        </Route>
      </Route>
    </Routes>
  );
}
