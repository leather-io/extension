import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

function renderApp() {
  ReactDOM.render(<App />, document.getElementById('actions-root'));
}

renderApp();
