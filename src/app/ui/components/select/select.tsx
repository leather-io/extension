import { ReactNode, forwardRef } from 'react';

import * as RadixSelect from '@radix-ui/react-select';
import { css } from 'leather-styles/css';

export interface SelectItem {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  label: string;
}

const Root = RadixSelect.Root;

const selectTriggerStyles = css({
  alignItems: 'center',
  bg: 'accent.background-primary',
  borderRadius: 'xs',
  display: 'flex',
  fontWeight: 500,
  gap: 'space.02',
  maxWidth: 'fit-content',
  maxHeight: 'fit-content',
  px: 'space.04',
  py: 'space.03',
  textStyle: 'label.02',

  '&[data-state=open]': {
    bg: 'accent.component-background-pressed',
  },
});
const Trigger: typeof RadixSelect.Trigger = forwardRef((props, ref) => (
  <RadixSelect.Trigger className={selectTriggerStyles} ref={ref} {...props} />
));

const Value = RadixSelect.Value;
const Icon = RadixSelect.Icon;
const Portal = RadixSelect.Portal;

const selectContentStyles = css({
  alignItems: 'center',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--base-menu-padding': '0px',
  bg: 'accent.background-primary',
  borderRadius: 'xs',
  boxShadow:
    '0px 12px 24px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 0px 2px 0px rgba(18, 16, 15, 0.08)',
  minWidth: '256px',
  p: 'space.02',
  willChange: 'transform, opacity',
  zIndex: 999,

  '&[data-side=bottom]': {
    animationName: 'slideUpAndFade',
  },
});
const Content: typeof RadixSelect.Content = forwardRef((props, ref) => (
  <RadixSelect.Content className={selectContentStyles} ref={ref} {...props} />
));

const selectViewportStyles = css({
  width: '100%',
});
const Viewport: typeof RadixSelect.Viewport = forwardRef((props, ref) => (
  <RadixSelect.Viewport className={selectViewportStyles} ref={ref} {...props} />
));

const Group = RadixSelect.Group;

const selectLabelStyles = css({
  color: 'accent.text-subdued',
  height: 'auto',
  px: 'space.03',
  py: 'space.02',
  textStyle: 'body.02',
  width: '100%',
});
const Label: typeof RadixSelect.Label = forwardRef((props, ref) => (
  <RadixSelect.Label className={selectLabelStyles} ref={ref} {...props} />
));

const selectItemStyles = css({
  bg: 'accent.background-primary',
  color: 'accent.text-primary',
  height: 'auto',
  outline: 'none',
  userSelect: 'none',
  p: 'space.03',

  '&[data-highlighted]': {
    bg: 'accent.component-background-hover',
  },
});
const Item: typeof RadixSelect.Item = forwardRef((props, ref) => (
  <RadixSelect.Item className={selectItemStyles} ref={ref} {...props} />
));

const ItemText = RadixSelect.ItemText;
const ItemIndicator = RadixSelect.ItemIndicator;

const selectSeparatorStyles = css({
  bg: 'accent.background-primary',
  color: 'accent.border-default',
  mx: '0px',
  my: 'space.03',
});
const Separator: typeof RadixSelect.Separator = forwardRef((props, ref) => (
  <RadixSelect.Separator className={selectSeparatorStyles} ref={ref} {...props} />
));

export const Select = {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  Viewport,
  Group,
  Label,
  Item,
  ItemText,
  ItemIndicator,
  Separator,
};
