import { createRoot } from 'react-dom/client';

import { styled } from 'leather-styles/jsx';

import './index.css';

export function ScamWarningIframe() {
  return (
    <styled.h1 textStyle="display.02" mt="space.10">
      ⚠️ This website is a massive scam ⚠️
    </styled.h1>
  );
}

async function renderApp() {
  document.getElementById('splash-screen')?.remove();
  const container = document.getElementById('app');
  return createRoot(container!).render(<ScamWarningIframe />);
}

void renderApp();
