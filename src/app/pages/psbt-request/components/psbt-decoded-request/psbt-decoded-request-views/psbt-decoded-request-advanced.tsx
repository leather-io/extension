import { css } from '@emotion/react';
import { bytesToHex } from '@stacks/common';
import { Box } from '@stacks/ui';

import { isTypedArray } from '@shared/utils';

function parseJsonReadable(value: any) {
  if (typeof value === 'bigint') return value.toString();
  if (isTypedArray(value)) return bytesToHex(value);
  return value;
}

export function PsbtDecodedRequestAdvanced(props: { psbt: any }) {
  const { psbt } = props;
  return (
    <Box background="white" borderRadius="16px" p="loose">
      <Box
        css={css`
          pre {
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        `}
        fontSize="14px"
        lineHeight="1.7"
      >
        <pre>{JSON.stringify(psbt, (_, value) => parseJsonReadable(value), 2)}</pre>
      </Box>
    </Box>
  );
}
