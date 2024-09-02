import { TooltipProvider } from '@radix-ui/react-tooltip';
import type { Meta } from '@storybook/react';
import { Box, styled } from 'leather-styles/jsx';

import { Button, Logo } from '@leather.io/ui';

import { Card as Component } from './card';
import { AvailableBalance, ButtonRow } from './index';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/Card',
  decorators: [
    Story => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;

export function Card() {
  return (
    <Component>
      <Box height="40vh">Card content</Box>
    </Component>
  );
}

export function CardWithButtonFooter() {
  return (
    <Component
      footer={
        <Button fullWidth onClick={() => null}>
          Button
        </Button>
      }
    >
      <Box height="40vh">Card content</Box>
    </Component>
  );
}
export function CardWithButtonRowFooter() {
  return (
    <Component
      footer={
        <ButtonRow flexDirection="row">
          <Button flexGrow={1} onClick={() => null} variant="outline">
            Cancel
          </Button>
          <Button flexGrow={1} onClick={() => null}>
            Confirm
          </Button>
        </ButtonRow>
      }
    >
      <Box height="40vh">Card content</Box>
    </Component>
  );
}

export function CardWithBalanceFooter() {
  return (
    <Component
      footer={
        <ButtonRow>
          <Button fullWidth onClick={() => null}>
            Continue
          </Button>
          <AvailableBalance balance="$10" />
        </ButtonRow>
      }
    >
      <Box height="40vh">Card content</Box>
    </Component>
  );
}

export function CardWithPrivateBalanceFooter() {
  return (
    <Component
      footer={
        <ButtonRow>
          <Button fullWidth onClick={() => null}>
            Continue
          </Button>
          <AvailableBalance balance="$10" isPrivate />
        </ButtonRow>
      }
    >
      <Box height="40vh">Card content</Box>
    </Component>
  );
}

export function CardWithBigHeader() {
  return (
    <Component
      header={
        <styled.h1 textStyle="heading.03" p="space.05">
          choose asset <br /> to fund
        </styled.h1>
      }
    >
      <Box height="40vh">Card content</Box>
    </Component>
  );
}

export function CardWithLogo() {
  return (
    <Component
      header={
        <styled.h1 p="space.04" hideBelow="sm">
          <Box px="space.02">
            <Logo />
          </Box>
        </styled.h1>
      }
    >
      <Box height="40vh">Card content</Box>
    </Component>
  );
}
