import React from 'react';
import { Box, Grid, Stack, space, Button, color } from '@blockstack/ui';
import { CircleIcon } from '@components/home/common';
import Link from 'next/link';

import { CONTENT_MAX_WIDTH } from '@common/constants';

import { AtomAltIcon } from '@components/icons/atom-alt';
import { BoxIcon } from '@components/icons/box';
import { EditIcon } from '@components/icons/edit';
import { Card } from '@components/home/card';
import { Body, H1, BodyLarge, SubHeading } from '@components/home/text';

export const Hero = () => {
  return (
    <>
      <Grid pb="64px" pt="128px" style={{ placeItems: 'center' }} mt="50px">
        <Box maxWidth="54ch" textAlign="center">
          <H1 mb={space('base')}>Blockstack UI</H1>
          <BodyLarge maxWidth="40ch" mt={space('extra-loose')} mx="auto">
            The design system and component library used at Blockstack, built with React and
            styled-system.
          </BodyLarge>
          <Stack
            isInline
            spacing={space('base')}
            my={space('extra-loose')}
            justify="center"
            align="center"
          >
            <Box>
              <Link href="/getting-started" passHref>
                <Button as="a" size="lg">
                  Get started
                </Button>
              </Link>
            </Box>
            <Button
              as="a"
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              href="https://github.com/blockstack/ux/tree/master/packages/ui#blockstack-ui"
              size="lg"
              mode="secondary"
            >
              GitHub
            </Button>
          </Stack>
        </Box>
      </Grid>
      <Grid
        maxWidth={`${CONTENT_MAX_WIDTH}px`}
        width="100%"
        gridGap={space('extra-loose')}
        minHeight="200px"
        gridTemplateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(3, 1fr)']}
        mx="auto"
        px={space('extra-loose')}
      >
        <Card href="/design-graph/what-is-it" textAlign="center">
          {({ hover, active }) => (
            <Box as="span">
              <CircleIcon
                as="span"
                hover={hover}
                icon={AtomAltIcon}
                mx="auto"
                mb={space('base-loose')}
              />
              <SubHeading
                as="span"
                display="block"
                color={hover || active ? color('accent') : color('text-title')}
                mb={space('base-loose')}
              >
                Design tokens
              </SubHeading>
              <Body as="p">Learn what design tokens are, and how our system uses them.</Body>
            </Box>
          )}
        </Card>
        <Card href="/components/box" textAlign="center">
          {({ hover, active }) => (
            <Box>
              <CircleIcon hover={hover} icon={BoxIcon} mx="auto" mb={space('base-loose')} />
              <SubHeading
                color={hover || active ? color('accent') : color('text-title')}
                mb={space('base-loose')}
              >
                Components
              </SubHeading>
              <Body>
                Explore our components and learn how to implement them in your React projects.
              </Body>
            </Box>
          )}
        </Card>
        <Card href="/contributing" textAlign="center">
          {({ hover, active }) => (
            <Box>
              <CircleIcon hover={hover} icon={EditIcon} mx="auto" mb={space('base-loose')} />
              <SubHeading
                color={hover || active ? color('accent') : color('text-title')}
                mb={space('base-loose')}
              >
                Contributing
              </SubHeading>
              <Body>Blockstack UI is open source and contributions are very welcome.</Body>
            </Box>
          )}
        </Card>
      </Grid>
    </>
  );
};
