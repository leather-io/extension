import type { Meta } from '@storybook/react';
import { Flex, styled } from 'leather-styles/jsx';

import { Button, Link } from '@leather-wallet/ui';

import { Footer as Component } from './footer';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Containers/Footer',
  parameters: {
    controls: {
      disable: true,
      // TODO try get rid of these empty controls
      // https://github.com/storybookjs/storybook/issues/24422
      hideNoControlsWarning: true,
    },
  },
};

export default meta;

export function Footer() {
  return (
    <Component>
      <Button fullWidth onClick={() => null}>
        Create new account
      </Button>
    </Component>
  );
}

export function SignOutConfirmFooter() {
  return (
    <Component>
      <Flex flexDirection="row" gap="space.04">
        <Button color="gray" flexGrow={1} variant="outline" onClick={() => null}>
          Cancel
        </Button>
        <Button
          _hover={{ opacity: 0.8 }}
          background="red.action-primary-default"
          color="lightModeBrown.1"
          flexGrow={1}
          onClick={() => null}
          type="submit"
        >
          Sign out
        </Button>
      </Flex>
    </Component>
  );
}

export function ReceiveTokensFooter() {
  return (
    <Component>
      <Button fullWidth mt="space.05" onClick={() => null}>
        Copy address
      </Button>
    </Component>
  );
}

export function RequestPasswordFooter() {
  return (
    <Component>
      <Button onClick={() => null}>Continue</Button>
    </Component>
  );
}

export function FooterWithText() {
  return (
    <Component>
      <Button fullWidth onClick={() => null}>
        Continue
      </Button>

      <Flex width="100%" justifyContent="center">
        <styled.span textStyle="caption.01" display="block" textAlign="left">
          Leather Wallet will now be provided by Leather Wallet LLC [a subsidiary of Nassau Machines
          Inc]. Please review and accept Leather Wallet{' '}
          <Link href="https://leather.io/terms" textDecoration="underline" target="_blank">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="https://leather.io/privacy-policy" target="_blank" textDecoration="underline">
            Privacy Policy
          </Link>
          .
        </styled.span>
      </Flex>
    </Component>
  );
}

export function FooterWithLink() {
  return (
    <Component>
      <Button fullWidth onClick={() => null}>
        Button
      </Button>

      <Flex width="100%" justifyContent="center">
        <Link
          href=""
          target="_blank"
          cursor="pointer"
          textDecoration="underline"
          textStyle="label.01"
        >
          View all addresses
        </Link>
      </Flex>
    </Component>
  );
}

export function FooterWithBalancesAbove() {
  return (
    <Component>
      <Flex justifyContent="space-between" alignItems="center" alignSelf="stretch">
        <styled.span textStyle="label.02">0.00048208 BTC</styled.span>
        <styled.span textStyle="label.02">$ 1,100.00</styled.span>
      </Flex>
      <Button onClick={() => null} type="submit">
        Button
      </Button>
    </Component>
  );
}
