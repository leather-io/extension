import { ReactNode } from 'react';

import { HStack, styled } from 'leather-styles/jsx';

import { ListItemLayout } from './list-item.layout';

export interface ListItemType {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  label: string;
}

type ListItemProps = ListItemType;

function ItemContentLeft({ iconLeft, label }: Omit<ListItemProps, 'iconRight'>) {
  return (
    <HStack gap="space.02" minHeight="24px">
      {iconLeft}
      <styled.span textStyle="label.02">{label}</styled.span>
    </HStack>
  );
}

export function ListItem({ iconLeft, iconRight, label }: ListItemProps) {
  return (
    <ListItemLayout
      contentLeft={<ItemContentLeft iconLeft={iconLeft} label={label} />}
      contentRight={iconRight}
    />
  );
}
