import { bytesToAscii, bytesToHex } from '@stacks/common';
import { ClarityType, ClarityValue, cvToString } from '@stacks/transactions';
import { principalToString } from '@stacks/transactions/dist/esm/clarity/types/principalCV';

import {
  TupleDisplayer,
  TupleNodeDisplayer,
  TupleNodeLabelDisplayer,
  TupleNodeValueDisplayer,
} from './nested-tuple-displayer';

function wrapText(text: string): React.JSX.Element {
  return <>{text}</>;
}

interface ClarityValueListDisplayerProps {
  val: ClarityValue;
  encoding?: 'tryAscii' | 'hex';
  isRoot?: boolean;
}
export function ClarityValueListDisplayer(props: ClarityValueListDisplayerProps) {
  const { val, encoding, isRoot = true } = props;

  switch (val.type) {
    case ClarityType.BoolTrue:
      return wrapText('true');
    case ClarityType.BoolFalse:
      return wrapText('false');
    case ClarityType.Int:
      return wrapText(val.value.toString());
    case ClarityType.UInt:
      return wrapText(`u${val.value.toString()}`);
    case ClarityType.Buffer:
      if (encoding === 'tryAscii') {
        const str = bytesToAscii(val.buffer);
        if (/[ -~]/.test(str)) return wrapText(JSON.stringify(str));
      }
      return wrapText(`0x${bytesToHex(val.buffer)}`);
    case ClarityType.OptionalNone:
      return wrapText('none');
    case ClarityType.OptionalSome:
      return wrapText(`some ${cvToString(val.value, encoding)}`);
    case ClarityType.ResponseErr:
      return wrapText(`err ${cvToString(val.value, encoding)}`);
    case ClarityType.ResponseOk:
      return wrapText(`ok ${cvToString(val.value, encoding)}`);
    case ClarityType.PrincipalStandard:
    case ClarityType.PrincipalContract:
      return wrapText(principalToString(val));
    case ClarityType.List:
      return wrapText(`[${val.list.map(v => cvToString(v, encoding)).join(', ')}]`);
    case ClarityType.Tuple:
      return (
        <TupleDisplayer isRoot={isRoot}>
          {Object.entries(val.data).map(([key, value]) => (
            <TupleNodeDisplayer clarityType={value.type} key={key}>
              <TupleNodeLabelDisplayer>{key}:</TupleNodeLabelDisplayer>
              <TupleNodeValueDisplayer>
                <ClarityValueListDisplayer val={value} encoding="tryAscii" isRoot={false} />
              </TupleNodeValueDisplayer>
            </TupleNodeDisplayer>
          ))}
        </TupleDisplayer>
      );
    case ClarityType.StringASCII:
      return wrapText(`"${val.data}"`);
    case ClarityType.StringUTF8:
      return wrapText(`u"${val.data}"`);
  }
}
