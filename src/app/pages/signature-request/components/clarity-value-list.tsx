import { ClarityType, ClarityValue, cvToString } from '@stacks/transactions';
import { principalToString } from '@stacks/transactions/dist/esm/clarity/types/principalCV';

export function ClarityValueListDisplayer(props: {
  val: ClarityValue;
  encoding?: 'tryAscii' | 'hex';
  isRoot?: boolean;
}): JSX.Element {
  const { val, encoding, isRoot = true } = props;

  function wrapText(text: string): JSX.Element {
    return <>{text}</>;
  }
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
      return (
        <dl
          style={{
            display: 'flex',
            flexFlow: 'row',
            flexWrap: 'wrap',
            paddingTop: isRoot ? '0' : '20px',
            overflow: 'visible',
          }}
        >
          {Object.keys(val.data).map(key => {
            return (
              <>
                <dt style={{ flex: '0 0 20%', color: '#74777D' }}>{key}:</dt>
                <dd style={{ flex: '0 0 80%' }}>
                  <ClarityValueListDisplayer
                    val={val.data[key]}
                    encoding={'tryAscii'}
                    isRoot={false}
                  />
                </dd>
              </>
            );
          })}
        </dl>
      );
    case ClarityType.StringASCII:
      return wrapText(`"${val.data}"`);
    case ClarityType.StringUTF8:
      return wrapText(`u"${val.data}"`);
  }
}
