import { Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { useLocationState } from '@app/common/hooks/use-location-state';

/* 
   To overlay modal on nested routes backgroundLocation is used 
   to trick the router into thinking its on the same page
 */
interface ModalBackgroundWrapperProps {
  children: React.ReactNode;
}
export function ModalBackgroundWrapper({ children }: ModalBackgroundWrapperProps) {
  const location = useLocation();
  const backgroundLocation = useLocationState<Location>('backgroundLocation');

  return (
    <>
      <Routes location={backgroundLocation || location}>
        {children}
        <Route path="*" element={<Outlet />} />
      </Routes>
      {backgroundLocation && <Outlet />}
    </>
  );
}
