import React from 'react';
import { Box, Flex, space, color, themeColor } from '@blockstack/ui';

import { border } from '@common/utils';

import { SimpleCodeBlock } from '@components/code-block/components';
import { ExampleComponent, exampleCode, gaiaHubUsage, appItem } from '@components/example';
import { InlineCode } from '@components/mdx';

export const CodeExamples = () => {
  const [tab, setTab] = React.useState<'example' | 'gaiaHubUsage' | 'appItem'>('example');
  const getExampleCode = () => {
    switch (tab) {
      case 'example':
        return exampleCode;
      case 'gaiaHubUsage':
        return gaiaHubUsage;
      case 'appItem':
        return appItem;
    }
  };
  const handleSetTab = (value: 'example' | 'gaiaHubUsage' | 'appItem') => {
    console.log(value);
    setTab(value);
  };
  const tabs: { label: string; slug: 'example' | 'gaiaHubUsage' | 'appItem' }[] = [
    { label: `<ExampleComponent />`, slug: 'example' },
    { label: `<GaiaHubUsage />`, slug: 'gaiaHubUsage' },
    { label: `<AppItem />`, slug: 'appItem' },
  ];
  return (
    <Flex flexDirection={['column', 'column', 'row', 'row']} justifyContent="space-between">
      <Box
        bg="white"
        border={border()}
        p={space('base')}
        borderRadius="lg"
        boxShadow="mid"
        width={['100%', '100%', 'calc(100% - 352px)', 'calc(100% - 352px)']}
        order={[3, 3, 1, 1]}
      >
        <Flex flexWrap="wrap">
          {tabs.map((_tab, key) => {
            return (
              <Box
                mr={space('base')}
                mb={space('base')}
                _hover={{
                  cursor: 'pointer',
                  borderColor: themeColor('ink.400'),
                }}
                onClick={() => handleSetTab(_tab.slug)}
              >
                <InlineCode
                  borderColor={(_tab.slug === tab && themeColor('blue.400')) || 'inherit'}
                  color={_tab.slug === tab && color('accent')}
                >
                  {_tab.label}
                </InlineCode>
              </Box>
            );
          })}
        </Flex>
        <SimpleCodeBlock
          showLineNumbers
          flexGrow={1}
          language="jsx"
          editorCode={getExampleCode()}
        />
      </Box>
      <Box
        display={['none', 'none', 'block', 'block']}
        order={[1, 1, 2, 2]}
        width="320px"
        overflow="hidden"
        flexShrink={0}
      >
        <ExampleComponent />
      </Box>
    </Flex>
  );
};
