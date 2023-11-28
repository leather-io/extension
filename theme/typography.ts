import { defineTextStyles } from '@pandacss/dev';

const marchePro = 'Marche';

const commonMarcheProStyles = {
  fontFamily: marchePro,
  textTransform: 'uppercase',
};

const diatype = 'Diatype';

const commonDiatypeStyles = {
  fontFamily: diatype,
};

const firaCode = 'Fira Code';

// ts-unused-exports:disable-next-line
export const textStyles = defineTextStyles({
  'display.01': {
    description: 'display.01',
    value: { ...commonMarcheProStyles, fontSize: '9.375rem', lineHeight: '7.5rem' },
  },
  'display.02': {
    description: 'display.02',
    value: { ...commonMarcheProStyles, fontSize: '4rem', lineHeight: '3.5rem' },
  },

  'heading.01': {
    description: 'heading.01',
    value: { ...commonDiatypeStyles, fontSize: '3.3125rem', lineHeight: '3.75rem' },
  },
  'heading.02': {
    description: 'heading.02',
    value: { ...commonMarcheProStyles, fontSize: '2.75rem', lineHeight: '2.75rem' },
  },
  'heading.03': {
    description: 'heading.03',
    value: { ...commonMarcheProStyles, fontSize: '2rem', lineHeight: '2.1875rem' },
  },
  'heading.04': {
    description: 'heading.04',
    value: {
      ...commonDiatypeStyles,
      fontSize: '1.625rem',
      lineHeight: '2.25rem',
      fontWeight: '500',
    },
  },
  'heading.05': {
    description: 'heading.05',
    value: {
      ...commonDiatypeStyles,
      fontSize: '1.3125rem',
      lineHeight: '1.75rem',
      fontWeight: '500',
    },
  },

  'label.01': {
    description: 'label.01',
    value: {
      ...commonDiatypeStyles,
      fontSize: '1.0625rem',
      lineHeight: '1.5rem',
      fontWeight: '500',
    },
  },
  'label.02': {
    description: 'label.02',
    value: { ...commonDiatypeStyles, fontSize: '0.9375rem', lineHeight: '1.25rem' },
  },
  'label.03': {
    description: 'label.03',
    value: { ...commonDiatypeStyles, fontSize: '0.8125rem', lineHeight: '1rem' },
  },

  'body.01': {
    description: 'body.01',
    value: { ...commonDiatypeStyles, fontSize: '1.0625rem', lineHeight: '1.5rem' },
  },
  'body.02': {
    description: 'body.02',
    value: { ...commonDiatypeStyles, fontSize: '0.9375rem', lineHeight: '1.25rem' },
  },

  'caption.01': {
    description: 'caption.01',
    value: { ...commonDiatypeStyles, fontSize: '0.9375rem', lineHeight: '1.25rem' },
  },
  'caption.02': {
    description: 'caption.02',
    value: { ...commonDiatypeStyles, fontSize: '0.8125rem', lineHeight: '1rem' },
  },

  'mono.01': {
    description: 'mono.01',
    value: {
      fontFamily: firaCode,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      letterSpacing: '.08rem',
    },
  },
  'mono.02': {
    description: 'mono.02',
    value: { fontFamily: firaCode, fontSize: '0.6rem', lineHeight: '1rem' },
  },
});
