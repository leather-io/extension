import { useState } from 'react';

import { Stack, styled } from 'leather-styles/jsx';

import { useFilteredSip10AccountCryptoAssetsWithDetails } from '@app/query/stacks/sip10/sip10-tokens.hooks';
import { Accordion } from '@app/ui/components/accordion/accordion';

import { Sip10TokenAssetItem } from './sip10-token-asset-item';

const accordionValue = 'accordion-unsupported-token-asset-list';

export function Sip10TokenAssetListUnsupported({ address }: { address: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const assets = useFilteredSip10AccountCryptoAssetsWithDetails({
    address,
    filter: 'unsupported',
  });

  function onValueChange(value: string) {
    setIsOpen(value === accordionValue);
  }

  if (!assets.length) return null;

  return (
    <Accordion.Root onValueChange={onValueChange} type="single" collapsible>
      <Accordion.Item title="Stacks Fungible Tokens" value={accordionValue}>
        <Accordion.Trigger>
          <styled.span>View {isOpen ? 'fewer' : 'more'}</styled.span>
        </Accordion.Trigger>
        <Accordion.Content>
          <Stack>
            {assets.map(asset => (
              <Sip10TokenAssetItem asset={asset} key={asset.info.contractId} />
            ))}
          </Stack>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
