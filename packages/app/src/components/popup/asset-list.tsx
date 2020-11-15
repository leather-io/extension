import React, { useState } from 'react';
import { Box, Flex, Text, BoxProps } from '@blockstack/ui';
import { TokenAssets } from '@components/popup/token-assets';
import { CollectibleAssets } from '@components/popup/collectible-assets';

type Tab = 'tokens' | 'collectibles';

export const AssetList: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('tokens');

  const getTabStyles = (tab: Tab): BoxProps => {
    if (tab === currentTab) {
      return {
        borderColor: 'blue',
        borderWidth: '0 0 2px 0',
        color: 'blue',
      };
    }
    return {};
  };

  const TabHeader: React.FC<{ tab: Tab }> = ({ tab }) => {
    const tabName = new String(tab);
    return (
      <Box
        width="50%"
        textAlign="center"
        p="base-tight"
        cursor="pointer"
        {...getTabStyles(tab)}
        onClick={() => setCurrentTab(tab)}
      >
        <Text>{tabName.charAt(0).toUpperCase() + tabName.slice(1)}</Text>
      </Box>
    );
  };

  return (
    <Flex mt="base" flexWrap="wrap" flexDirection="column">
      <Flex width="100%">
        <TabHeader tab="tokens" />
        <TabHeader tab="collectibles" />
      </Flex>
      <TokenAssets display={currentTab === 'tokens' ? 'block' : 'none'} />
      <CollectibleAssets display={currentTab === 'collectibles' ? 'block' : 'none'} />
    </Flex>
  );
};
