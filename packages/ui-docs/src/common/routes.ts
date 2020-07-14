export const topNavLinks = [
  'Getting started',
  'Patterns and Principles',
  'Contributing',
  'Further reading',
];

export const designGraph = [
  'What is it?',
  'System props',
  'Responsive styles',
  'Colors',
  'Space',
  'Typography',
  'Theme',
];

export const components = [
  'Box',
  'Button',
  'CodeBlock',
  'Color modes',
  'CSS Reset',
  'Flex',
  'Grid',
  'Highlighter',
  'Icons',
  'Input',
  'Modal',
  'Popper',
  'Portal',
  'Spinner',
  'Stack',
  'Text',
  'Theme Provider',
  'Toast',
  'Tooltip',
  'Transition',
];

export const hooks = [
  'Utilities',
  'useClipboard',
  'useEventListener',
  'useForceUpdate',
  'useId',
  'useTheme',
];

export const routes = [...topNavLinks, ...designGraph, ...components, ...hooks];

export const paginationRoutes = {
  top: topNavLinks,
  ['design-graph']: designGraph,
  components,
  misc: hooks,
};

export const links = {
  github: 'https://github.com/blockstack/ux',
};
