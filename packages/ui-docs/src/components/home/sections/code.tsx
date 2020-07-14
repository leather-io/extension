import React from 'react';
import { Box, Flex, space } from '@blockstack/ui';
import { ExampleComponent } from '@components/example';

import { CodeExamples } from '@components/home/code-examples';
import { BodyLarge, H2 } from '@components/home/text';
import { Section, SectionWrapper } from '@components/home/common';

export const CodeSection = () => {
  return (
    <Section mt="64px" pb={0}>
      <Box
        minHeight={['790px', '650px', '400px', '400px']}
        bg="black"
        width="100%"
        position="absolute"
        top={0}
        left={0}
      />
      <SectionWrapper>
        <Flex
          flexDirection={['column', 'row', 'column', 'column']}
          align={['unset', 'center', 'unset', 'unset']}
        >
          <Box mb={space(['base-loose', 'none', 'none', 'none'])}>
            <H2 color="white" mb={space('extra-loose')}>
              Iterate quickly
            </H2>
            <BodyLarge minWidth="16ch" color="white" mb={space('extra-loose')}>
              Build complex UI easily with primitives and highly composable components.
            </BodyLarge>
          </Box>
          <Box
            display={['block', 'block', 'none', 'none']}
            mb={space('extra-loose')}
            pl={space(['none', 'base-loose', 'base-loose', 'base-loose'])}
            flexShrink={0}
            position="relative"
          >
            <ExampleComponent opacity={0} />
            <ExampleComponent top={0} position="absolute" />
          </Box>
        </Flex>
        <CodeExamples />
      </SectionWrapper>
    </Section>
  );
};

export default CodeSection;
