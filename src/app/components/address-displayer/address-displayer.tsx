import { isEven, isMultipleOf } from '@app/common/utils';

import { AddressDisplayerLayout } from './address-displayer.layout';

const isMultipleOfFour = isMultipleOf(4);

function groupByFour(text: string) {
  const initialValue = { result: [] as string[][], tmp: [] as string[] };

  const textGrouper = ({ result, tmp }: typeof initialValue, letter: string, index: number) => {
    tmp.push(letter);
    if (isMultipleOfFour(index + 1)) {
      result.push(tmp);
      tmp = [];
    }
    return { result, tmp };
  };

  return [...text].reduce(textGrouper, initialValue).result;
}

interface AddressDisplayerProps {
  address: string;
}
export function AddressDisplayer({ address }: AddressDisplayerProps) {
  return (
    <>
      {groupByFour(address).map((letterGroup, index) => (
        <AddressDisplayerLayout key={index} isEven={isEven(index + 1)}>
          {letterGroup.join('')}
        </AddressDisplayerLayout>
      ))}
    </>
  );
}
