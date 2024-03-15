import type { HTMLStyledProps } from 'leather-styles/types';

import { isEven } from '@app/common/math/helpers';

import { AddressDisplayerLayout } from './address-displayer.layout';
import { groupByFour } from './address-displayer.utils';

interface AddressDisplayerProps extends HTMLStyledProps<'span'> {
  address: string;
}
export function AddressDisplayer({ address, ...props }: AddressDisplayerProps) {
  return (
    <>
      {groupByFour(address).map((letterGroup, index) => (
        <AddressDisplayerLayout key={index} isEven={isEven(index + 1)} {...props}>
          {letterGroup}
        </AddressDisplayerLayout>
      ))}
    </>
  );
}
