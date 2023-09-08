import { useFormikContext } from 'formik';
import { HStack, Stack } from 'leather-styles/jsx';

import {
  BitcoinSendFormValues,
  StacksSendFormValues,
  StacksTransactionFormValues,
} from '@shared/models/form.model';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { LeatherButton } from '@app/components/button/button';
import { Link } from '@app/components/link';
import { Caption, Title } from '@app/components/typography';

export function HighFeeConfirmation(props: { learnMoreUrl: string }) {
  const { learnMoreUrl } = props;
  const { handleSubmit, values } = useFormikContext<
    BitcoinSendFormValues | StacksSendFormValues | StacksTransactionFormValues
  >();
  const { setIsShowingHighFeeConfirmation } = useDrawers();

  return (
    <Stack px="space.05" gap="space.05" pb="space.06">
      <Title fontSize="20px" fontWeight={400} lineHeight="28px">
        Are you sure you want to pay {values.fee} {values.feeCurrency} in fees for this transaction?
      </Title>
      <Caption>
        This action cannot be undone and the fees won't be returned, even if the transaction fails.{' '}
        <Link fontSize="14px" onClick={() => openInNewTab(learnMoreUrl)}>
          Learn more
        </Link>
      </Caption>
      <HStack mt="space.05">
        <LeatherButton
          borderRadius="10px"
          // #4164 FIXME migrate tertiary
          // mode="tertiary"
          variant="ghost"
          onClick={() => setIsShowingHighFeeConfirmation(false)}
          width="50%"
        >
          Edit fee
        </LeatherButton>
        <LeatherButton borderRadius="10px" onClick={() => handleSubmit()} width="50%">
          Yes, I'm sure
        </LeatherButton>
      </HStack>
    </Stack>
  );
}
