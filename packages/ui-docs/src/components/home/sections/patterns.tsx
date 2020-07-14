import React from 'react';
import { Grid, space } from '@blockstack/ui';
import { AccessibleIcon } from '@components/icons/accessible';
import { AtomIcon } from '@components/icons/atom';
import { PaletteIcon } from '@components/icons/palette';
import { PaintIcon } from '@components/icons/paint';
import { LayersIntersectIcon } from '@components/icons/layers-intersect';
import { H2 } from '@components/home/text';
import { GridItem } from '@components/home/grid';
import { Section, SectionWrapper } from '@components/home/common';

export const PatternsSection = () => (
  <Section>
    <SectionWrapper>
      <H2 mb={space('extra-loose')}>Patterns & Principles</H2>
      <Grid
        width="100%"
        mt="64px"
        mb={space('base-loose')}
        gridGap={space('extra-loose')}
        gridRowGap={'64px'}
        gridTemplateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
        gridTemplateRows={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)']}
      >
        <GridItem
          icon={AccessibleIcon}
          title="Accessible"
          body="Blockstack UI follows WAI-ARIA standards. All components come with proper attributes and keyboard interactions out of the box."
        />
        <GridItem
          icon={AtomIcon}
          title="Base primitives"
          body="All components are built with a set of primitives that can take any css property as a prop for on-the-fly adjustments."
        />
        <GridItem
          icon={PaletteIcon}
          title="Design graph"
          body="Components built out of constraints, using token based design: scales of sizes, colors, and other variables."
        />
        <GridItem
          icon={PaintIcon}
          title="Theming"
          body="Blockstack UI is built with the Theme UI Spec in mind, allowing for theming such as light and dark modes."
        />
        <GridItem
          icon={LayersIntersectIcon}
          title="Composability"
          body="All components are built with composition in mind. Combine any components to build complex UI."
        />
      </Grid>
    </SectionWrapper>
  </Section>
);
