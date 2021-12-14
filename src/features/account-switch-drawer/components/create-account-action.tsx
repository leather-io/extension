import React from 'react';
import { Box, Button } from '@stacks/ui';

interface CreateAccountActionProps {
  onCreateAccount(): void;
}
export function CreateAccountAction({ onCreateAccount }: CreateAccountActionProps) {
  return (
    <Box pt="base" pb="loose" px="loose">
      <Button onClick={() => onCreateAccount()}>Create an account</Button>
    </Box>
  );
}
