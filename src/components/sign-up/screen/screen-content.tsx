import React from 'react';

import { Box, Stack } from '@blockstack/ui';
import { Title, Body } from '../typography';

interface ScreenContentProps {
  title: string;
  body?: (string | JSX.Element)[];
}

export const ScreenContent: React.FC<ScreenContentProps> = ({ title, body }) => (
  <Box p={5}>
    <Stack spacing={2}>
      <Title>{title}</Title>
      <Stack spacing={[3, 4]}>
        {body && body.length ? body.map((text, key) => <Body key={key}>{text}</Body>) : body}
      </Stack>
    </Stack>
  </Box>
);
