import { Box, Button } from '@stacks/ui';

interface CreateAccountActionProps {
  onCreateAccount(): void;
}
export function CreateAccountAction({ onCreateAccount }: CreateAccountActionProps) {
  return (
    <Box pt="base" pb="loose" px="loose">
      <Button borderRadius="10px" onClick={() => onCreateAccount()}>
        Create an account
      </Button>
    </Box>
  );
}
