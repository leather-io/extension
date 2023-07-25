// https://codesandbox.io/s/react-router-portals-vikq5?file=/src/Portal.js:0-197
import { createPortal } from 'react-dom';

const portal = document.getElementById('portal');

const Portal = ({ children }: { children: any }) => {
  return createPortal(children, portal!) as React.ReactNode;
};

export default Portal;
// https://stackoverflow.com/questions/46393642/how-to-use-reactdom-createportal-in-react-16
// https://codesandbox.io/s/42x771ykwx?file=/index.js:2224-2234
// http://www.recompile.in/2020/01/create-modal-with-react-portal-and.html

//Maybe this???
// https://stackoverflow.com/questions/28802179/how-to-create-a-react-modal-which-is-appended-to-body-with-transitions
// https://www.npmjs.com/package/react-portal?

// PETE
// // DAMN - this works but still unmounts the balances list behind :(  data-testid="balances-list"
// // could be close though??
// Could try react-portal plugin?
// Re-jig where I create the portal from?

// Maybe I need to use a nested route?

// Basically - I need to:
// - open a modal in a new place
// - not unmount the base component

// is this even possible?
// May need to look into the structure of the routes too

// REACT router - stacking components?

// Give this a try on Monday
// https://dev.to/devmdmamun/create-contextual-modal-navigation-with-react-router-v6-28k2

// seems like the way to keep a modal on top and background content
