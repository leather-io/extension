import { css } from '@emotion/react';
import { token } from 'leaf-styles/tokens';

export const radixStyles = css`
  .radix-themes {
    --font-size-7: 32px;
    --font-size-8: 44px;
    --font-size-9: 53px;

    --default-font-family: 'Diatype', 'Helvetica Neue', sans-serif;
    --heading-font-family: 'Marche', 'Helvetica Neue', sans-serif;

    --letter-spacing-1: 0;
    --letter-spacing-2: 0;
    --letter-spacing-3: 0;
    --letter-spacing-4: 0;
    --letter-spacing-5: 0;
    --letter-spacing-6: 0;
    --letter-spacing-7: 0;
    --letter-spacing-8: 0;
    --letter-spacing-9: 0;

    // Configured to Diatype
    --font-weight-light: 400;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 500;

    --color-overlay: rgba(0, 0, 0, 0.3);
  }

  :root,
  .light,
  .light-theme {
    --brown-1: ${token('colors.brown.1')};
    --brown-2: ${token('colors.brown.2')};
    --brown-3: ${token('colors.brown.3')};
    --brown-4: ${token('colors.brown.4')};
    --brown-5: ${token('colors.brown.5')};
    --brown-6: ${token('colors.brown.6')};
    --brown-7: ${token('colors.brown.7')};
    --brown-8: ${token('colors.brown.8')};
    --brown-9: ${token('colors.brown.9')};
    --brown-10: ${token('colors.brown.10')};
    --brown-11: ${token('colors.brown.11')};
    --brown-12: ${token('colors.brown.12')};

    --gray-1: ${token('colors.ink.1')};
    --gray-2: ${token('colors.ink.2')};
    --gray-3: ${token('colors.ink.3')};
    --gray-4: ${token('colors.ink.4')};
    --gray-5: ${token('colors.ink.5')};
    --gray-6: ${token('colors.ink.6')};
    --gray-7: ${token('colors.ink.7')};
    --gray-8: ${token('colors.ink.8')};
    --gray-9: ${token('colors.ink.9')};
    --gray-10: ${token('colors.ink.10')};
    --gray-11: ${token('colors.ink.11')};
    --gray-12: ${token('colors.ink.12')};
  }

  .dark,
  .dark-theme {
    --brown-1: ${token('colors.brown.1')};
    --brown-2: ${token('colors.brown.2')};
    --brown-3: ${token('colors.brown.3')};
    --brown-4: ${token('colors.brown.4')};
    --brown-5: ${token('colors.brown.5')};
    --brown-6: ${token('colors.brown.6')};
    --brown-7: ${token('colors.brown.7')};
    --brown-8: ${token('colors.brown.8')};
    --brown-9: ${token('colors.brown.9')};
    --brown-10: ${token('colors.brown.10')};
    --brown-11: ${token('colors.brown.11')};
    --brown-12: ${token('colors.brown.12')};

    --gray-1: ${token('colors.ink.1')};
    --gray-2: ${token('colors.ink.2')};
    --gray-3: ${token('colors.ink.3')};
    --gray-4: ${token('colors.ink.4')};
    --gray-5: ${token('colors.ink.5')};
    --gray-6: ${token('colors.ink.6')};
    --gray-7: ${token('colors.ink.7')};
    --gray-8: ${token('colors.ink.8')};
    --gray-9: ${token('colors.ink.9')};
    --gray-10: ${token('colors.ink.10')};
    --gray-11: ${token('colors.ink.11')};
    --gray-12: ${token('colors.ink.12')};
  }

  .rt-TabsList.rt-r-size-2 {
    height: auto;
    --tabs-trigger-inner-padding-y: ${token('spacing.space.04')};
  }
  .rt-TabsTrigger {
    flex: 1;
  }
  .rt-TabsTriggerInner {
    width: 100%;
  }
  // override the radix tabs color
  .rt-TabsTrigger[data-state='active']::before {
    background-color: ${token('colors.brown.12')};
  }
`;
