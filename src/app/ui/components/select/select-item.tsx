import * as RadixSelect from '@radix-ui/react-select';
import { HStack, styled } from 'leather-styles/jsx';

import { CheckmarkIcon } from '../icons/checkmark-icon';
import { ListItemType } from '../list/list-item';
import { ListItemLayout } from '../list/list-item.layout';
import { listItemStyles } from '../list/list.styles';

type SelectItemProps = ListItemType;

export function SelectItem({ iconLeft, iconRight, label }: SelectItemProps) {
  return (
    <RadixSelect.Item className={listItemStyles} value={label}>
      <ListItemLayout
        contentLeft={
          <HStack gap="space.02">
            {iconLeft}
            <RadixSelect.ItemText>
              <styled.span textStyle="label.02">{label}</styled.span>
            </RadixSelect.ItemText>
            <RadixSelect.ItemIndicator>
              <CheckmarkIcon />
            </RadixSelect.ItemIndicator>
          </HStack>
        }
        contentRight={iconRight}
      />
    </RadixSelect.Item>
  );
}
