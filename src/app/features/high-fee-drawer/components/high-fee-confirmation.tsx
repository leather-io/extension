import { Button, Stack } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { TransactionFormValues } from '@shared/models/form.model';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Link } from '@app/components/link';
import { Caption, Title } from '@app/components/typography';

const url = 'https://hiro.so/questions/fee-estimates';

export function HighFeeConfirmation(): JSX.Element | null {
  const { handleSubmit, values } = useFormikContext<TransactionFormValues>();
  const { isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation } = useDrawers();

  return (
    <Stack px="loose" spacing="loose" pb="extra-loose">
      <Title fontSize="20px" fontWeight={400} lineHeight="28px">
        Are you sure you want to pay {values.fee} STX in fees for this transaction?
      </Title>
      <Caption>
        This action cannot be undone and the fees won't be returned, even if the transaction fails.{' '}
        <Link fontSize="14px" onClick={() => openInNewTab(url)}>
          Learn more
        </Link>
      </Caption>
      <Stack isInline mt="loose">
        <Button
          borderRadius="10px"
          mode="tertiary"
          onClick={() => setIsShowingHighFeeConfirmation(!isShowingHighFeeConfirmation)}
          width="50%"
        >
          Edit fee
        </Button>
        <Button
          borderRadius="10px"
          onClick={() => {
            setIsShowingHighFeeConfirmation(!isShowingHighFeeConfirmation);
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
