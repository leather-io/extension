import { useState } from 'react';

import { Stack, styled } from 'leather-styles/jsx';

import { Accordion } from '@app/ui/components/accordion/accordion';

import { Sip10TokenAssetItem } from './sip10-token-asset-item';
import type { Sip10AssetItem } from './sip10-token-asset-list';

const accordionValue = 'accordion-unsupported-token-asset-list';

interface Sip10TokenAssetListUnsupportedProps {
  tokens: Sip10AssetItem[];
}
export function Sip10TokenAssetListUnsupported({ tokens }: Sip10TokenAssetListUnsupportedProps) {
  const [isOpen, setIsOpen] = useState(false);

  function onValueChange(value: string) {
    setIsOpen(value === accordionValue);
  }

  if (!tokens.length) return null;

  return (
    <Accordion.Root onValueChange={onValueChange} type="single" collapsible>
      <Accordion.Item title="Stacks Fungible Tokens" value={accordionValue}>
        <Accordion.Trigger>
          <styled.span>View {isOpen ? 'fewer' : 'more'}</styled.span>
        </Accordion.Trigger>
        <Accordion.Content>
          <Stack>
            {tokens.map(token => (
              <Sip10TokenAssetItem
                assetInfo={token.assetInfo}
                balance={token.balance}
                key={token.assetInfo.name}
                marketData={token.marketData}
              />
            ))}
          </Stack>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
