/** @jsx jsx */
import { jsx, css, Global } from '@emotion/react';
import { generateCssVariables } from './utils';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const colorModes = css`
  :root {
    ${generateCssVariables('light')};
  }

  @media (prefers-color-scheme: dark) {
    :root {
      ${generateCssVariables('dark')};
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      ${generateCssVariables('light')};
    }
  }

  html,
  body,
  #__next {
    background: var(--colors-bg);
    border-color: var(--colors-border);
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--colors-text-body);
    font-size: 16px !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: var(--colors-input-placeholder) !important;
  }

  input::-ms-input-placeholder,
  textarea::-ms-input-placeholder {
    color: var(--colors-input-placeholder) !important;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--colors-input-placeholder) !important;
  }
`;

export const ColorModes: any = <Global styles={colorModes} />;
