import { ReactNode, forwardRef } from 'react';

import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { css } from 'leather-styles/css';
import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

import { ChevronDownIcon } from '@app/ui/icons';

import { Flag } from '../flag/flag';
import { itemBaseStyles, itemInteractiveStyles } from '../item/item-interactive';

export interface DropdownMenuItem {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  label: string;
}
const dropdownButtonStyles = css({
  bg: 'ink.background-primary',
  borderRadius: 'xs',
  fontWeight: 500,
  maxWidth: 'fit-content',
  maxHeight: 'fit-content',
  px: 'space.04',
  py: 'space.03',
  textStyle: 'label.02',
  userSelect: 'none',
  '[data-state=open] &': { bg: 'ink.component-background-pressed' },
});
function Button({ children, ...props }: HTMLStyledProps<'div'>) {
  return (
    <styled.div className={dropdownButtonStyles} {...props}>
      <Flag spacing="space.02" reverse img={<ChevronDownIcon variant="small" />}>
        {children}
      </Flag>
    </styled.div>
  );
}

const dropdownTriggerStyles = css({
  _focus: { outline: 'none' },
});
const Trigger: typeof RadixDropdownMenu.Trigger = forwardRef((props, ref) => (
  <RadixDropdownMenu.Trigger className={dropdownTriggerStyles} ref={ref} {...props} />
));

const dropdownContentStyles = css({
  alignItems: 'center',
  '--base-menu-padding': '0px',
  bg: 'ink.background-primary',
  borderRadius: 'xs',
  boxShadow:
    '0px 12px 24px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 0px 2px 0px rgba(18, 16, 15, 0.08)',
  p: 'space.02',
  willChange: 'transform, opacity',
  zIndex: 999,
  _closed: { animation: 'slideDownAndOut 140ms ease-in-out' },
  _open: { animation: 'slideUpAndFade 140ms ease-in-out' },
});
const Content: typeof RadixDropdownMenu.Content = forwardRef((props, ref) => (
  <RadixDropdownMenu.Content className={dropdownContentStyles} ref={ref} {...props} />
));

const dropdownMenuLabelStyles = css({
  color: 'ink.text-subdued',
  height: 'auto',
  px: 'space.03',
  py: 'space.02',
  textStyle: 'body.02',
  width: '100%',
});
const Label: typeof RadixDropdownMenu.Label = forwardRef((props, ref) => (
  <RadixDropdownMenu.Label className={dropdownMenuLabelStyles} ref={ref} {...props} />
));

const Item: typeof RadixDropdownMenu.Item = forwardRef((props, ref) => (
  <RadixDropdownMenu.Item
    className={css(itemBaseStyles, itemInteractiveStyles)}
    ref={ref}
    {...props}
  />
));

const dropdownMenuSeparatorStyles = css({
  bg: 'ink.background-primary',
  color: 'ink.border-default',
  mx: '0px',
  my: 'space.03',
});
const Separator: typeof RadixDropdownMenu.Separator = forwardRef((props, ref) => (
  <RadixDropdownMenu.Separator className={dropdownMenuSeparatorStyles} ref={ref} {...props} />
));

export const DropdownMenu = {
  Root: RadixDropdownMenu.Root,
  Group: RadixDropdownMenu.Group,
  Portal: RadixDropdownMenu.Portal,
  Trigger,
  Button,
  Content,
  Label,
  Item,
  Separator,
};
