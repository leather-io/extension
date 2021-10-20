import React from 'react';
import { StacksTransaction } from '@stacks/transactions';
import { Button, Stack } from '@stacks/ui';

import { LoadingKeys, useLoading } from '@common/hooks/use-loading';

interface SendTokensConfirmActionsProps {
  handleSubmit: () => void;
  transaction: StacksTransaction | undefined;
}

export function SendTokensConfirmActions(props: SendTokensConfirmActionsProps): JSX.Element {
  const { handleSubmit, transaction } = props;
  const { isLoading } = useLoading(LoadingKeys.CONFIRM_DRAWER);

  return (
    <Stack spacing="base" width="100%">
      <Button
        borderRadius="12px"
        mode="primary"
        isDisabled={!transaction || isLoading}
        onClick={handleSubmit}
        isLoading={!transaction || isLoading}
        type="submit"
      >
        Send
      </Button>
    </Stack>
  );
}
