import { CSSProperties } from 'react';

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
    color: 'unset',
    background: 'transparent',
  },
  styles: [
    {
      types: ['prolog'],
      style: {
        color: 'rgb(0, 0, 128)',
      },
    },
    {
      types: ['comment', 'punctuation'],
      style: {
        color: 'rgb(106, 153, 85)',
      },
    },
    {
      types: ['builtin', 'tag', 'changed', 'function', 'keyword'],
      style: {
        color: 'rgb(86, 156, 214)',
      },
    },
    {
      types: ['number', 'variable', 'inserted'],
      style: {
        color: '#A58FFF',
      },
    },
    {
      types: ['operator'],
      style: {
        color: 'rgb(212, 212, 212)',
      },
    },
    {
      types: ['constant'],
      style: {
        color: 'rgb(100, 102, 149)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: 'rgb(156, 220, 254)',
      },
    },
    {
      types: ['car'],
      style: {
        color: 'rgb(156, 220, 254)',
      },
    },
    {
      types: ['deleted', 'string'],
      style: {
        color: '#FF7B48',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: 'rgb(78, 201, 176)',
      },
    },
    {
      types: ['char'],
      style: {
        color: '#FF7B48',
      },
    },
  ],
};
