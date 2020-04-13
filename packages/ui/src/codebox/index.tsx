import React, { useState } from 'react';
import css from '@styled-system/css';
import { Highlighter } from '../highlighter';
import { Box, BoxProps } from '../box';

export const CodeBlock = ({
  code,
  showLineNumbers,
  ...rest
}: { code: string; showLineNumbers?: boolean } & BoxProps) => {
  const [editorCode] = useState(code?.toString().trim());

  return (
    <Box
      css={css({
        '*': {
          whiteSpace: 'pre',
          fontFamily: 'Fira Code',
          fontSize: '14px',
        },
      })}
      overflowX="auto"
      bg="ink"
      borderRadius={[0, 0, '12px']}
      py="base"
      width="100%"
      {...rest}
    >
      <Highlighter showLineNumbers={showLineNumbers} code={editorCode} />
    </Box>
  );
};
