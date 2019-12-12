import React from 'react';
import logo from './logo.svg';
import './App.css';
import { authenticate } from '@blockstack/connect'
import { useState } from 'react';

const App: React.FC = () => {
  const [authResponse, setAuthResponse] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {authResponse && (
          <span id="auth-response">{authResponse}</span>
        )}
        <a
          className="App-link"
          id="auth-action"
          href="#"
          onClick={() => authenticate({
            redirectTo: '/',
            manifestPath: '/manifest.json',
            vaultUrl: 'http://localhost:8080',
            finished: ({ authResponse }) => {
              setAuthResponse(authResponse);
            },
            appDetails: {
              name: 'Tester-Fake-App',
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
