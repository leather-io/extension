import { useState } from 'react';

import { styled } from 'leather-styles/jsx';

import { useFilteredStacksFungibleTokenList } from '@app/query/stacks/balance/stacks-ft-balances.hooks';
import { Accordion } from '@app/ui/components/accordion/accordion';

import { StacksFungibleTokenAssetListLayout } from './stacks-fungible-token-asset-list.layout';

const accordionValue = 'accordion-unsupported-token-asset-list';

export function StacksUnsupportedTokenAssetList({ address }: { address: string }) {
  const stacksFilteredFtAssetBalances = useFilteredStacksFungibleTokenList({
    address,
    filter: 'unsupported',
  });

  const [isOpen, setIsOpen] = useState(false);
  function onValueChange(value: string) {
    setIsOpen(value === accordionValue);
  }

  if (stacksFilteredFtAssetBalances.length === 0) {
    return null;
  }

  return (
    <Accordion.Root onValueChange={onValueChange} type="single" collapsible>
      <Accordion.Item title="Stacks Fungible Tokens" value={accordionValue}>
        <Accordion.Trigger>
          <styled.span>View {isOpen ? 'fewer' : 'more'}</styled.span>
        </Accordion.Trigger>
        <Accordion.Content>
          <StacksFungibleTokenAssetListLayout assetBalances={stacksFilteredFtAssetBalances} />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
