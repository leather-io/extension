import { ReactNode } from 'react';

import { Box, Stack } from '@stacks/ui';

import { PsbtDecodedNodeFooter } from '../psbt-decoded-node-footer';

interface PsbtDecodedInputLayoutProps {
  address: string;
  children: ReactNode;
}
export function PsbtDecodedInputLayout({ address, children }: PsbtDecodedInputLayoutProps) {
  return (
    <Stack spacing="base">
      <Box pb="tight" mt="loose">
        {children}
      </Box>
      <hr />
      <PsbtDecodedNodeFooter address={address} type="input" />
    </Stack>
  );
}
