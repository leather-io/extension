import React from 'react';
import { Box, Grid, space, color, themeColor } from '@blockstack/ui';
import { CONTENT_MAX_WIDTH } from '@common/constants';
import { BoxIcon } from '@components/icons/box';
import { StackIcon } from '@components/icons/stack';
import { PackageIcon } from '@components/icons/package';
import { Card } from '@components/home/card';
import { Body, SubHeading, H2 } from '@components/home/text';
import { CircleIcon, Section, SectionWrapper } from '@components/home/common';

export const CTASection = () => (
  <Section bg={color('invert')} minHeight="320px">
    <SectionWrapper>
      <H2 mb={space('extra-loose')} mx="auto" textAlign="center" color="white">
        Get started with Blockstack UI
      </H2>
      <Grid
        maxWidth={`${CONTENT_MAX_WIDTH}px`}
        width="100%"
        gridGap={space('extra-loose')}
        minHeight="200px"
        gridTemplateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(3, 1fr)']}
        mx="auto"
        pt={space('extra-loose')}
      >
        <Card dark href="/getting-started" textAlign="center">
          {({ hover, active }) => (
            <Box>
              <CircleIcon
                icon={PackageIcon}
                dark
                hover={hover}
                mx="auto"
                mb={space('base-loose')}
              />
              <SubHeading
                color={hover || active ? themeColor('blue.400') : 'white'}
                mb={space('base-loose')}
              >
                Installation & usage
              </SubHeading>
              <Body color={themeColor('ink.300')}>
                Our getting started guide, add Blockstack UI to your app.
              </Body>
            </Box>
          )}
        </Card>
        <Card dark href="/design-graph/system-props" textAlign="center">
          {({ hover, active }) => (
            <Box>
              <CircleIcon hover={hover} icon={StackIcon} dark mx="auto" mb={space('base-loose')} />
              <SubHeading
                color={hover || active ? themeColor('blue.400') : 'white'}
                mb={space('base-loose')}
              >
                System props
              </SubHeading>
              <Body color={themeColor('ink.300')}>
                See how to use props to style your components.
              </Body>
            </Box>
          )}
        </Card>
        <Card dark href="/components/box" textAlign="center">
          {({ hover, active }) => (
            <Box>
              <CircleIcon hover={hover} icon={BoxIcon} dark mx="auto" mb={space('base-loose')} />
              <SubHeading
                color={hover || active ? themeColor('blue.400') : 'white'}
                mb={space('base-loose')}
              >
                Box component
              </SubHeading>
              <Body color={themeColor('ink.300')}>
                Learn about the base component everything is built with.
              </Body>
            </Box>
          )}
        </Card>
      </Grid>
    </SectionWrapper>
  </Section>
);
