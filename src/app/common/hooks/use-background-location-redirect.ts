// import { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// // import { RouteUrls } from '@shared/route-urls';
// import { useLocationState } from '@app/common/hooks/use-location-state';

// PETE this is the last thing
// - test opening in new tabs
// - find what fails and where then apply Kyrans advice
// - I think it works everywhere but Home tabs

/*
when modals are opened in a new tab they lose the location.state.backgroundLocation
 this hook sets the backgroundLocation to be RouteUrls.Home to improve UX
*/

// export function useBackgroundLocationRedirect() {
//   const { pathname, state } = useLocation();
//   const navigate = useNavigate();
//   const backgroundLocation = useLocationState('backgroundLocation');

//   // console.log('backgroundLocation', backgroundLocation);
//   // debugger;
//   useEffect(() => {
//     void (async () => {
//       // if (backgroundLocation === undefined) {
//       //   return navigate(pathname, {
//       //     state: { backgroundLocation: { pathname: RouteUrls.Home }, ...state },
//       //   });
//       // }
//       return false;
//     })();
//   }, [backgroundLocation, navigate, pathname, state]);
// }
