/**
 * This doesnt work quite right yet. It opens a new window, but has nothing from next.js. It's all by itself, with no next.js code.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, CSSReset, theme } from '@blockstack/ui';

const PortalContainer = props => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CSSReset />
        {props.children}
      </ThemeProvider>
    </>
  );
};

const Window = ({ children }) => {
  const [state, setState] = React.useState({ win: null, el: null });

  React.useEffect(() => {
    let win = window.open('', '', 'width=440,height=584,left=200,top=200');
    win.document.title = 'Continue with Data Vault';
    let el = document.createElement('div');
    win.document.body.appendChild(el);
    setState({ win, el });

    return () => state.win.close();
  }, []);

  if (!state.el) {
    return null;
  } else {
    return ReactDOM.createPortal(<PortalContainer>{children}</PortalContainer>, state.el);
  }
};

export { Window };
