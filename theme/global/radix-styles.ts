export const radixStyles = {
  '.radix-themes': {
    '--font-size-7': '32px',
    '--font-size-8': '44px',
    '--font-size-9': '53px',

    '--default-font-family': '"Diatype", "Helvetica Neue", sans-serif',
    '--heading-font-family': '"Marche", "Helvetica Neue", sans-serif',

    '--letter-spacing-1': 0,
    '--letter-spacing-2': 0,
    '--letter-spacing-3': 0,
    '--letter-spacing-4': 0,
    '--letter-spacing-5': 0,
    '--letter-spacing-6': 0,
    '--letter-spacing-7': 0,
    '--letter-spacing-8': 0,
    '--letter-spacing-9': 0,

    // Configured to Diatype
    '--font-weight-light': 400,
    '--font-weight-regular': 400,
    '--font-weight-medium': 500,
    '--font-weight-bold': 500,

    '--color-overlay': 'rgba(0, 0, 0, 0.3)', //check this
  },

  // TODO check if these are being set properly
  ':root, .light, .light-theme': {
    '--brown-1': 'brown.1',
    '--brown-2': 'brown.2',
    '--brown-3': 'brown.3',
    '--brown-4': 'brown.4',
    '--brown-5': 'brown.5',
    '--brown-6': 'brown.6',
    '--brown-7': 'brown.7',
    '--brown-8': 'brown.8',
    '--brown-9': 'brown.9',
    '--brown-10': 'brown.10',
    '--brown-11': 'brown.11',
    '--brown-12': 'brown.12',

    '--gray-1': 'ink.1',
    '--gray-2': 'ink.2',
    '--gray-3': 'ink.3',
    '--gray-4': 'ink.4',
    '--gray-5': 'ink.5',
    '--gray-6': 'ink.6',
    '--gray-7': 'ink.7',
    '--gray-8': 'ink.8',
    '--gray-9': 'ink.9',
    '--gray-10': 'ink.10',
    '--gray-11': 'ink.11',
    '--gray-12': 'ink.12',
  },
  '.dark, .dark-theme': {
    '--brown-1': 'brown.1',
    '--brown-2': 'brown.2',
    '--brown-3': 'brown.3',
    '--brown-4': 'brown.4',
    '--brown-5': 'brown.5',
    '--brown-6': 'brown.6',
    '--brown-7': 'brown.7',
    '--brown-8': 'brown.8',
    '--brown-9': 'brown.9',
    '--brown-10': 'brown.10',
    '--brown-11': 'brown.11',
    '--brown-12': 'brown.12',

    '--gray-1': 'ink.1',
    '--gray-2': 'ink.2',
    '--gray-3': 'ink.3',
    '--gray-4': 'ink.4',
    '--gray-5': 'ink.5',
    '--gray-6': 'ink.6',
    '--gray-7': 'ink.7',
    '--gray-8': 'ink.8',
    '--gray-9': 'ink.9',
    '--gray-10': 'ink.10',
    '--gray-11': 'ink.11',
    '--gray-12': 'ink.12',
  },
};

// override the radix tabs color
export const radixTabStyles = {
  '.rt-TabsList.rt-r-size-2': {
    height: 'auto',
    '--tabs-trigger-inner-padding-y': 'spacing.space.04',
  },
  '.rt-TabsTrigger': {
    flex: 1,
  },
  '.rt-TabsTriggerInner': {
    width: '100%',
  },
  '.rt-TabsTrigger[data-state="active"]::before': {
    backgroundColor: 'accent.text-primary',
  },
};
