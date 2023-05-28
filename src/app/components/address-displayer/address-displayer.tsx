import { isEven } from '@app/common/math/helpers';

import { AddressDisplayerLayout } from './address-displayer.layout';

function groupByFour(text: string) {
  const result = [];

  for (let i = 0; i < text.length; i += 4) {
    result.push(text.slice(i, i + 4));
  }

  return result;
}

interface AddressDisplayerProps {
  address: string;
}
export function AddressDisplayer({ address }: AddressDisplayerProps) {
  return (
    <>
      {groupByFour(address).map((letterGroup, index) => (
        <AddressDisplayerLayout key={index} isEven={isEven(index + 1)}>
          {letterGroup}
        </AddressDisplayerLayout>
      ))}
    </>
  );
}
