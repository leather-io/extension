import React from 'react';
import logo from './logo.svg';
import './App.css';
import { authenticate } from '@blockstack/connect'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          id="auth-action"
          href="#"
          onClick={() => authenticate({
            redirectTo: '/',
            manifestPath: '/manifest.json',
            finished: () => {
              console.log('done');
            },
            appDetails: {
              name: 'Tester',
              icon: `${window.location.origin}/logo512.png`
            },
          })}
        >
          Open Authentication
        </a>
      </header>
    </div>
  );
}

export default App;
