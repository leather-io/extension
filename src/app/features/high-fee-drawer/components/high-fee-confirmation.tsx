import { useFormikContext } from 'formik';
import { HStack, Stack } from 'leather-styles/jsx';

import {
  BitcoinSendFormValues,
  StacksSendFormValues,
  StacksTransactionFormValues,
} from '@shared/models/form.model';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Button } from '@app/ui/components/button/button';
import { Link } from '@app/ui/components/link/link';
import { Caption } from '@app/ui/components/typography/caption';
import { Title } from '@app/ui/components/typography/title';

export function HighFeeConfirmation({ learnMoreUrl }: { learnMoreUrl: string }) {
  const { handleSubmit, values } = useFormikContext<
    BitcoinSendFormValues | StacksSendFormValues | StacksTransactionFormValues
  >();
  const { setIsShowingHighFeeConfirmation } = useDrawers();

  return (
    <Stack px="space.05" gap="space.05" pb="space.06">
      <Title>
        Are you sure you want to pay {values.fee} {values.feeCurrency} in fees for this transaction?
      </Title>
      <Caption>
        This action cannot be undone and the fees won't be returned, even if the transaction fails.{' '}
        <Link onClick={() => openInNewTab(learnMoreUrl)} size="sm">
          Learn more
        </Link>
      </Caption>
      <HStack mt="space.05">
        <Button
          onClick={() => setIsShowingHighFeeConfirmation(false)}
          width="50%"
          variant="outline"
        >
          Edit fee
        </Button>
        <Button onClick={() => handleSubmit()} width="50%" type="submit">
          Yes, I'm sure
        </Button>
      </HStack>
    </Stack>
  );
}
