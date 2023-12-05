import type { Preview } from '@storybook/react';

import '../src/app/index.css';
import { customViewports } from './viewports';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: 'leather-light-mode',
      values: [
        {
          name: 'leather-light-mode',
          value: '#FFFFFF',
        },
        {
          name: 'leather-dark-mode',
          value: '#12100F',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        ...customViewports,
      },
    },
    toc: true,
  },
};

export default preview;
