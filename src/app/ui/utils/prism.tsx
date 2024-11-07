import { CSSProperties } from 'react';

import { token } from 'leather-styles/tokens';
import { PrismTheme } from 'prism-react-renderer';

export interface GrammaticalToken {
  types: string[];
  content: string;
  empty?: boolean;
}

interface GrammaticalTokenOutputProps {
  key?: React.Key;
  style?: CSSProperties;
  className: string;
  children: string;
  [otherProp: string]: any;
}

interface GrammaticalTokenInputProps {
  key?: React.Key;
  style?: CSSProperties;
  className?: string;
  token: GrammaticalToken;
  [otherProp: string]: any;
}

interface LineInputProps {
  key?: React.Key;
  style?: CSSProperties;
  className?: string;
  line: GrammaticalToken[];
  [otherProp: string]: any;
}

interface LineOutputProps {
  key?: React.Key;
  style?: CSSProperties;
  className: string;
  [otherProps: string]: any;
}

export interface RenderProps {
  tokens: GrammaticalToken[][];
  className: string;
  style: CSSProperties;
  getLineProps(input: LineInputProps): LineOutputProps;
  getTokenProps(input: GrammaticalTokenInputProps): GrammaticalTokenOutputProps;
}

export type GetGrammaticalTokenProps = (
  input: GrammaticalTokenInputProps
) => GrammaticalTokenOutputProps;

export type Language =
  | 'markup'
  | 'bash'
  | 'clarity'
  | 'clike'
  | 'c'
  | 'cpp'
  | 'css'
  | 'javascript'
  | 'jsx'
  | 'coffeescript'
  | 'actionscript'
  | 'css-extr'
  | 'diff'
  | 'git'
  | 'go'
  | 'graphql'
  | 'handlebars'
  | 'json'
  | 'less'
  | 'lisp'
  | 'makefile'
  | 'markdown'
  | 'objectivec'
  | 'ocaml'
  | 'python'
  | 'reason'
  | 'sass'
  | 'scss'
  | 'sql'
  | 'stylus'
  | 'tsx'
  | 'typescript'
  | 'wasm'
  | 'yaml';

export const theme: PrismTheme = {
  plain: {
    color: token('colors.ink.text-primary'),
  },
  styles: [
    {
      types: ['comment', 'punctuation'],
      style: {
        color: token('colors.ink.text-subdued'),
      },
    },
    {
      types: ['operator'],
      style: {
        color: token('colors.ink.text-primary'),
      },
    },
    {
      types: ['builtin', 'tag', 'changed', 'keyword'],
      style: {
        color: token('colors.yellow.action-primary-default'),
      },
    },
    {
      types: ['function'],
      style: {
        color: token('colors.red.action-primary-default'),
      },
    },
    {
      types: ['number', 'variable', 'inserted'],
      style: {
        color: token('colors.yellow.action-primary-default'),
      },
    },
    {
      types: ['deleted', 'string', 'symbol', 'char'],
      style: {
        color: token('colors.green.action-primary-default'),
      },
    },
  ],
};
