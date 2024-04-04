import type { Meta } from '@storybook/react';
import { Box, Stack, styled } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Logo } from '@app/ui/components/logo';

import { Card as Component } from './card';
import { CardContent } from './card-content';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/Card',
};

export default meta;

export function Card() {
  return (
    <Box width="pageWidth">
      <Component
        header={
          <styled.h1 p="space.04" hideBelow="sm">
            <Box px="space.02">
              <Logo />
            </Box>
          </styled.h1>
        }
        footer={
          <Footer variant="card">
            <Button variant="solid">Continue</Button>
          </Footer>
        }
      >
        {/* <CardContent p="space.00"> */}
        <Stack gap="space.05" px="space.05" minHeight="330px" bg="red.background-secondary">
          <styled.h3 textStyle="heading.03">Do something</styled.h3>
          <styled.p>some content</styled.p>
        </Stack>
        {/* </CardContent> */}
      </Component>
    </Box>
  );
}
