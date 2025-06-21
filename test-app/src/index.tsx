import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@components/app';

const container = document.getElementById('app-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  throw new Error('Root container not found');
}
