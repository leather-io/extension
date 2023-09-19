import { Box as RBox, Tabs as RTabs } from '@radix-ui/themes';
import { styled } from 'leather-styles/jsx';

import { capitalize } from '@app/common/utils';

interface Tabs {
  slug: string;
  label: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabClick,
  ...rest
}: {
  tabs: Tabs[];
  activeTab: number;
  onTabClick: (index: number) => void;
}) {
  return (
    <RTabs.Root
      value={activeTab.toString()}
      onValueChange={(value: string) => onTabClick(Number(value))}
      {...rest}
    >
      <RTabs.List>
        {tabs.map((tab, index) => (
          <RTabs.Trigger data-testid={`tab-${tab.label}`} key={tab.slug} value={index.toString()}>
            <RBox>
              <styled.span textStyle="label.01">{capitalize(tab.label)}</styled.span>
            </RBox>
          </RTabs.Trigger>
        ))}
      </RTabs.List>
    </RTabs.Root>
  );
}
