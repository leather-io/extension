import React from 'react';
import { useFormikContext } from 'formik';
import { Button, Stack } from '@stacks/ui';

import { useDrawers } from '@common/hooks/use-drawers';
import { TransactionFormValues } from '@common/types';
import { openInNewTab } from '@common/utils/open-in-new-tab';
import { Link } from '@components/link';
import { Caption, Title } from '@components/typography';

const URL = 'https://hiro.so/questions/fee-estimates';

export function HighFeeConfirmation(): JSX.Element | null {
  const { handleSubmit, values } = useFormikContext<TransactionFormValues>();
  const { showHighFeeConfirmation, setShowHighFeeConfirmation } = useDrawers();

  return (
    <Stack px="loose" spacing="loose" pb="extra-loose">
      <Title fontSize="20px" fontWeight={400} lineHeight="28px">
        Are you sure you want to pay {values.txFee} STX in fees for this transaction?
      </Title>
      <Caption>
        This action cannot be undone and the fees won't be returned, even if the transaction fails.{' '}
        <Link fontSize="14px" onClick={() => openInNewTab(URL)}>
          Learn more
        </Link>
      </Caption>
      <Stack isInline mt="loose">
        <Button
          borderRadius="10px"
          mode="tertiary"
          onClick={() => setShowHighFeeConfirmation(!showHighFeeConfirmation)}
          width="50%"
        >
          Edit fee
        </Button>
        <Button
          borderRadius="10px"
          onClick={() => {
            setShowHighFeeConfirmation(!showHighFeeConfirmation);
            handleSubmit();
          }}
          width="50%"
        >
          Yes, I'm sure
        </Button>
      </Stack>
    </Stack>
  );
}
