import React from 'react';
import { Box, BoxProps, Grid, space, themeColor } from '@blockstack/ui';

import { Section, SectionWrapper } from '@components/home/common';
import { Text } from '@components/typography';

const SectionHeading: React.FC<BoxProps> = props => (
  <Text mb={space('base')} display="block" color="white" fontWeight="bolder" {...props} />
);

const SectionItem: React.FC<BoxProps> = props => (
  <Text mb={space('tight')} display="block" color={themeColor('ink.300')} {...props} />
);

export const Footer: React.FC<BoxProps> = props => (
  <Box pt={space('extra-loose')} bg="ink">
    <Section borderTop={`1px solid`} borderColor={'rgb(39, 41, 46)'}>
      <SectionWrapper pt={0}>
        <Grid
          width="100%"
          gridGap={space('extra-loose')}
          gridTemplateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
        >
          <Box>
            <SectionHeading>Primitives</SectionHeading>
            <SectionItem>Box</SectionItem>
            <SectionItem>Flex</SectionItem>
            <SectionItem>Grid</SectionItem>
            <SectionItem>Text</SectionItem>
          </Box>
          <Box>
            <SectionHeading>Global & layout</SectionHeading>
            <SectionItem>ThemeProvider</SectionItem>
            <SectionItem>CSS Reset</SectionItem>
            <SectionItem>Color Modes</SectionItem>
            <SectionItem>Stack</SectionItem>
          </Box>
          <Box>
            <SectionHeading>Utilities & hooks</SectionHeading>
            <SectionItem>space()</SectionItem>
            <SectionItem>color()</SectionItem>
            <SectionItem>border()</SectionItem>
            <SectionItem>useClipboard</SectionItem>
          </Box>
          <Box>
            <SectionHeading>Stay up to date</SectionHeading>
            <SectionItem>GitHub</SectionItem>
            <SectionItem>Twitter</SectionItem>
            <SectionItem>Discord</SectionItem>
            <SectionItem>Branding assets</SectionItem>
          </Box>
        </Grid>
      </SectionWrapper>
    </Section>
  </Box>
);
