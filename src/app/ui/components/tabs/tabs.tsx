import { forwardRef } from 'react';

import * as RadixTabs from '@radix-ui/react-tabs';
import { css } from 'leather-styles/css';

const tabRootStyles = css({
  display: 'flex',
  flexDirection: 'column',
});
const Root: typeof RadixTabs.Root = forwardRef((props, ref) => (
  <RadixTabs.Root className={tabRootStyles} ref={ref} {...props} />
));

const tabsTriggerStyles = css({
  position: 'relative',
  textStyle: 'label.01',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  py: 'space.04',
  userSelect: 'none',
  color: 'ink.text-subdued',
  _hover: { background: 'ink.component-background-hover' },
  '&[data-state="active"]': {
    color: 'ink.text-primary',
    _before: {
      content: '""',
      position: 'absolute',
      bottom: 0,
      height: '2px',
      width: '100%',
      bg: 'ink.text-subdued',
      zIndex: 10,
    },
  },
  _focusVisible: { outline: 0, _before: { bg: 'lightModeBlue.500' } },
});
const Trigger: typeof RadixTabs.Trigger = forwardRef((props, ref) => (
  <RadixTabs.Trigger className={tabsTriggerStyles} ref={ref} {...props} />
));

const tabsListStyles = css({
  flexShrink: 0,
  display: 'flex',
  position: 'relative',
  _before: {
    content: '""',
    position: 'absolute',
    bottom: 0,
    height: '2px',
    width: '100%',
    bg: 'ink.border-default',
    zIndex: 9,
  },
});
const List: typeof RadixTabs.List = forwardRef((props, ref) => (
  <RadixTabs.List className={tabsListStyles} ref={ref} {...props} />
));

export const Tabs = { Root, List, Trigger, Content: RadixTabs.Content };
