import { ClarityType, ClarityValue, cvToString } from '@stacks/transactions';
import { principalToString } from '@stacks/transactions/dist/esm/clarity/types/principalCV';

function wrapText(text: string): JSX.Element {
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
        const str = val.buffer.toString('ascii');
        if (/[ -~]/.test(str)) {
          return wrapText(JSON.stringify(str));
        }
      }
      return wrapText(`0x${val.buffer.toString('hex')}`);
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
      const rootStyles = isRoot
        ? {
            flex: '1 100%',
            paddingTop: '12px',
            marginLeft: 0,
            fontFamily: 'Fira Code',
          }
        : {};
      return (
        <div
          style={{
            marginLeft: '20px',
            overflow: 'visible',
            ...rootStyles,
          }}
        >
          {Object.entries(val.data).map(([key, value]) => {
            return (
              <div style={{ display: value.type !== ClarityType.Tuple ? 'flex' : undefined }}>
                <span
                  style={{
                    marginRight: '16px',
                    color: '#74777D',
                  }}
                >
                  {key}:
                </span>
                <span
                  style={{
                    display: 'flex',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-line',
                  }}
                >
                  <ClarityValueListDisplayer val={value} encoding={'tryAscii'} isRoot={false} />
                </span>
              </div>
            );
          })}
        </div>
      );
    case ClarityType.StringASCII:
      return wrapText(`"${val.data}"`);
    case ClarityType.StringUTF8:
      return wrapText(`u"${val.data}"`);
  }
}
