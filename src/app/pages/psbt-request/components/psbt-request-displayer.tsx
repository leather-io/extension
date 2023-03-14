import { Box, Text, color } from '@stacks/ui';

import { isUndefined } from '@shared/utils';

import { isTypedArray } from '@app/common/utils';

function wrapText(text: string): JSX.Element {
  return <Text wordWrap="break-word">{text}</Text>;
}

// TODO: In progress for v2 of this feature - rename
function Value({ val }: { val: any }) {
  if (isUndefined(val)) return wrapText('undefined');
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    return wrapText(val.toString());
  } else if (isTypedArray(val)) {
    // TODO: Decode this properly
    return wrapText(val.toString());
  } else if (val instanceof Array) {
    // TODO: Refactor this for better UI display
    return (
      <>
        <Box textIndent="0em">
          [
          {val.map((v, i) => {
            return (
              <div>
                <Value key={i} val={v} />
                {i < val.length - 1 && <>,</>}
              </div>
            );
          })}
          ]
        </Box>
      </>
    );
  } else if (typeof val === 'object') {
    return <PsbtRequestDisplayer details={val} />;
  } else if (typeof val === 'bigint') {
    return wrapText(val.toString());
  } else {
    return wrapText(JSON.stringify(val));
  }
}

interface PsbtRequestDisplayerProps {
  details?: object;
}
// TODO: In progress for v2 of this feature
export function PsbtRequestDisplayer({ details }: PsbtRequestDisplayerProps) {
  if (!details) return null;

  return (
    <>
      {Object.entries(details).map(([key, value]) => (
        <Box key={key} ml="loose" textIndent="-1em">
          <Text color={color('text-caption')} mr="base">
            {key}:
          </Text>{' '}
          <Value val={value} />
        </Box>
      ))}
    </>
  );
}
