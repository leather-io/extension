import { bytesToHex } from '@stacks/common';
import { Box } from '@stacks/ui';
import { css } from 'leaf-styles/css';

import { isBigInt, isTypedArray } from '@shared/utils';

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
      fontSize="14px"
      lineHeight="1.7"
      mt="loose"
    >
      <pre>{JSON.stringify(value, (_, v) => parseJsonReadable(v), 2)}</pre>
    </Box>
  );
}
