import { bytesToHex } from '@stacks/common';
import { css } from 'leather-styles/css';
import { Box } from 'leather-styles/jsx';

import { isBigInt, isTypedArray } from '@leather.io/utils';

export function parseJson(content: string) {
  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch (e) {
    return content;
  }
}

function parseJsonReadable(value: any) {
  if (isBigInt(value)) return value.toString();
  if (isTypedArray(value)) return bytesToHex(value);
  return value;
}

export function Json(value: any) {
  return (
    <Box
      className={css({
        '& pre': {
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        },
      })}
      textStyle="caption.01"
      mt="space.05"
    >
      <pre>{JSON.stringify(value, (_, v) => parseJsonReadable(v), 2)}</pre>
    </Box>
  );
}
